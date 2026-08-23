"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260823000001_CreatePopup = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260823000001_CreatePopup extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE IF NOT EXISTS "popup" (
        "id" VARCHAR(255) NOT NULL,
        "title_en" VARCHAR(255) NOT NULL,
        "title_vi" VARCHAR(255) NOT NULL,
        "description_en" TEXT NULL,
        "description_vi" TEXT NULL,
        "image" TEXT NULL,
        "cta_text_en" VARCHAR(255) NULL,
        "cta_text_vi" VARCHAR(255) NULL,
        "cta_link" VARCHAR(255) NULL,
        "secondary_cta_text_en" VARCHAR(255) NULL,
        "secondary_cta_text_vi" VARCHAR(255) NULL,
        "secondary_cta_link" VARCHAR(255) NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "delay_seconds" INT DEFAULT 3 NOT NULL,
        "display_frequency" VARCHAR(255) DEFAULT 'once_per_session' NOT NULL,
        "target_page" VARCHAR(255) DEFAULT 'all' NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "popup_pkey" PRIMARY KEY ("id")
      );
    `);
    }
    async down() {
        this.addSql('DROP TABLE IF EXISTS "popup"');
    }
}
exports.Migration20260823000001_CreatePopup = Migration20260823000001_CreatePopup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA4MjMwMDAwMDFfQ3JlYXRlUG9wdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wb3B1cC9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwODIzMDAwMDAxX0NyZWF0ZVBvcHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLG1DQUFvQyxTQUFRLHNCQUFTO0lBQ2hFLEtBQUssQ0FBQyxFQUFFO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F1QlgsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQS9CRCxrRkErQkMifQ==