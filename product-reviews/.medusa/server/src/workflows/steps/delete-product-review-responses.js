"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductReviewResponseStep = exports.deleteProductReviewResponseStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.deleteProductReviewResponseStepId = 'delete-product-review-response-step';
exports.deleteProductReviewResponseStep = (0, workflows_sdk_1.createStep)(exports.deleteProductReviewResponseStepId, async (ids, { container }) => {
    const productReviewResponseService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const responses = (await productReviewResponseService.listProductReviewResponses({
        id: ids,
    }));
    await productReviewResponseService.deleteProductReviewResponses(ids);
    return new workflows_sdk_1.StepResponse({ success: true }, responses);
}, async (data, { container }) => {
    const productReviewResponseService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    if (!data)
        return;
    await productReviewResponseService.createProductReviewResponses(data.map((response) => ({
        product_review_id: response.product_review_id,
        content: response.content,
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvZGVsZXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBbUU7QUFDbkUsaUVBQXFFO0FBSXhELFFBQUEsaUNBQWlDLEdBQUcscUNBQXFDLENBQUM7QUFFMUUsUUFBQSwrQkFBK0IsR0FBRyxJQUFBLDBCQUFVLEVBQ3ZELHlDQUFpQyxFQUNqQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQixNQUFNLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQStCLHNDQUFxQixDQUFDLENBQUM7SUFFNUcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxNQUFNLDRCQUE0QixDQUFDLDBCQUEwQixDQUFDO1FBQy9FLEVBQUUsRUFBRSxHQUFHO0tBQ1IsQ0FBQyxDQUE0QixDQUFDO0lBRS9CLE1BQU0sNEJBQTRCLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFckUsT0FBTyxJQUFJLDRCQUFZLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxFQUNELEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVCLE1BQU0sNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBK0Isc0NBQXFCLENBQUMsQ0FBQztJQUU1RyxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU07SUFFakIsTUFBTSw0QkFBNEIsQ0FBQyw0QkFBNEIsQ0FDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0QixpQkFBaUIsRUFBRSxRQUFRLENBQUMsaUJBQWlCO1FBQzdDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztLQUMxQixDQUFDLENBQUMsQ0FDSixDQUFDO0FBQ0osQ0FBQyxDQUNGLENBQUMifQ==