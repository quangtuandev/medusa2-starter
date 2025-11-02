"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewImageModel = void 0;
const utils_1 = require("@medusajs/framework/utils");
const product_review_1 = require("./product-review");
exports.ProductReviewImageModel = utils_1.model.define('product_review_image', {
    id: utils_1.model.id({ prefix: 'prev_img' }).primaryKey(),
    url: utils_1.model.text(),
    product_review: utils_1.model.belongsTo(() => product_review_1.ProductReviewModel, {
        mappedBy: 'images',
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9tb2RlbHMvcHJvZHVjdC1yZXZpZXctaW1hZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBQ2xELHFEQUFzRDtBQUV6QyxRQUFBLHVCQUF1QixHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7SUFDMUUsRUFBRSxFQUFFLGFBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUU7SUFDakQsR0FBRyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDakIsY0FBYyxFQUFFLGFBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsbUNBQWtCLEVBQUU7UUFDeEQsUUFBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQztDQUNILENBQUMsQ0FBQyJ9