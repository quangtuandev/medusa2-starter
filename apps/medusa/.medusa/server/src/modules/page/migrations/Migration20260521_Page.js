"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260521_Page = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260521_Page extends migrations_1.Migration {
    async up() {
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
    async down() {
        this.addSql('DROP INDEX IF EXISTS "page_slug_language_unique"');
        this.addSql('DROP TABLE IF EXISTS "page"');
    }
}
exports.Migration20260521_Page = Migration20260521_Page;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjFfUGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3BhZ2UvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDUyMV9QYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHNCQUF1QixTQUFRLHNCQUFTO0lBQ2pELEtBQUssQ0FBQyxFQUFFO1FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O1NBZVgsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7U0FFWCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDSjtBQTVCRCx3REE0QkMifQ==