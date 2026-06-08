import { model } from "@medusajs/framework/utils"

export const SliderCard = model.define("slider_card", {
  id: model.id().primaryKey(),
  title_en: model.text(),
  title_vi: model.text(),
  subtitle_en: model.text().nullable(),
  subtitle_vi: model.text().nullable(),
  image: model.text(),
  image_active: model.text().nullable(),
  icon: model.text().nullable(),
  linkto: model.text(),
  rank: model.number().default(0),
})
