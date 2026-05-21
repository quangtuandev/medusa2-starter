import { model } from "@medusajs/framework/utils"

export const EmailSetting = model.define("email_setting", {
    id: model.id().primaryKey(),
    type: model.text(), // "customer_order_confirmation" | "internal_order_notification"
    is_enabled: model.boolean().default(false),
    subject: model.text().default(""),
    body_html: model.text().default(""),
    recipients: model.text().nullable(), // comma-separated emails for internal notifications
})
