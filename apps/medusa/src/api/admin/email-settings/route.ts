import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { EMAIL_SETTINGS_MODULE } from "../../../modules/email-settings"
import { z } from "zod"

// Default email templates
const DEFAULT_TEMPLATES = [
    {
        type: "customer_order_confirmation",
        is_enabled: false,
        subject: "Xác nhận đơn hàng #{{display_id}} - Cảm ơn bạn đã mua hàng!",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
    <h1 style="color: #333; margin: 0; font-size: 24px;">Xác nhận đơn hàng</h1>
  </div>

  <div style="padding: 30px 0;">
    <p style="font-size: 16px; color: #333;">Xin chào <strong>{{customer_name}}</strong>,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Cảm ơn bạn đã đặt hàng! Đơn hàng <strong>#{{display_id}}</strong> của bạn đã được tiếp nhận thành công.
    </p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Chi tiết đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Mã đơn hàng:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">#{{display_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Tổng tiền:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{total}}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 20px 0;">
      {{items}}
    </div>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Chúng tôi sẽ thông báo cho bạn khi đơn hàng được vận chuyển.
    </p>

    <p style="font-size: 15px; color: #555;">
      Trân trọng,<br/>
      <strong>{{store_name}}</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Email này được gửi tự động, vui lòng không trả lời.</p>
  </div>
</div>
`.trim(),
        recipients: null,
    },
    {
        type: "internal_order_notification",
        is_enabled: false,
        subject: "[Đơn hàng mới] #{{display_id}} - {{customer_name}} - {{total}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e74c3c;">
    <h1 style="color: #e74c3c; margin: 0; font-size: 24px;">🔔 Đơn hàng mới!</h1>
  </div>

  <div style="padding: 30px 0;">
    <div style="background: #fff3f3; border-left: 4px solid #e74c3c; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px; color: #333;">
        Có đơn hàng mới <strong>#{{display_id}}</strong> cần xử lý!
      </p>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Thông tin đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Mã đơn hàng:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">#{{display_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Khách hàng:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{customer_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; text-align: right;">{{customer_email}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Tổng tiền:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #e74c3c;">{{total}}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 20px 0;">
      {{items}}
    </div>

    <div style="background: #f0f8ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        📍 Địa chỉ giao hàng: {{shipping_address}}
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Thông báo tự động từ hệ thống quản lý đơn hàng.</p>
  </div>
</div>
`.trim(),
        recipients: "",
    },
]

const createEmailSettingSchema = z.object({
    type: z.enum(["customer_order_confirmation", "internal_order_notification"]),
    is_enabled: z.boolean().optional().default(false),
    subject: z.string().optional().default(""),
    body_html: z.string().optional().default(""),
    recipients: z.string().optional().nullable(),
})

type CreateEmailSettingInput = z.infer<typeof createEmailSettingSchema>

// GET /admin/email-settings — list all settings
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)
        const settings = await emailSettingsService.listEmailSettings()

        res.status(200).json({
            email_settings: settings,
            count: settings.length,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch email settings",
        })
    }
}

// POST /admin/email-settings — create or seed defaults
export const POST = async (
    req: MedusaRequest<CreateEmailSettingInput | { seed?: boolean }>,
    res: MedusaResponse
) => {
    try {
        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)

        // If seed=true, create default templates
        if ((req.body as any)?.seed) {
            const existing = await emailSettingsService.listEmailSettings()
            const existingTypes = existing.map((s: any) => s.type)

            const toCreate = DEFAULT_TEMPLATES.filter(
                (t) => !existingTypes.includes(t.type)
            )

            const created = []
            for (const template of toCreate) {
                const setting = await emailSettingsService.createEmailSettings(template)
                created.push(setting)
            }

            return res.status(201).json({
                email_settings: [...existing, ...created],
                seeded: created.length,
            })
        }

        // Normal create
        const validatedData = createEmailSettingSchema.parse(req.body)
        const setting = await emailSettingsService.createEmailSettings(validatedData)

        res.status(201).json({ email_setting: setting })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
        }
        res.status(400).json({
            message: error.message || "Failed to create email setting",
        })
    }
}
