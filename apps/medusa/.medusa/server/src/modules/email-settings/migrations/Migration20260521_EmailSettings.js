"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260521_EmailSettings = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260521_EmailSettings extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE IF NOT EXISTS "email_setting" (
        "id" VARCHAR(255) NOT NULL,
        "type" VARCHAR(255) NOT NULL,
        "is_enabled" BOOLEAN DEFAULT false NOT NULL,
        "subject" TEXT DEFAULT '' NOT NULL,
        "body_html" TEXT DEFAULT '' NOT NULL,
        "recipients" TEXT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "email_setting_pkey" PRIMARY KEY ("id")
      );
    `);
        this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "email_setting_type_unique" ON "email_setting" ("type");
    `);
    }
    async down() {
        this.addSql('DROP INDEX IF EXISTS "email_setting_type_unique"');
        this.addSql('DROP TABLE IF EXISTS "email_setting"');
    }
}
exports.Migration20260521_EmailSettings = Migration20260521_EmailSettings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjFfRW1haWxTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2VtYWlsLXNldHRpbmdzL21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNjA1MjFfRW1haWxTZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSwrQkFBZ0MsU0FBUSxzQkFBUztJQUM1RCxLQUFLLENBQUMsRUFBRTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7S0FhWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDOztLQUVYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBMUJELDBFQTBCQyJ9