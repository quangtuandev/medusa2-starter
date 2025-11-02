"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewStatsModel = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.ProductReviewStatsModel = utils_1.model.define('product_review_stats', {
    id: utils_1.model.id({ prefix: 'prst' }).primaryKey(),
    product_id: utils_1.model.text(),
    average_rating: utils_1.model.number().nullable(),
    review_count: utils_1.model.number().default(0),
    rating_count_1: utils_1.model.number().default(0),
    rating_count_2: utils_1.model.number().default(0),
    rating_count_3: utils_1.model.number().default(0),
    rating_count_4: utils_1.model.number().default(0),
    rating_count_5: utils_1.model.number().default(0),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctc3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9tb2RlbHMvcHJvZHVjdC1yZXZpZXctc3RhdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBRXJDLFFBQUEsdUJBQXVCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtJQUMxRSxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRTtJQUM3QyxVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixjQUFjLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUN6QyxZQUFZLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkMsY0FBYyxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLGNBQWMsRUFBRSxhQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6QyxjQUFjLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekMsY0FBYyxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLGNBQWMsRUFBRSxhQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUMxQyxDQUFDLENBQUMifQ==