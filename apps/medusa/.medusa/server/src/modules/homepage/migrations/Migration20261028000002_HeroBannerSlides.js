"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20261028000002_HeroBannerSlides = void 0;
const migrations_1 = require("@mikro-orm/migrations");
/**
 * The hero became a slider: every active `hero_banner` row is a slide, ordered
 * by `rank`. Adds the ordering column and seeds two extra slides so a freshly
 * migrated database already shows a working carousel.
 */
class Migration20261028000002_HeroBannerSlides extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "hero_banner"
        ADD COLUMN IF NOT EXISTS "rank" INT DEFAULT 0 NOT NULL;
    `);
        // Keep the original single slide first.
        this.addSql(`
      UPDATE "hero_banner" SET "rank" = 0 WHERE "id" = 'herobanner_seed_rice_milk';
    `);
        this.addSql(`
      INSERT INTO "hero_banner" (
        "id", "is_active", "rank", "image_desktop_url", "image_mobile_url",
        "title_en", "title_vi", "subtitle_en", "subtitle_vi",
        "cta_label_en", "cta_label_vi", "cta_href", "cta_variant",
        "text_color", "text_align"
      ) VALUES (
        'herobanner_seed_coffeeling', true, 1,
        '/assets/images/menu/product.webp', '/assets/images/menu/product.webp',
        'COFFEELING', 'COFFEELING', 'eau de parfums | 50ML', 'eau de parfums | 50ML',
        'SHOP NOW', 'MUA NGAY', '/products', 'primary',
        '#FFFFFF', 'left'
      ) ON CONFLICT ("id") DO NOTHING;
    `);
        this.addSql(`
      INSERT INTO "hero_banner" (
        "id", "is_active", "rank", "image_desktop_url", "image_mobile_url",
        "title_en", "title_vi", "subtitle_en", "subtitle_vi",
        "cta_label_en", "cta_label_vi", "cta_href", "cta_variant",
        "text_color", "text_align"
      ) VALUES (
        'herobanner_seed_matcha', true, 2,
        '/assets/images/menu/contact.webp', '/assets/images/menu/contact.webp',
        'MATCHA LATTE', 'MATCHA LATTE', 'eau de parfums | 50ML', 'eau de parfums | 50ML',
        'SHOP NOW', 'MUA NGAY', '/products', 'primary',
        '#FFFFFF', 'left'
      ) ON CONFLICT ("id") DO NOTHING;
    `);
    }
    async down() {
        this.addSql(`DELETE FROM "hero_banner" WHERE "id" IN ('herobanner_seed_coffeeling', 'herobanner_seed_matcha');`);
        this.addSql(`ALTER TABLE "hero_banner" DROP COLUMN IF EXISTS "rank";`);
    }
}
exports.Migration20261028000002_HeroBannerSlides = Migration20261028000002_HeroBannerSlides;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjEwMjgwMDAwMDJfSGVyb0Jhbm5lclNsaWRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2hvbWVwYWdlL21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNjEwMjgwMDAwMDJfSGVyb0Jhbm5lclNsaWRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQ7Ozs7R0FJRztBQUNILE1BQWEsd0NBQXlDLFNBQVEsc0JBQVM7SUFDckUsS0FBSyxDQUFDLEVBQUU7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDOzs7S0FHWCxDQUFDLENBQUM7UUFFSCx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7S0FFWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7O0tBYVgsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7OztLQWFYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsbUdBQW1HLENBQUMsQ0FBQztRQUNqSCxJQUFJLENBQUMsTUFBTSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNGO0FBL0NELDRGQStDQyJ9