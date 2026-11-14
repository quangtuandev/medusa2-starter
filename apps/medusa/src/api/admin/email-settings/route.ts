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
        subject: "Order #{{display_id}} confirmed - Thank you for your purchase!",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
    <h1 style="color: #333; margin: 0; font-size: 24px;">Order confirmation</h1>
  </div>

  <div style="padding: 30px 0;">
    <p style="font-size: 16px; color: #333;">Hello <strong>{{customer_name}}</strong>,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Thank you for your order! Your order <strong>#{{display_id}}</strong> has been received successfully.
    </p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Order details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Order number:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">#{{display_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Total:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{total}}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 20px 0;">
      {{items}}
    </div>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We will notify you when your order has shipped.
    </p>

    <p style="font-size: 15px; color: #555;">
      Best regards,<br/>
      <strong>{{store_name}}</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>This email was sent automatically, please do not reply.</p>
  </div>
</div>
`.trim(),
        recipients: null,
    },
    {
        type: "internal_order_notification",
        is_enabled: false,
        subject: "[New order] #{{display_id}} - {{customer_name}} - {{total}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e74c3c;">
    <h1 style="color: #e74c3c; margin: 0; font-size: 24px;">🔔 New order!</h1>
  </div>

  <div style="padding: 30px 0;">
    <div style="background: #fff3f3; border-left: 4px solid #e74c3c; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px; color: #333;">
        A new order <strong>#{{display_id}}</strong> needs to be processed!
      </p>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Order information:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Order number:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">#{{display_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Customer:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{customer_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; text-align: right;">{{customer_email}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Total:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #e74c3c;">{{total}}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 20px 0;">
      {{items}}
    </div>

    <div style="background: #f0f8ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        📍 Shipping address: {{shipping_address}}
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Automatic notification from the order management system.</p>
  </div>
</div>
`.trim(),
        recipients: "",
    },
    {
        type: "contact_us_notification",
        is_enabled: true,
        subject: "[New contact] From {{name}} - {{email}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563eb;">
    <h1 style="color: #2563eb; margin: 0; font-size: 24px;">📬 New contact message!</h1>
  </div>

  <div style="padding: 30px 0;">
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px; color: #1e3a8a;">
        You have received a new contact message from the website.
      </p>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Sender information:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 120px;">Full name:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">{{name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:{{email}}" style="color: #2563eb; text-decoration: none;">{{email}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Sent at:</td>
          <td style="padding: 8px 0; color: #666;">{{date}}</td>
        </tr>
      </table>
    </div>

    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #333;">Message:</h3>
      <div style="font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 6px;">
{{message}}
      </div>
    </div>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>Automatic notification from the {{store_name}} website.</p>
  </div>
</div>
`.trim(),
        recipients: "hello.kira@aryak.vn",
    },
    {
        type: "contact_us_confirmation",
        is_enabled: true,
        subject: "Thank you for contacting {{store_name}}",
        body_html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
    <h1 style="color: #333; margin: 0; font-size: 24px;">Thank you for contacting us!</h1>
  </div>

  <div style="padding: 30px 0;">
    <p style="font-size: 16px; color: #333;">Hello <strong>{{name}}</strong>,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We have received your message to <strong>{{store_name}}</strong>. Our team will get back to you as soon as possible.
    </p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 15px;">Your message:</h3>
      <div style="font-size: 14px; color: #555; line-height: 1.6; font-style: italic; background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
{{message}}
      </div>
    </div>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      If you have any urgent questions, please reply to us at this email address.
    </p>

    <p style="font-size: 15px; color: #555;">
      Best regards,<br/>
      <strong>The {{store_name}} team</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px;">
    <p>This email was sent automatically to confirm we received your message.</p>
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
