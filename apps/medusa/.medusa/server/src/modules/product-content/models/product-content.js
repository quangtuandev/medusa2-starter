"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductContent = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.ProductContent = utils_1.model.define("product_content", {
    id: utils_1.model.id().primaryKey(),
    product_id: utils_1.model.text().unique(),
    notes: utils_1.model.text().default("").translatable(),
    ingredients: utils_1.model.text().default("").translatable(),
    precautions_of_use: utils_1.model.text().default("").translatable(),
    application_tips: utils_1.model.text().default("").translatable(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1jb250ZW50L21vZGVscy9wcm9kdWN0LWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlEO0FBRXBDLFFBQUEsY0FBYyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7SUFDNUQsRUFBRSxFQUFFLGFBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUU7SUFDM0IsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakMsS0FBSyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFO0lBQzlDLFdBQVcsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksRUFBRTtJQUNwRCxrQkFBa0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksRUFBRTtJQUMzRCxnQkFBZ0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksRUFBRTtDQUMxRCxDQUFDLENBQUEifQ==