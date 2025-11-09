import { Migration } from '@mikro-orm/migrations';

export class InitialBankMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "bank_account" (
        "id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "account_holder" VARCHAR(255) NOT NULL,
        "account_number" VARCHAR(255) NOT NULL,
        "bank_code" VARCHAR(255) NOT NULL,
        "swift_code" VARCHAR(255) NULL,
        "qr_code_url" TEXT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "display_order" INTEGER DEFAULT 0 NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
      );
    `);

    this.addSql(`
      CREATE INDEX "bank_account_is_active_index" ON "bank_account" ("is_active");
    `);

    this.addSql(`
      CREATE INDEX "bank_account_display_order_index" ON "bank_account" ("display_order");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX "bank_account_is_active_index"');
    this.addSql('DROP INDEX "bank_account_display_order_index"');
    this.addSql('DROP TABLE "bank_account"');
  }
}

