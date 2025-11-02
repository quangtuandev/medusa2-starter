import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  name: model.text(),
  content: model.text(),
  stars: model.number(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
})
