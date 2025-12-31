"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialLocationMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialLocationMigration extends migrations_1.Migration {
    async up() {
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
    async down() {
        this.addSql('DROP INDEX "location_iso_country_code_index"');
        this.addSql('DROP TABLE "location"');
    }
}
exports.InitialLocationMigration = InitialLocationMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdGlhbExvY2F0aW9uTWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbG9jYXRpb24vbWlncmF0aW9ucy9Jbml0aWFsTG9jYXRpb25NaWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsd0JBQXlCLFNBQVEsc0JBQVM7SUFDckQsS0FBSyxDQUFDLEVBQUU7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7OztLQVdYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUM7O0tBRVgsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUF4QkQsNERBd0JDIn0=