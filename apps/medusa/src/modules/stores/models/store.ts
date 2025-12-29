import { model } from "@medusajs/framework/utils"

export const Store = model.define("store", {
    id: model.id().primaryKey(),
    country: model.text(),
    title: model.text(),
    address_lines: model.text(),
    phone: model.text().nullable(),
    email: model.text().nullable(),
    is_active: model.boolean().default(true),
    display_order: model.number().default(0),
})
