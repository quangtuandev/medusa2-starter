import { model } from "@medusajs/framework/utils"

export const BankAccount = model.define("bank_account", {
    id: model.id().primaryKey(),
    name: model.text(),
    account_holder: model.text(),
    account_number: model.text(),
    bank_code: model.text(),
    swift_code: model.text().nullable(),
    qr_code_url: model.text().nullable(),
    is_active: model.boolean().default(true),
    display_order: model.number().default(0),
})

