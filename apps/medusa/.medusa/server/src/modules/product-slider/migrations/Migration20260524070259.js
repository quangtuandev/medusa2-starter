"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260524070259 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260524070259 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "slider_card" ("id" text not null, "title_en" text not null, "title_vi" text not null, "subtitle_en" text null, "subtitle_vi" text null, "image" text not null, "image_active" text null, "icon" text null, "linkto" text not null, "rank" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "slider_card_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_slider_card_deleted_at" ON "slider_card" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "slider_card" cascade;`);
    }
}
exports.Migration20260524070259 = Migration20260524070259;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjQwNzAyNTkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXNsaWRlci9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwNTI0MDcwMjU5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlFQUFxRTtBQUVyRSxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1ZEFBdWQsQ0FBQyxDQUFDO1FBQ3JlLElBQUksQ0FBQyxNQUFNLENBQUMsaUhBQWlILENBQUMsQ0FBQztJQUNqSSxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FFRjtBQVhELDBEQVdDIn0=