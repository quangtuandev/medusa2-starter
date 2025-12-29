"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialStoreMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialStoreMigration extends migrations_1.Migration {
    async up() {
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
    async down() {
        this.addSql('DROP INDEX "store_is_active_index"');
        this.addSql('DROP INDEX "store_display_order_index"');
        this.addSql('DROP INDEX "store_country_index"');
        this.addSql('DROP TABLE "store"');
    }
}
exports.InitialStoreMigration = InitialStoreMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdGlhbFN0b3JlTWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3RvcmVzL21pZ3JhdGlvbnMvSW5pdGlhbFN0b3JlTWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHFCQUFzQixTQUFRLHNCQUFTO0lBQ2hELEtBQUssQ0FBQyxFQUFFO1FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0tBZWYsQ0FBQyxDQUFDO1FBRUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7S0FFZixDQUFDLENBQUM7UUFFQyxJQUFJLENBQUMsTUFBTSxDQUFDOztLQUVmLENBQUMsQ0FBQztRQUVDLElBQUksQ0FBQyxNQUFNLENBQUM7O0tBRWYsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDSjtBQXRDRCxzREFzQ0MifQ==