import { Migration } from '@mikro-orm/migrations';

export class InitialReviewsMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "review" (
        "id" VARCHAR(255) NOT NULL,
        "product_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "content" TEXT NOT NULL,
        "stars" INTEGER NOT NULL,
        "status" VARCHAR(255) DEFAULT 'pending' NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "review_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "review_stars_check" CHECK ("stars" >= 1 AND "stars" <= 5)
      );
    `);

    this.addSql(`
      CREATE INDEX "review_product_id_index" ON "review" ("product_id");
    `);

    this.addSql(`
      CREATE INDEX "review_status_index" ON "review" ("status");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX "review_product_id_index"');
    this.addSql('DROP INDEX "review_status_index"');
    this.addSql('DROP TABLE "review"');
  }
}
