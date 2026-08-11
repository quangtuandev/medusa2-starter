import { model } from "@medusajs/framework/utils"

export const ProductContent = model.define("product_content", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  notes: model.text().default("").translatable(),
  ingredients: model.text().default("").translatable(),
  precautions_of_use: model.text().default("").translatable(),
  application_tips: model.text().default("").translatable(),
})
