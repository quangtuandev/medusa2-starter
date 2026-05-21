"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const email_settings_1 = require("../../../modules/email-settings");
const zod_1 = require("zod");
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
];
const createEmailSettingSchema = zod_1.z.object({
    type: zod_1.z.enum(["customer_order_confirmation", "internal_order_notification"]),
    is_enabled: zod_1.z.boolean().optional().default(false),
    subject: zod_1.z.string().optional().default(""),
    body_html: zod_1.z.string().optional().default(""),
    recipients: zod_1.z.string().optional().nullable(),
});
// GET /admin/email-settings — list all settings
const GET = async (req, res) => {
    try {
        const emailSettingsService = req.scope.resolve(email_settings_1.EMAIL_SETTINGS_MODULE);
        const settings = await emailSettingsService.listEmailSettings();
        res.status(200).json({
            email_settings: settings,
            count: settings.length,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch email settings",
        });
    }
};
exports.GET = GET;
// POST /admin/email-settings — create or seed defaults
const POST = async (req, res) => {
    try {
        const emailSettingsService = req.scope.resolve(email_settings_1.EMAIL_SETTINGS_MODULE);
        // If seed=true, create default templates
        if (req.body?.seed) {
            const existing = await emailSettingsService.listEmailSettings();
            const existingTypes = existing.map((s) => s.type);
            const toCreate = DEFAULT_TEMPLATES.filter((t) => !existingTypes.includes(t.type));
            const created = [];
            for (const template of toCreate) {
                const setting = await emailSettingsService.createEmailSettings(template);
                created.push(setting);
            }
            return res.status(201).json({
                email_settings: [...existing, ...created],
                seeded: created.length,
            });
        }
        // Normal create
        const validatedData = createEmailSettingSchema.parse(req.body);
        const setting = await emailSettingsService.createEmailSettings(validatedData);
        res.status(201).json({ email_setting: setting });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(400).json({
            message: error.message || "Failed to create email setting",
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2VtYWlsLXNldHRpbmdzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLG9FQUF1RTtBQUN2RSw2QkFBdUI7QUFFdkIsMEJBQTBCO0FBQzFCLE1BQU0saUJBQWlCLEdBQUc7SUFDdEI7UUFDSSxJQUFJLEVBQUUsNkJBQTZCO1FBQ25DLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSw2REFBNkQ7UUFDdEUsU0FBUyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E2Q2xCLENBQUMsSUFBSSxFQUFFO1FBQ0EsVUFBVSxFQUFFLElBQUk7S0FDbkI7SUFDRDtRQUNJLElBQUksRUFBRSw2QkFBNkI7UUFDbkMsVUFBVSxFQUFFLEtBQUs7UUFDakIsT0FBTyxFQUFFLGdFQUFnRTtRQUN6RSxTQUFTLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBa0RsQixDQUFDLElBQUksRUFBRTtRQUNBLFVBQVUsRUFBRSxFQUFFO0tBQ2pCO0NBQ0osQ0FBQTtBQUVELE1BQU0sd0JBQXdCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLDZCQUE2QixFQUFFLDZCQUE2QixDQUFDLENBQUM7SUFDNUUsVUFBVSxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2pELE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUMxQyxTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9B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