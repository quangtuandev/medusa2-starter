"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductReviewsStep = exports.updateProductReviewsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.updateProductReviewsStepId = 'update-product-reviews-step';
exports.updateProductReviewsStep = (0, workflows_sdk_1.createStep)(exports.updateProductReviewsStepId, async (data, { container }) => {
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const existingReviews = await productReviewService.listProductReviews({ id: data.map(d => d.id) }, {
        relations: ['images'],
    });
    const updatedReviews = await productReviewService.updateProductReviews(data);
    return new workflows_sdk_1.StepResponse(updatedReviews, existingReviews);
}, async (data, { container }) => {
    if (!data || !Array.isArray(data))
        return;
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    await productReviewService.updateProductReviews(data);
    await productReviewService.refreshProductReviewStats(data.map(d => d.product_id).filter(p => p !== null));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByb2R1Y3QtcmV2aWV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvdXBkYXRlLXByb2R1Y3QtcmV2aWV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBbUU7QUFDbkUsaUVBQXFFO0FBSXhELFFBQUEsMEJBQTBCLEdBQUcsNkJBQTZCLENBQUM7QUFFM0QsUUFBQSx3QkFBd0IsR0FBRyxJQUFBLDBCQUFVLEVBQ2hELGtDQUEwQixFQUMxQixLQUFLLEVBQUUsSUFBZ0MsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUM1QyxzQ0FBcUIsQ0FDdEIsQ0FBQztJQUVGLE1BQU0sZUFBZSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsa0JBQWtCLENBQ25FLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDM0I7UUFDRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7S0FDdEIsQ0FDRixDQUFDO0lBRUYsTUFBTSxjQUFjLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FDcEUsSUFBYSxDQUNkLENBQUM7SUFFRixPQUFPLElBQUksNEJBQVksQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDM0QsQ0FBQyxFQUNELEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVCLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU87SUFFMUMsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUM1QyxzQ0FBcUIsQ0FDdEIsQ0FBQztJQUVGLE1BQU0sb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsSUFBYSxDQUFDLENBQUM7SUFFL0QsTUFBTSxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQ3BELENBQUM7QUFDSixDQUFDLENBQ0YsQ0FBQyJ9