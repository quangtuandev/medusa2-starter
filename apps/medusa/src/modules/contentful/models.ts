import { model } from '@medusajs/framework/utils';

/**
 * ProductContentfulLink - Maps Medusa Products to Contentful Entries
 * This is a read-only link to enable querying localized content
 */
export const ProductContentfulLink = model.define('product_contentful_link', {
  id: model.id().primaryKey(),
  product_id: model.text(),
  contentful_entry_id: model.text(),
  contentful_locale: model.text().default('en-US'),
  synced_at: model.dateTime().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
});
