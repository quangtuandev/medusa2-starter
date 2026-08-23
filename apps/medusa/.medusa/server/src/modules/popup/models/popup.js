"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popup = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.Popup = utils_1.model.define("popup", {
    id: utils_1.model.id().primaryKey(),
    title_en: utils_1.model.text(),
    title_vi: utils_1.model.text(),
    description_en: utils_1.model.text().nullable(),
    description_vi: utils_1.model.text().nullable(),
    image: utils_1.model.text().nullable(),
    cta_text_en: utils_1.model.text().nullable(),
    cta_text_vi: utils_1.model.text().nullable(),
    cta_link: utils_1.model.text().nullable(),
    secondary_cta_text_en: utils_1.model.text().nullable(),
    secondary_cta_text_vi: utils_1.model.text().nullable(),
    secondary_cta_link: utils_1.model.text().nullable(),
    is_active: utils_1.model.boolean().default(true),
    delay_seconds: utils_1.model.number().default(3),
    display_frequency: utils_1.model.text().default("once_per_session"),
    target_page: utils_1.model.text().default("all"),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wb3B1cC9tb2RlbHMvcG9wdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlEO0FBRXBDLFFBQUEsS0FBSyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQ3pDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3RCLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3RCLGNBQWMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3ZDLGNBQWMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3ZDLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzlCLFdBQVcsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3BDLFdBQVcsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3BDLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ2pDLHFCQUFxQixFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDOUMscUJBQXFCLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM5QyxrQkFBa0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzNDLFNBQVMsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUN4QyxhQUFhLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEMsaUJBQWlCLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztJQUMzRCxXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDekMsQ0FBQyxDQUFBIn0=