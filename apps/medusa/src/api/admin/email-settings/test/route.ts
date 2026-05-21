import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"
import { z } from "zod"

const testEmailSchema = z.object({
    to: z.string().email("Invalid email address"),
    subject: z.string().optional().default("Test Email - Kiểm tra cấu hình email"),
    body_html: z.string().optional().default(`
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">✅ Email hoạt động!</h2>
  <p style="color: #555; line-height: 1.6;">
    Đây là email test để xác nhận cấu hình SMTP đã hoạt động chính xác.
  </p>
  <p style="color: #999; font-size: 12px;">Gửi lúc: {{timestamp}}</p>
</div>
    `.trim()),
})

// POST /admin/email-settings/test — send a test email
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const validatedData = testEmailSchema.parse(req.body)

        const notificationService: INotificationModuleService =
            req.scope.resolve(Modules.NOTIFICATION)

        await notificationService.createNotifications({
            to: validatedData.to,
            channel: "email",
            template: "test-email",
            data: {
                subject: validatedData.subject,
                html: validatedData.body_html,
                timestamp: new Date().toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                }),
            },
        })

        res.status(200).json({
            success: true,
            message: `Test email sent to ${validatedData.to}`,
        })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
        }
        res.status(500).json({
            success: false,
            message: error.message || "Failed to send test email",
        })
    }
}
