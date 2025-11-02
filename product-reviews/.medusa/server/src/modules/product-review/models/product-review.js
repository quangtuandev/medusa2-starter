"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewModel = void 0;
const utils_1 = require("@medusajs/framework/utils");
const product_review_image_1 = require("./product-review-image");
const product_review_response_1 = require("./product-review-response");
exports.ProductReviewModel = utils_1.model
    .define('product_review', {
    id: utils_1.model.id({ prefix: 'prev' }).primaryKey(),
    name: utils_1.model.text().searchable().nullable(),
    email: utils_1.model.text().nullable(),
    rating: utils_1.model.number(),
    content: utils_1.model.text().searchable().nullable(),
    order_line_item_id: utils_1.model.text().nullable(),
    product_id: utils_1.model.text().nullable(),
    order_id: utils_1.model.text().nullable(),
    images: utils_1.model.hasMany(() => product_review_image_1.ProductReviewImageModel),
    response: utils_1.model.hasOne(() => product_review_response_1.ProductReviewResponseModel, { nullable: true }).nullable(),
    status: utils_1.model.enum(['pending', 'approved', 'flagged']).default('pending'),
})
    .indexes([
    {
        on: ['product_id'],
    },
    {
        on: ['order_id'],
    },
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9tb2RlbHMvcHJvZHVjdC1yZXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBQ2xELGlFQUFpRTtBQUNqRSx1RUFBdUU7QUFFMUQsUUFBQSxrQkFBa0IsR0FBRyxhQUFLO0tBQ3BDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtJQUN4QixFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRTtJQUM3QyxJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUMxQyxLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM5QixNQUFNLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRTtJQUN0QixPQUFPLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM3QyxrQkFBa0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzNDLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ25DLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ2pDLE1BQU0sRUFBRSxhQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLDhDQUF1QixDQUFDO0lBQ3BELFFBQVEsRUFBRSxhQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9EQUEwQixFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ3ZGLE1BQU0sRUFBRSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7Q0FDMUUsQ0FBQztLQUNELE9BQU8sQ0FBQztJQUNQO1FBQ0UsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO0tBQ25CO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7S0FDakI7Q0FDRixDQUFDLENBQUMifQ==