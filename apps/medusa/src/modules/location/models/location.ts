import { model } from "@medusajs/framework/utils"

export const Location = model.define("location", {
    id: model.id().primaryKey(),
    name: model.text(),
    iso_country_code: model.text(),
    address_lines: model.text(),
    options: model.json().default({}),
})

