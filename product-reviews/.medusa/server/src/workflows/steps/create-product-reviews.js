"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReviewsStep = exports.createProductReviewsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.createProductReviewsStepId = 'create-product-review-step';
exports.createProductReviewsStep = (0, workflows_sdk_1.createStep)(exports.createProductReviewsStepId, async (data, { container }) => {
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const images = data.flatMap((productReview, index) => (productReview.images ?? []).map(i => ({ url: i.url, index })));
    const createData = data.map(d => ({
        ...d,
        status: productReviewService.defaultReviewStatus,
        images: d.images?.map(image => ({
            url: image.url,
        })) ?? [],
    }));
    const productReviews = await productReviewService.createProductReviews(createData);
    await productReviewService.createProductReviewImages(images.map(i => ({
        product_review_id: productReviews[i.index].id,
        url: i.url,
    })));
    return new workflows_sdk_1.StepResponse(productReviews, {
        productReviewIds: productReviews.map(productReview => productReview.id),
    });
}, async (data, { container }) => {
    if (!data)
        return;
    const { productReviewIds } = data;
    const productReviewService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    await productReviewService.deleteProductReviews(productReviewIds);
    await productReviewService.refreshProductReviewStats(productReviewIds);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2R1Y3QtcmV2aWV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvY3JlYXRlLXByb2R1Y3QtcmV2aWV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBbUU7QUFDbkUsaUVBQXFFO0FBSXhELFFBQUEsMEJBQTBCLEdBQUcsNEJBQTRCLENBQUM7QUFHMUQsUUFBQSx3QkFBd0IsR0FBRyxJQUFBLDBCQUFVLEVBQ2hELGtDQUEwQixFQUMxQixLQUFLLEVBQUUsSUFBZ0MsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUM1QyxzQ0FBcUIsQ0FDdEIsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDbkQsQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQy9ELENBQUM7SUFFRixNQUFNLFVBQVUsR0FBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUM7UUFDSixNQUFNLEVBQUUsb0JBQW9CLENBQUMsbUJBQW1CO1FBQ2hELE1BQU0sRUFDSixDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1NBQ2YsQ0FBQyxDQUFDLElBQUksRUFBRTtLQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUosTUFBTSxjQUFjLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FDcEUsVUFBVSxDQUNYLENBQUM7SUFDRixNQUFNLG9CQUFvQixDQUFDLHlCQUF5QixDQUNsRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNmLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUM3QyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7S0FDWCxDQUFDLENBQUMsQ0FDSixDQUFDO0lBRUYsT0FBTyxJQUFJLDRCQUFZLENBQUMsY0FBYyxFQUFFO1FBQ3RDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0tBQ3hFLENBQUMsQ0FBQztBQUNMLENBQUMsRUFDRCxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1QixJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU87SUFFbEIsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRWxDLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FDNUMsc0NBQXFCLENBQ3RCLENBQUM7SUFFRixNQUFNLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFbEUsTUFBTSxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pFLENBQUMsQ0FDRixDQUFDIn0=