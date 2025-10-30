import { Migration } from '@mikro-orm/migrations';

export class InitialMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "post" (
        "id" VARCHAR(255) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) NOT NULL,
        "content" TEXT NOT NULL,
        "thumbnail" VARCHAR(255) NULL,
        "description" TEXT NULL,
        "sub_title" TEXT NULL,
        "published" BOOLEAN DEFAULT false NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "post_pkey" PRIMARY KEY ("id")
      );
    `);

    this.addSql(`
      CREATE UNIQUE INDEX "post_slug_unique" ON "post" ("slug");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX "post_slug_unique"');
    this.addSql('DROP TABLE "post"');
  }
}