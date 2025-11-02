"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductReviewsWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const update_product_reviews_1 = require("./steps/update-product-reviews");
const refresh_product_review_stats_1 = require("./refresh-product-review-stats");
exports.updateProductReviewsWorkflow = (0, workflows_sdk_2.createWorkflow)('update-product-reviews-workflow', (input) => {
    const productReviews = (0, update_product_reviews_1.updateProductReviewsStep)(input.productReviews);
    const productIds = (0, workflows_sdk_1.transform)({ productReviews }, ({ productReviews }) => {
        return productReviews.map((productReview) => productReview.product_id).filter((p) => p !== null);
    });
    refresh_product_review_stats_1.refreshProductReviewStatsWorkflow.runAsStep({ input: { productIds } });
    const emitData = (0, workflows_sdk_1.transform)({ productReviews }, ({ productReviews }) => {
        return {
            eventName: 'product_review.updated',
            data: productReviews.map((productReview) => ({
                id: productReview.id,
            })),
        };
    });
    (0, core_flows_1.emitEventStep)(emitData);
    return new workflows_sdk_2.WorkflowResponse(productReviews);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByb2R1Y3QtcmV2aWV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvdXBkYXRlLXByb2R1Y3QtcmV2aWV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBOEQ7QUFDOUQsNERBQTREO0FBQzVELDJEQUE4RjtBQUU5RiwyRUFBMEU7QUFDMUUsaUZBQW1GO0FBRXRFLFFBQUEsNEJBQTRCLEdBQUcsSUFBQSw4QkFBYyxFQUN4RCxpQ0FBaUMsRUFDakMsQ0FBQyxLQUFzRCxFQUFFLEVBQUU7SUFDekQsTUFBTSxjQUFjLEdBQUcsSUFBQSxpREFBd0IsRUFBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFdEUsTUFBTSxVQUFVLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUU7UUFDdEUsT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDbkcsQ0FBQyxDQUFDLENBQUM7SUFFSCxnRUFBaUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFdkUsTUFBTSxRQUFRLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUU7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSx3QkFBd0I7WUFDbkMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRTthQUNyQixDQUFDLENBQUM7U0FDSixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFBLDBCQUFhLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFFeEIsT0FBTyxJQUFJLGdDQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FDRixDQUFDIn0=