"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroBanner = void 0;
const utils_1 = require("@medusajs/framework/utils");
/**
 * One slide of the storefront hero slider. Every active record becomes a slide,
 * ordered by `rank` (the admin can add, remove and reorder them).
 */
exports.HeroBanner = utils_1.model.define('hero_banner', {
    id: utils_1.model.id().primaryKey(),
    is_active: utils_1.model.boolean().default(true),
    /** Slide order in the hero carousel (ascending). */
    rank: utils_1.model.number().default(0),
    image_desktop_url: utils_1.model.text(),
    image_mobile_url: utils_1.model.text().nullable(),
    title_en: utils_1.model.text(),
    title_vi: utils_1.model.text(),
    subtitle_en: utils_1.model.text().nullable(),
    subtitle_vi: utils_1.model.text().nullable(),
    cta_label_en: utils_1.model.text().default('SHOP NOW'),
    cta_label_vi: utils_1.model.text().default('MUA NGAY'),
    cta_href: utils_1.model.text().default('/products'),
    /** primary | outline | glass */
    cta_variant: utils_1.model.text().default('primary'),
    text_color: utils_1.model.text().default('#FFFFFF'),
    /** left | center */
    text_align: utils_1.model.text().default('left'),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyby1iYW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ob21lcGFnZS9tb2RlbHMvaGVyby1iYW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBRWxEOzs7R0FHRztBQUNVLFFBQUEsVUFBVSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO0lBQ3BELEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLFNBQVMsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN4QyxvREFBb0Q7SUFDcEQsSUFBSSxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRS9CLGlCQUFpQixFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDL0IsZ0JBQWdCLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUV6QyxRQUFRLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN0QixRQUFRLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN0QixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUVwQyxZQUFZLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDOUMsWUFBWSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQzlDLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUMzQyxnQ0FBZ0M7SUFDaEMsV0FBVyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBRTVDLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUMzQyxvQkFBb0I7SUFDcEIsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0NBQ3pDLENBQUMsQ0FBQyJ9