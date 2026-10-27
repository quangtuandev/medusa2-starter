"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const email_settings_1 = require("../../../modules/email-settings");
const zod_1 = require("zod");
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: zod_1.z.string().email("Email không hợp lệ"),
    message: zod_1.z.string().min(10, "Nội dung tin nhắn phải có ít nhất 10 ký tự"),
});
// POST /store/contact — Handle contact form submission
const POST = async (req, res) => {
    const logger = req.scope.resolve("logger");
    try {
        const validatedData = contactSchema.parse(req.body);
        const notificationService = req.scope.resolve(utils_1.Modules.NOTIFICATION);
        const emailSettingsService = req.scope.resolve(email_settings_1.EMAIL_SETTINGS_MODULE);
        const settings = await emailSettingsService.listEmailSettings();
        const now = new Date();
        const formattedDate = now.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
        });
        const templateData = {
            name: validatedData.name,
            email: validatedData.email,
            message: validatedData.message.replace(/\n/g, "<br/>"),
            date: formattedDate,
            store_name: "Kira Parfums",
        };
        // Helper function to replace variables
        const replaceVariables = (template) => {
            let result = template;
            for (const [key, value] of Object.entries(templateData)) {
                result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
            }
            return result;
        };
        let internalSent = false;
        let confirmationSent = false;
        // 1. Send internal notification to store staff/admin
        const internalSetting = settings.find((s) => s.type === "contact_us_notification");
        if (internalSetting?.is_enabled && internalSetting.recipients) {
            const recipientList = internalSetting.recipients
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e.length > 0);
            const finalSubject = replaceVariables(internalSetting.subject || "[Liên hệ mới] Từ {{name}} - {{email}}");
            const finalHtml = replaceVariables(internalSetting.body_html || "<p>{{message}}</p>");
            for (const recipient of recipientList) {
                try {
                    await notificationService.createNotifications({
                        to: recipient,
                        channel: "email",
                        template: "contact-us-notification",
                        data: {
                            subject: finalSubject,
                            html: finalHtml,
                        },
                    });
                    internalSent = true;
                    logger.info(`[Contact] Internal notification sent to ${recipient} for message from ${validatedData.email}`);
                }
                catch (err) {
                    logger.error(`[Contact] Failed to send internal notification to ${recipient}: ${err.message}`);
                }
            }
        }
        // 2. Send confirmation auto-reply to customer
        const confirmationSetting = settings.find((s) => s.type === "contact_us_confirmation");
        if (confirmationSetting?.is_enabled && validatedData.email) {
            try {
                const finalSubject = replaceVariables(confirmationSetting.subject || "Cảm ơn bạn đã liên hệ");
                const finalHtml = replaceVariables(confirmationSetting.body_html || "<p>Cảm ơn bạn đã liên hệ!</p>");
                await notificationService.createNotifications({
                    to: validatedData.email,
                    channel: "email",
                    template: "contact-us-confirmation",
                    data: {
                        subject: finalSubject,
                        html: finalHtml,
                    },
                });
                confirmationSent = true;
                logger.info(`[Contact] Confirmation sent to ${validatedData.email}`);
            }
            catch (err) {
                logger.error(`[Contact] Failed to send confirmation to ${validatedData.email}: ${err.message}`);
            }
        }
        res.status(200).json({
            success: true,
            message: "Tin nhắn của bạn đã được gửi thành công!",
            details: {
                internalSent,
                confirmationSent,
            },
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.errors,
            });
        }
        logger.error(`[Contact] Error processing contact form: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message || "Không thể gửi tin nhắn liên hệ. Vui lòng thử lại sau.",
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NvbnRhY3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEscURBQW1EO0FBRW5ELG9FQUF1RTtBQUN2RSw2QkFBdUI7QUFFdkIsTUFBTSxhQUFhLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsNkJBQTZCLENBQUM7SUFDdEQsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUM7SUFDN0MsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLDRDQUE0QyxDQUFDO0NBQzVFLENBQUMsQ0FBQTtBQUlGLHVEQUF1RDtBQUNoRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3JCLEdBQWdDLEVBQ2hDLEdBQW1CLEVBQ3JCLEVBQUU7SUFDQSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUUxQyxJQUFJLENBQUM7UUFDRCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuRCxNQUFNLG1CQUFtQixHQUNyQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDM0MsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxzQ0FBcUIsQ0FBQyxDQUFBO1FBRXJFLE1BQU0sUUFBUSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUUvRCxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxD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