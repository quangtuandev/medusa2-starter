"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const utils_1 = require("@medusajs/framework/utils");
const email_settings_1 = require("../modules/email-settings");
async function orderPlacedHandler({ event: { data }, container, }) {
    const logger = container.resolve("logger");
    try {
        const orderService = container.resolve(utils_1.Modules.ORDER);
        const notificationService = container.resolve(utils_1.Modules.NOTIFICATION);
        const emailSettingsService = container.resolve(email_settings_1.EMAIL_SETTINGS_MODULE);
        // Retrieve the order with items
        const order = await orderService.retrieveOrder(data.id, {
            relations: ["items", "shipping_address"],
        });
        if (!order) {
            logger.warn(`[Email] Order ${data.id} not found, skipping notification`);
            return;
        }
        // Retrieve email settings
        const settings = await emailSettingsService.listEmailSettings();
        // Build template data
        const customerName = order.shipping_address
            ? `${order.shipping_address.first_name || ""} ${order.shipping_address.last_name || ""}`.trim()
            : "Khách hàng";
        const shippingAddress = order.shipping_address
            ? [
                order.shipping_address.address_1,
                order.shipping_address.address_2,
                order.shipping_address.city,
                order.shipping_address.province,
                order.shipping_address.country_code?.toUpperCase(),
            ]
                .filter(Boolean)
                .join(", ")
            : "Không có";
        // Format total
        const total = order.total
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: order.currency_code?.toUpperCase() || "VND",
            }).format(Number(order.total))
            : "N/A";
        // Build items HTML
        const itemsHtml = order.items?.length
            ? `<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <thead>
                    <tr style="border-bottom: 2px solid #eee;">
                        <th style="text-align: left; padding: 8px;">Sản phẩm</th>
                        <th style="text-align: center; padding: 8px;">SL</th>
                        <th style="text-align: right; padding: 8px;">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items
                .map((item) => `
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 8px;">${item.title || item.product_title || "N/A"}</td>
                            <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                            <td style="text-align: right; padding: 8px;">${item.unit_price
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: order.currency_code?.toUpperCase() || "VND",
                }).format(Number(item.unit_price))
                : "N/A"}</td>
                        </tr>
                    `)
                .join("")}
                </tbody>
            </table>`
            : "<p>Không có sản phẩm</p>";
        const templateData = {
            order_id: order.id,
            display_id: String(order.display_id || order.id),
            customer_name: customerName,
            customer_email: order.email || "",
            total,
            items: itemsHtml,
            shipping_address: shippingAddress,
            store_name: "Kira Parfums",
        };
        // 1. Send customer order confirmation email
        const customerSetting = settings.find((s) => s.type === "customer_order_confirmation");
        if (customerSetting?.is_enabled && order.email) {
            try {
                // Replace template variables in subject
                let finalSubject = customerSetting.subject;
                let finalHtml = customerSetting.body_html;
                for (const [key, value] of Object.entries(templateData)) {
                    finalSubject = finalSubject.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
                    finalHtml = finalHtml.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
                }
                await notificationService.createNotifications({
                    to: order.email,
                    channel: "email",
                    template: "order-confirmation",
                    data: {
                        subject: finalSubject,
                        html: finalHtml,
                    },
                });
                logger.info(`[Email] Customer confirmation sent to ${order.email} for order #${order.display_id}`);
            }
            catch (err) {
                logger.error(`[Email] Failed to send customer confirmation for order ${order.id}: ${err.message}`);
            }
        }
        // 2. Send internal order notification email
        const internalSetting = settings.find((s) => s.type === "internal_order_notification");
        if (internalSetting?.is_enabled && internalSetting.recipients) {
            const recipientList = internalSetting.recipients
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e.length > 0);
            for (const recipient of recipientList) {
                try {
                    let finalSubject = internalSetting.subject;
                    let finalHtml = internalSetting.body_html;
                    for (const [key, value] of Object.entries(templateData)) {
                        finalSubject = finalSubject.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
                        finalHtml = finalHtml.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
                    }
                    await notificationService.createNotifications({
                        to: recipient,
                        channel: "email",
                        template: "internal-order-notification",
                        data: {
                            subject: finalSubject,
                            html: finalHtml,
                        },
                    });
                    logger.info(`[Email] Internal notification sent to ${recipient} for order #${order.display_id}`);
                }
                catch (err) {
                    logger.error(`[Email] Failed to send internal notification to ${recipient}: ${err.message}`);
                }
            }
        }
    }
    catch (error) {
        logger.error(`[Email] Error handling order.placed event for order ${data.id}: ${error.message}`);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItcGxhY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL29yZGVyLXBsYWNlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxxQ0EyTEM7QUEvTEQscURBQW1EO0FBRW5ELDhEQUFpRTtBQUVsRCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFDN0MsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ2YsU0FBUyxHQUNvQjtJQUM3QixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRTFDLElBQUksQ0FBQztRQUNELE1BQU0sWUFBWSxHQUF3QixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxRSxNQUFNLG1CQUFtQixHQUErQixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUMvRixNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsc0NBQXFCLENBQUMsQ0FBQTtRQUVyRSxnQ0FBZ0M7UUFDaEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDcEQsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDO1NBQzNDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksQ0FBQyxFQUFFLG1DQUFtQyxDQUFDLENBQUE7WUFDeEUsT0FBTTtRQUNWLENBQUM7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBRS9ELHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsZ0JBQWdCO1lBQ3ZDLENBQUMs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