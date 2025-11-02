"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMissingProductReviewStatsStep = exports.createMissingProductReviewStatsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.createMissingProductReviewStatsStepId = 'create-missing-product-review-stats';
exports.createMissingProductReviewStatsStep = (0, workflows_sdk_1.createStep)(exports.createMissingProductReviewStatsStepId, async (productIds, { container }) => {
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const stats = await productReviewService.listProductReviewStats({
        product_id: productIds,
    });
    const missingStats = productIds.filter((productId) => !stats.some((stat) => stat.product_id === productId));
    const createdStats = (await productReviewService.createProductReviewStats(missingStats.map((productId) => ({ product_id: productId }))));
    return new workflows_sdk_1.StepResponse(createdStats, createdStats.map((stat) => stat.id));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLW1pc3NpbmctcHJvZHVjdC1yZXZpZXctc3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3N0ZXBzL2NyZWF0ZS1taXNzaW5nLXByb2R1Y3QtcmV2aWV3LXN0YXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUE2RTtBQUM3RSxpRUFBcUU7QUFJeEQsUUFBQSxxQ0FBcUMsR0FBRyxxQ0FBcUMsQ0FBQztBQUU5RSxRQUFBLG1DQUFtQyxHQUFHLElBQUEsMEJBQVUsRUFDM0QsNkNBQXFDLEVBQ3JDLEtBQUssRUFBRSxVQUFvQixFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1QyxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQXVCLHNDQUFxQixDQUFDLENBQUM7SUFFNUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQztRQUM5RCxVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFFSCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztJQUU1RyxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQU0sb0JBQW9CLENBQUMsd0JBQXdCLENBQ3ZFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUM3RCxDQUF5QixDQUFDO0lBRTNCLE9BQU8sSUFBSSw0QkFBWSxDQUNyQixZQUFZLEVBQ1osWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNwQyxDQUFDO0FBQ0osQ0FBQyxDQUNGLENBQUMifQ==