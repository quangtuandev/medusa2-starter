import { model } from '@medusajs/framework/utils';

/**
 * "Best Seller" block of the homepage: a heading, a description and an ordered
 * list of cards. Cards are stored as JSON so an admin can mix catalogue
 * products with hand-picked artwork without extra tables:
 * `{ product_id?, image_url, link?, alt_en?, alt_vi?, rank }`.
 */
export const BestSellerSection = model.define('best_seller_section', {
  id: model.id().primaryKey(),
  is_active: model.boolean().default(true),

  heading_en: model.text().default('BEST SELLER'),
  heading_vi: model.text().default('BÁN CHẠY NHẤT'),
  description_en: model.text().nullable(),
  description_vi: model.text().nullable(),

  items: model.json().nullable(),
});
