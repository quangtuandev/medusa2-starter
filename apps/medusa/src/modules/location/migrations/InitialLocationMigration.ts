import { Migration } from '@mikro-orm/migrations';

export class InitialLocationMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "location" (
        "id" VARCHAR(255) NOT NULL,
        "iso_country_code" TEXT NOT NULL,
        "address_lines" TEXT NOT NULL,
        "options" JSONB NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "location_pkey" PRIMARY KEY ("id")
      );
    `);

    this.addSql(`
      CREATE INDEX "location_iso_country_code_index" ON "location" ("iso_country_code");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX "location_iso_country_code_index"');
    this.addSql('DROP TABLE "location"');
  }
}

