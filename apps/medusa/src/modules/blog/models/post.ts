import { model } from "@medusajs/framework/utils"

export const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
  slug: model.text(),
  thumbnail: model.text().nullable(),
  published: model.boolean().default(false),
})
