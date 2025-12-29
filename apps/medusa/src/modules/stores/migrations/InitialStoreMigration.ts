import { Migration } from '@mikro-orm/migrations';

export class InitialStoreMigration extends Migration {
    async up(): Promise<void> {
        this.addSql(`
      CREATE TABLE "store" (
        "id" VARCHAR(255) NOT NULL,
        "country" VARCHAR(255) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "address_lines" TEXT NOT NULL,
        "phone" VARCHAR(255) NULL,
        "email" VARCHAR(255) NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "display_order" INTEGER DEFAULT 0 NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "store_pkey" PRIMARY KEY ("id")
      );
    `);

        this.addSql(`
      CREATE INDEX "store_is_active_index" ON "store" ("is_active");
    `);

        this.addSql(`
      CREATE INDEX "store_display_order_index" ON "store" ("display_order");
    `);

        this.addSql(`
      CREATE INDEX "store_country_index" ON "store" ("country");
    `);
    }

    async down(): Promise<void> {
        this.addSql('DROP INDEX "store_is_active_index"');
        this.addSql('DROP INDEX "store_display_order_index"');
        this.addSql('DROP INDEX "store_country_index"');
        this.addSql('DROP TABLE "store"');
    }
}
