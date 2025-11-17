"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20241113000000_CreateProductContentfulLink = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20241113000000_CreateProductContentfulLink extends migrations_1.Migration {
    async up() {
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
    async down() {
        this.addSql(`DROP TABLE IF EXISTS "product_contentful_link" CASCADE;`);
    }
}
exports.Migration20241113000000_CreateProductContentfulLink = Migration20241113000000_CreateProductContentfulLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNDExMTMwMDAwMDBfQ3JlYXRlUHJvZHVjdENvbnRlbnRmdWxMaW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29udGVudGZ1bC9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjQxMTEzMDAwMDAwX0NyZWF0ZVByb2R1Y3RDb250ZW50ZnVsTGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSxtREFBb0QsU0FBUSxzQkFBUztJQUNoRixLQUFLLENBQUMsRUFBRTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7OztLQVlYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUM7OztLQUdYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUM7OztLQUdYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMseURBQXlELENBQUMsQ0FBQztJQUN6RSxDQUFDO0NBQ0Y7QUE5QkQsa0hBOEJDIn0=