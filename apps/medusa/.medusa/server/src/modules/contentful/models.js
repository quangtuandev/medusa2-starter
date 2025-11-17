"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductContentfulLink = void 0;
const utils_1 = require("@medusajs/framework/utils");
/**
 * ProductContentfulLink - Maps Medusa Products to Contentful Entries
 * This is a read-only link to enable querying localized content
 */
exports.ProductContentfulLink = utils_1.model.define('product_contentful_link', {
    id: utils_1.model.id().primaryKey(),
    product_id: utils_1.model.text(),
    contentful_entry_id: utils_1.model.text(),
    contentful_locale: utils_1.model.text().default('en-US'),
    synced_at: utils_1.model.dateTime().nullable(),
    created_at: utils_1.model.dateTime(),
    updated_at: utils_1.model.dateTime(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29udGVudGZ1bC9tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBRWxEOzs7R0FHRztBQUNVLFFBQUEscUJBQXFCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTtJQUMzRSxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixtQkFBbUIsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2pDLGlCQUFpQixFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2hELFNBQVMsRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3RDLFVBQVUsRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFO0lBQzVCLFVBQVUsRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFO0NBQzdCLENBQUMsQ0FBQyJ9