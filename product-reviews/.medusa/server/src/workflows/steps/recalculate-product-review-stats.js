"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateProductReviewStatsStep = exports.recalculateProductReviewStatsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.recalculateProductReviewStatsStepId = 'recalculate-product-review-stats';
exports.recalculateProductReviewStatsStep = (0, workflows_sdk_1.createStep)(exports.recalculateProductReviewStatsStepId, async (productIds, { container }) => {
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const stats = await productReviewService.listProductReviewStats({
        product_id: productIds,
    });
    await productReviewService.refreshProductReviewStats(productIds);
    return new workflows_sdk_1.StepResponse(stats, stats.map((stat) => stat.id));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYWxjdWxhdGUtcHJvZHVjdC1yZXZpZXctc3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3N0ZXBzL3JlY2FsY3VsYXRlLXByb2R1Y3QtcmV2aWV3LXN0YXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUE2RTtBQUU3RSxpRUFBcUU7QUFFeEQsUUFBQSxtQ0FBbUMsR0FBRyxrQ0FBa0MsQ0FBQztBQUV6RSxRQUFBLGlDQUFpQyxHQUFHLElBQUEsMEJBQVUsRUFDekQsMkNBQW1DLEVBQ25DLEtBQUssRUFBRSxVQUFvQixFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1QyxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQXVCLHNDQUFxQixDQUFDLENBQUM7SUFFNUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQztRQUM5RCxVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFFSCxNQUFNLG9CQUFvQixDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpFLE9BQU8sSUFBSSw0QkFBWSxDQUNyQixLQUFLLEVBQ0wsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUM3QixDQUFDO0FBQ0osQ0FBQyxDQUNGLENBQUMifQ==