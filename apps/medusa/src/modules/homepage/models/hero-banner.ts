import { model } from '@medusajs/framework/utils';

/**
 * One slide of the storefront hero slider. Every active record becomes a slide,
 * ordered by `rank` (the admin can add, remove and reorder them).
 */
export const HeroBanner = model.define('hero_banner', {
  id: model.id().primaryKey(),
  is_active: model.boolean().default(true),
  /** Slide order in the hero carousel (ascending). */
  rank: model.number().default(0),

  image_desktop_url: model.text(),
  image_mobile_url: model.text().nullable(),

  title_en: model.text(),
  title_vi: model.text(),
  subtitle_en: model.text().nullable(),
  subtitle_vi: model.text().nullable(),

  cta_label_en: model.text().default('SHOP NOW'),
  cta_label_vi: model.text().default('MUA NGAY'),
  cta_href: model.text().default('/products'),
  /** primary | outline | glass */
  cta_variant: model.text().default('primary'),

  text_color: model.text().default('#FFFFFF'),
  /** left | center */
  text_align: model.text().default('left'),
});
