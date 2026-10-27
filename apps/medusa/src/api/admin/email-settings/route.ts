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
    {
        type: "contact_us_notification",
        is_enabled: true,
        subject: "[Liên hệ mới] Từ {{name}} - {{email}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563eb;">
    <h1 style="color: #2563eb; margin: 0; font-size: 24px;">📬 Tin nhắn liên hệ mới!</h1>
  </div>

  <div style="padding: 30px 0;">
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px; color: #1e3a8a;">
        Bạn nhận được một tin nhắn liên hệ mới từ website.
      </p>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Thông tin người gửi:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 120px;">Họ và tên:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">{{name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:{{email}}" style="color: #2563eb; text-decoration: none;">{{email}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Thời gian gửi:</td>
          <td style="padding: 8px 0; color: #666;">{{date}}</td>
        </tr>
      </table>
    </div>

    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #333;">Nội dung tin nhắn:</h3>
      <div style="font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 6px;">
{{message}}
      </div>
    </div>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Thông báo tự động từ hệ thống website {{store_name}}.</p>
  </div>
</div>
`.trim(),
        recipients: "hello.kira@aryak.vn",
    },
    {
        type: "contact_us_confirmation",
        is_enabled: true,
        subject: "Cảm ơn bạn đã liên hệ với {{store_name}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
    <h1 style="color: #333; margin: 0; font-size: 24px;">Cảm ơn bạn đã liên hệ!</h1>
  </div>

  <div style="padding: 30px 0;">
    <p style="font-size: 16px; color: #333;">Xin chào <strong>{{name}}</strong>,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Chúng tôi đã nhận được thông tin liên hệ của bạn gửi tới <strong>{{store_name}}</strong>. Đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
    </p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 15px;">Nội dung tin nhắn bạn đã gửi:</h3>
      <div style="font-size: 14px; color: #555; line-height: 1.6; font-style: italic; background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
{{message}}
      </div>
    </div>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Nếu bạn có bất kỳ câu hỏi khẩn cấp nào, vui lòng liên hệ lại với chúng tôi qua email này.
    </p>

    <p style="font-size: 15px; color: #555;">
      Trân trọng,<br/>
      <strong>Đội ngũ {{store_name}}</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Email này được gửi tự động để xác nhận đã tiếp nhận thông tin liên hệ của bạn.</p>
  </div>
</div>
`.trim(),
        recipients: null,
    },
]

const createEmailSettingSchema = z.object({
    type: z.enum([
        "customer_order_confirmation",
        "internal_order_notification",
        "contact_us_notification",
        "contact_us_confirmation",
    ]),
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
