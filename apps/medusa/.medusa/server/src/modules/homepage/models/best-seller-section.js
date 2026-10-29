"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestSellerSection = void 0;
const utils_1 = require("@medusajs/framework/utils");
/**
 * "Best Seller" block of the homepage: a heading, a description and an ordered
 * list of cards. Cards are stored as JSON so an admin can mix catalogue
 * products with hand-picked artwork without extra tables:
 * `{ product_id?, image_url, link?, alt_en?, alt_vi?, rank }`.
 */
exports.BestSellerSection = utils_1.model.define('best_seller_section', {
    id: utils_1.model.id().primaryKey(),
    is_active: utils_1.model.boolean().default(true),
    heading_en: utils_1.model.text().default('BEST SELLER'),
    heading_vi: utils_1.model.text().default('BÁN CHẠY NHẤT'),
    description_en: utils_1.model.text().nullable(),
    description_vi: utils_1.model.text().nullable(),
    items: utils_1.model.json().nullable(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdC1zZWxsZXItc2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2hvbWVwYWdlL21vZGVscy9iZXN0LXNlbGxlci1zZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFrRDtBQUVsRDs7Ozs7R0FLRztBQUNVLFFBQUEsaUJBQWlCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtJQUNuRSxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixTQUFTLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFFeEMsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQy9DLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztJQUNqRCxjQUFjLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUN2QyxjQUFjLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUV2QyxLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUMvQixDQUFDLENBQUMifQ==