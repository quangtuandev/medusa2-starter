"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260804000748 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260804000748 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "product_content" drop constraint if exists "product_content_product_id_unique";`);
        this.addSql(`create table if not exists "product_content" ("id" text not null, "product_id" text not null, "notes" text not null default '', "ingredients" text not null default '', "precautions_of_use" text not null default '', "application_tips" text not null default '', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_content_pkey" primary key ("id"));`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_content_product_id_unique" ON "product_content" ("product_id") WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_content_deleted_at" ON "product_content" ("deleted_at") WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "product_content" cascade;`);
    }
}
exports.Migration20260804000748 = Migration20260804000748;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA4MDQwMDA3NDguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWNvbnRlbnQvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDgwNDAwMDc0OC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5RUFBcUU7QUFFckUsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsd0dBQXdHLENBQUMsQ0FBQztRQUN0SCxJQUFJLENBQUMsTUFBTSxDQUFDLDZiQUE2YixDQUFDLENBQUM7UUFDM2MsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5SUFBeUksQ0FBQyxDQUFDO1FBQ3ZKLElBQUksQ0FBQyxNQUFNLENBQUMsMkhBQTJILENBQUMsQ0FBQztJQUMzSSxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Q0FFRjtBQWJELDBEQWFDIn0=