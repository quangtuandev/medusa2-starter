import { Migration } from '@mikro-orm/migrations';

export class Migration20260521_Page extends Migration {
    async up(): Promise<void> {
        this.addSql(`
            CREATE TABLE IF NOT EXISTS "page" (
                "id" VARCHAR(255) NOT NULL,
                "title" VARCHAR(255) NOT NULL,
                "slug" VARCHAR(255) NOT NULL,
                "content" TEXT NOT NULL,
                "language" VARCHAR(10) DEFAULT 'en' NOT NULL,
                "meta_title" VARCHAR(255) NULL,
                "meta_description" TEXT NULL,
                "published" BOOLEAN DEFAULT false NOT NULL,
                "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
                "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
                "deleted_at" TIMESTAMPTZ(6) NULL,
                CONSTRAINT "page_pkey" PRIMARY KEY ("id")
            );
        `);

        this.addSql(`
            CREATE UNIQUE INDEX IF NOT EXISTS "page_slug_language_unique" ON "page" ("slug", "language");
        `);
    }

    async down(): Promise<void> {
        this.addSql('DROP INDEX IF EXISTS "page_slug_language_unique"');
        this.addSql('DROP TABLE IF EXISTS "page"');
    }
}
