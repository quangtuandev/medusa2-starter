import { Migration } from '@mikro-orm/migrations';

export class Migration20260823000001_CreatePopup extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "popup" (
        "id" VARCHAR(255) NOT NULL,
        "title_en" VARCHAR(255) NOT NULL,
        "title_vi" VARCHAR(255) NOT NULL,
        "description_en" TEXT NULL,
        "description_vi" TEXT NULL,
        "image" TEXT NULL,
        "cta_text_en" VARCHAR(255) NULL,
        "cta_text_vi" VARCHAR(255) NULL,
        "cta_link" VARCHAR(255) NULL,
        "secondary_cta_text_en" VARCHAR(255) NULL,
        "secondary_cta_text_vi" VARCHAR(255) NULL,
        "secondary_cta_link" VARCHAR(255) NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "delay_seconds" INT DEFAULT 3 NOT NULL,
        "display_frequency" VARCHAR(255) DEFAULT 'once_per_session' NOT NULL,
        "target_page" VARCHAR(255) DEFAULT 'all' NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "popup_pkey" PRIMARY KEY ("id")
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "popup"');
  }
}
