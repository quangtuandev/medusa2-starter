"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewResponseModel = void 0;
const utils_1 = require("@medusajs/framework/utils");
const product_review_1 = require("./product-review");
exports.ProductReviewResponseModel = utils_1.model.define('product_review_response', {
    id: utils_1.model.id({ prefix: 'prr' }).primaryKey(),
    content: utils_1.model.text(),
    product_review: utils_1.model.belongsTo(() => product_review_1.ProductReviewModel, {
        mappedBy: 'response',
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctcmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9tb2RlbHMvcHJvZHVjdC1yZXZpZXctcmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtEO0FBQ2xELHFEQUFzRDtBQUV6QyxRQUFBLDBCQUEwQixHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQUU7SUFDaEYsRUFBRSxFQUFFLGFBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUU7SUFDNUMsT0FBTyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDckIsY0FBYyxFQUFFLGFBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsbUNBQWtCLEVBQUU7UUFDeEQsUUFBUSxFQUFFLFVBQVU7S0FDckIsQ0FBQztDQUNILENBQUMsQ0FBQyJ9