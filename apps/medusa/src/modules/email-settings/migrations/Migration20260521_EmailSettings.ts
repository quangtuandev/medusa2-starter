import { Migration } from '@mikro-orm/migrations';

export class Migration20260521_EmailSettings extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "email_setting" (
        "id" VARCHAR(255) NOT NULL,
        "type" VARCHAR(255) NOT NULL,
        "is_enabled" BOOLEAN DEFAULT false NOT NULL,
        "subject" TEXT DEFAULT '' NOT NULL,
        "body_html" TEXT DEFAULT '' NOT NULL,
        "recipients" TEXT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "email_setting_pkey" PRIMARY KEY ("id")
      );
    `);

    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "email_setting_type_unique" ON "email_setting" ("type");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "email_setting_type_unique"');
    this.addSql('DROP TABLE IF EXISTS "email_setting"');
  }
}
