import { model } from "@medusajs/framework/utils"

export const Popup = model.define("popup", {
  id: model.id().primaryKey(),
  title_en: model.text(),
  title_vi: model.text(),
  description_en: model.text().nullable(),
  description_vi: model.text().nullable(),
  image: model.text().nullable(),
  cta_text_en: model.text().nullable(),
  cta_text_vi: model.text().nullable(),
  cta_link: model.text().nullable(),
  secondary_cta_text_en: model.text().nullable(),
  secondary_cta_text_vi: model.text().nullable(),
  secondary_cta_link: model.text().nullable(),
  is_active: model.boolean().default(true),
  delay_seconds: model.number().default(3),
  display_frequency: model.text().default("once_per_session"),
  target_page: model.text().default("all"),
})
