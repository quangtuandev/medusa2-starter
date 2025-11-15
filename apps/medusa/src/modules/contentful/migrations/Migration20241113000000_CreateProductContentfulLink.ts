import { Migration } from '@mikro-orm/migrations';

export class Migration20241113000000_CreateProductContentfulLink extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "product_contentful_link" (
        "id" text NOT NULL,
        "product_id" text NOT NULL,
        "contentful_entry_id" text NOT NULL,
        "contentful_locale" text NOT NULL DEFAULT 'en-US',
        "synced_at" TIMESTAMPTZ NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        UNIQUE ("product_id", "contentful_locale")
      );
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_contentful_link_product_id"
      ON "product_contentful_link" ("product_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_contentful_link_entry_id"
      ON "product_contentful_link" ("contentful_entry_id");
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "product_contentful_link" CASCADE;`);
  }
}
