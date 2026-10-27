import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"
import { EMAIL_SETTINGS_MODULE } from "../../../modules/email-settings"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    message: z.string().min(10, "Nội dung tin nhắn phải có ít nhất 10 ký tự"),
})

type ContactInput = z.infer<typeof contactSchema>

// POST /store/contact — Handle contact form submission
export const POST = async (
    req: MedusaRequest<ContactInput>,
    res: MedusaResponse
) => {
    const logger = req.scope.resolve("logger")

    try {
        const validatedData = contactSchema.parse(req.body)

        const notificationService: INotificationModuleService =
            req.scope.resolve(Modules.NOTIFICATION)
        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)

        const settings = await emailSettingsService.listEmailSettings()

        const now = new Date()
        const formattedDate = now.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
        })

        const templateData: Record<string, string> = {
            name: validatedData.name,
            email: validatedData.email,
            message: validatedData.message.replace(/\n/g, "<br/>"),
            date: formattedDate,
            store_name: "Kira Parfums",
        }

        // Helper function to replace variables
        const replaceVariables = (template: string) => {
            let result = template
            for (const [key, value] of Object.entries(templateData)) {
                result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value)
            }
            return result
        }

        let internalSent = false
        let confirmationSent = false

        // 1. Send internal notification to store staff/admin
        const internalSetting = settings.find(
            (s: any) => s.type === "contact_us_notification"
        )

        if (internalSetting?.is_enabled && internalSetting.recipients) {
            const recipientList = internalSetting.recipients
                .split(",")
                .map((e: string) => e.trim())
                .filter((e: string) => e.length > 0)

            const finalSubject = replaceVariables(internalSetting.subject || "[Liên hệ mới] Từ {{name}} - {{email}}")
            const finalHtml = replaceVariables(internalSetting.body_html || "<p>{{message}}</p>")

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
                    })
                    internalSent = true
                    logger.info(`[Contact] Internal notification sent to ${recipient} for message from ${validatedData.email}`)
                } catch (err: any) {
                    logger.error(`[Contact] Failed to send internal notification to ${recipient}: ${err.message}`)
                }
            }
        }

        // 2. Send confirmation auto-reply to customer
        const confirmationSetting = settings.find(
            (s: any) => s.type === "contact_us_confirmation"
        )

        if (confirmationSetting?.is_enabled && validatedData.email) {
            try {
                const finalSubject = replaceVariables(confirmationSetting.subject || "Cảm ơn bạn đã liên hệ")
                const finalHtml = replaceVariables(confirmationSetting.body_html || "<p>Cảm ơn bạn đã liên hệ!</p>")

                await notificationService.createNotifications({
                    to: validatedData.email,
                    channel: "email",
                    template: "contact-us-confirmation",
                    data: {
                        subject: finalSubject,
                        html: finalHtml,
                    },
                })
                confirmationSent = true
                logger.info(`[Contact] Confirmation sent to ${validatedData.email}`)
            } catch (err: any) {
                logger.error(`[Contact] Failed to send confirmation to ${validatedData.email}: ${err.message}`)
            }
        }

        res.status(200).json({
            success: true,
            message: "Tin nhắn của bạn đã được gửi thành công!",
            details: {
                internalSent,
                confirmationSent,
            },
        })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.errors,
            })
        }

        logger.error(`[Contact] Error processing contact form: ${error.message}`)
        res.status(500).json({
            success: false,
            message: error.message || "Không thể gửi tin nhắn liên hệ. Vui lòng thử lại sau.",
        })
    }
}
