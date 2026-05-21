import { model } from "@medusajs/framework/utils"

export const Page = model.define("page", {
    id: model.id().primaryKey(),
    title: model.text(),
    slug: model.text(),
    content: model.text(),
    language: model.text().default("en"),
    meta_title: model.text().nullable(),
    meta_description: model.text().nullable(),
    published: model.boolean().default(false),
})
