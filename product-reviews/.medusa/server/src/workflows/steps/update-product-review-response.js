"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductReviewResponseStep = exports.updateProductReviewResponseStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.updateProductReviewResponseStepId = 'update-product-review-response-step';
exports.updateProductReviewResponseStep = (0, workflows_sdk_1.createStep)(exports.updateProductReviewResponseStepId, async (data, { container }) => {
    const productReviewResponseService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const existingResponses = await productReviewResponseService.listProductReviewResponses({
        id: data.map((d) => d.id),
    });
    const updatedResponses = await productReviewResponseService.updateProductReviewResponses(data);
    return new workflows_sdk_1.StepResponse(updatedResponses, existingResponses);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9zdGVwcy91cGRhdGUtcHJvZHVjdC1yZXZpZXctcmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQW1FO0FBQ25FLGlFQUFxRTtBQUt4RCxRQUFBLGlDQUFpQyxHQUFHLHFDQUFxQyxDQUFDO0FBRTFFLFFBQUEsK0JBQStCLEdBQUcsSUFBQSwwQkFBVSxFQUN2RCx5Q0FBaUMsRUFDakMsS0FBSyxFQUFFLElBQXdDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBK0Isc0NBQXFCLENBQUMsQ0FBQztJQUU1RyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sNEJBQTRCLENBQUMsMEJBQTBCLENBQUM7UUFDdEYsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxnQkFBZ0IsR0FDcEIsTUFBTSw0QkFBNEIsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4RSxPQUFPLElBQUksNEJBQVksQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9ELENBQUMsQ0FDRixDQUFDIn0=