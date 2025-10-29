"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialMigration extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE "post" (
        "id" VARCHAR(255) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) NOT NULL,
        "content" TEXT NOT NULL,
        "thumbnail" VARCHAR(255) NULL,
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
    async down() {
        this.addSql('DROP INDEX "post_slug_unique"');
        this.addSql('DROP TABLE "post"');
    }
}
exports.InitialMigration = InitialMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdGlhbE1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvbWlncmF0aW9ucy9Jbml0aWFsTWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdDLEtBQUssQ0FBQyxFQUFFO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7OztLQWFYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUM7O0tBRVgsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0Y7QUExQkQsNENBMEJDIn0=