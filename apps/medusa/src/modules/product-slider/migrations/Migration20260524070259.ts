import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260524070259 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "slider_card" ("id" text not null, "title_en" text not null, "title_vi" text not null, "subtitle_en" text null, "subtitle_vi" text null, "image" text not null, "image_active" text null, "icon" text null, "linkto" text not null, "rank" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "slider_card_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_slider_card_deleted_at" ON "slider_card" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "slider_card" cascade;`);
  }

}
