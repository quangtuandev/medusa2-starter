import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { EMAIL_SETTINGS_MODULE } from "../modules/email-settings"

export default async function orderPlacedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const logger = container.resolve("logger")

    try {
        const orderService: IOrderModuleService = container.resolve(Modules.ORDER)
        const notificationService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
        const emailSettingsService = container.resolve(EMAIL_SETTINGS_MODULE)

        // Retrieve the order with items
        const order = await orderService.retrieveOrder(data.id, {
            relations: ["items", "shipping_address"],
        })

        if (!order) {
            logger.warn(`[Email] Order ${data.id} not found, skipping notification`)
            return
        }

        // Retrieve email settings
        const settings = await emailSettingsService.listEmailSettings()

        // Build template data
        const customerName = order.shipping_address
            ? `${order.shipping_address.first_name || ""} ${order.shipping_address.last_name || ""}`.trim()
            : "Khách hàng"

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
            : "Không có"

        // Format total
        const total = order.total
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: order.currency_code?.toUpperCase() || "VND",
            }).format(Number(order.total))
            : "N/A"

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
                        .map(
                            (item: any) => `
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 8px;">${item.title || item.product_title || "N/A"}</td>
                            <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                            <td style="text-align: right; padding: 8px;">${
                                item.unit_price
                                    ? new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: order.currency_code?.toUpperCase() || "VND",
                                    }).format(Number(item.unit_price))
                                    : "N/A"
                            }</td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>`
            : "<p>Không có sản phẩm</p>"

        const templateData: Record<string, string> = {
            order_id: order.id,
            display_id: String(order.display_id || order.id),
            customer_name: customerName,
            customer_email: order.email || "",
            total,
            items: itemsHtml,
            shipping_address: shippingAddress,
            store_name: "Kira Parfums",
        }

        // 1. Send customer order confirmation email
        const customerSetting = settings.find(
            (s: any) => s.type === "customer_order_confirmation"
        )

        if (customerSetting?.is_enabled && order.email) {
            try {
                // Replace template variables in subject
                let finalSubject = customerSetting.subject
                let finalHtml = customerSetting.body_html

                for (const [key, value] of Object.entries(templateData)) {
                    finalSubject = finalSubject.replace(
                        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
                        value
                    )
                    finalHtml = finalHtml.replace(
                        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
                        value
                    )
                }

                await notificationService.createNotifications({
                    to: order.email,
                    channel: "email",
                    template: "order-confirmation",
                    data: {
                        subject: finalSubject,
                        html: finalHtml,
                    },
                })

                logger.info(
                    `[Email] Customer confirmation sent to ${order.email} for order #${order.display_id}`
                )
            } catch (err: any) {
                logger.error(
                    `[Email] Failed to send customer confirmation for order ${order.id}: ${err.message}`
                )
            }
        }

        // 2. Send internal order notification email
        const internalSetting = settings.find(
            (s: any) => s.type === "internal_order_notification"
        )

        if (internalSetting?.is_enabled && internalSetting.recipients) {
            const recipientList = internalSetting.recipients
                .split(",")
                .map((e: string) => e.trim())
                .filter((e: string) => e.length > 0)

            for (const recipient of recipientList) {
                try {
                    let finalSubject = internalSetting.subject
                    let finalHtml = internalSetting.body_html

                    for (const [key, value] of Object.entries(templateData)) {
                        finalSubject = finalSubject.replace(
                            new RegExp(`\\{\\{${key}\\}\\}`, "g"),
                            value
                        )
                        finalHtml = finalHtml.replace(
                            new RegExp(`\\{\\{${key}\\}\\}`, "g"),
                            value
                        )
                    }

                    await notificationService.createNotifications({
                        to: recipient,
                        channel: "email",
                        template: "internal-order-notification",
                        data: {
                            subject: finalSubject,
                            html: finalHtml,
                        },
                    })

                    logger.info(
                        `[Email] Internal notification sent to ${recipient} for order #${order.display_id}`
                    )
                } catch (err: any) {
                    logger.error(
                        `[Email] Failed to send internal notification to ${recipient}: ${err.message}`
                    )
                }
            }
        }
    } catch (error: any) {
        logger.error(
            `[Email] Error handling order.placed event for order ${data.id}: ${error.message}`
        )
    }
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
