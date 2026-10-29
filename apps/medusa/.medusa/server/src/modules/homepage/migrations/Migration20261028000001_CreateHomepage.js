"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20261028000001_CreateHomepage = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20261028000001_CreateHomepage extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE IF NOT EXISTS "hero_banner" (
        "id" VARCHAR(255) NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "image_desktop_url" TEXT NOT NULL,
        "image_mobile_url" TEXT NULL,
        "title_en" TEXT NOT NULL,
        "title_vi" TEXT NOT NULL,
        "subtitle_en" TEXT NULL,
        "subtitle_vi" TEXT NULL,
        "cta_label_en" TEXT DEFAULT 'SHOP NOW' NOT NULL,
        "cta_label_vi" TEXT DEFAULT 'MUA NGAY' NOT NULL,
        "cta_href" TEXT DEFAULT '/products' NOT NULL,
        "cta_variant" TEXT DEFAULT 'primary' NOT NULL,
        "text_color" TEXT DEFAULT '#FFFFFF' NOT NULL,
        "text_align" TEXT DEFAULT 'left' NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "hero_banner_pkey" PRIMARY KEY ("id")
      );
    `);
        this.addSql(`
      CREATE TABLE IF NOT EXISTS "best_seller_section" (
        "id" VARCHAR(255) NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "heading_en" TEXT DEFAULT 'BEST SELLER' NOT NULL,
        "heading_vi" TEXT DEFAULT 'BÁN CHẠY NHẤT' NOT NULL,
        "description_en" TEXT NULL,
        "description_vi" TEXT NULL,
        "items" JSONB DEFAULT '[]'::jsonb NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "best_seller_section_pkey" PRIMARY KEY ("id")
      );
    `);
        // Seed the design defaults so a freshly migrated database already renders the
        // homepage (Rice Milk hero + three best seller cards).
        this.addSql(`
      INSERT INTO "hero_banner" (
        "id", "is_active", "image_desktop_url", "image_mobile_url",
        "title_en", "title_vi", "subtitle_en", "subtitle_vi",
        "cta_label_en", "cta_label_vi", "cta_href", "cta_variant",
        "text_color", "text_align"
      ) VALUES (
        'herobanner_seed_rice_milk', true,
        '/assets/images/home/hero-rice-milk.webp', '/assets/images/home/hero-rice-milk.webp',
        'RiCE MILK', 'RiCE MILK', 'eau de parfums | 50ML', 'eau de parfums | 50ML',
        'SHOP NOW', 'MUA NGAY', '/products', 'primary',
        '#FFFFFF', 'left'
      ) ON CONFLICT ("id") DO NOTHING;
    `);
        this.addSql(`
      INSERT INTO "best_seller_section" (
        "id", "is_active", "heading_en", "heading_vi", "description_en", "description_vi", "items"
      ) VALUES (
        'bestseller_seed_default', true, 'BEST SELLER', 'BÁN CHẠY NHẤT',
        'Our most loved scents — hand-poured in small batches and loved the most by you.',
        'Những mùi hương được yêu thích nhất — chiết xuất thủ công theo từng mẻ nhỏ.',
        '[
          {"image_url":"/assets/images/menu/product.webp","link":"/products","alt_en":"RiCE MILK","alt_vi":"RiCE MILK","rank":0},
          {"image_url":"/assets/images/menu/story.webp","link":"/products","alt_en":"Coffeeling","alt_vi":"Coffeeling","rank":1},
          {"image_url":"/assets/images/menu/contact.webp","link":"/products","alt_en":"Matcha Latte","alt_vi":"Matcha Latte","rank":2}
        ]'::jsonb
      ) ON CONFLICT ("id") DO NOTHING;
    `);
    }
    async down() {
        this.addSql('DROP TABLE IF EXISTS "best_seller_section"');
        this.addSql('DROP TABLE IF EXISTS "hero_banner"');
    }
}
exports.Migration20261028000001_CreateHomepage = Migration20261028000001_CreateHomepage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjEwMjgwMDAwMDFfQ3JlYXRlSG9tZXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ob21lcGFnZS9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYxMDI4MDAwMDAxX0NyZWF0ZUhvbWVwYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHNDQUF1QyxTQUFRLHNCQUFTO0lBQ25FLEtBQUssQ0FBQyxFQUFFO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBcUJYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7O0tBY1gsQ0FBQyxDQUFDO1FBRUgsOEVBQThFO1FBQzlFLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7O0tBYVgsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7OztLQWFYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGO0FBOUVELHdGQThFQyJ9