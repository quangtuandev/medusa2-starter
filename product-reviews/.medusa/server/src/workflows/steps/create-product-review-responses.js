"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReviewResponsesStep = exports.createProductReviewResponsesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const product_review_1 = require("../../modules/product-review");
exports.createProductReviewResponsesStepId = 'create-product-review-response-step';
exports.createProductReviewResponsesStep = (0, workflows_sdk_1.createStep)(exports.createProductReviewResponsesStepId, async (data, { container }) => {
    const productReviewResponseService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    const createdResponses = (await productReviewResponseService.createProductReviewResponses(data));
    return new workflows_sdk_1.StepResponse(createdResponses, createdResponses.map((cr) => cr.id));
}, async (data, { container }) => {
    if (!data)
        return;
    const productReviewResponseService = container.resolve(product_review_1.PRODUCT_REVIEW_MODULE);
    await productReviewResponseService.deleteProductReviewResponses(data);
    return new workflows_sdk_1.StepResponse({ success: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvY3JlYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBbUU7QUFDbkUsaUVBQXFFO0FBS3hELFFBQUEsa0NBQWtDLEdBQUcscUNBQXFDLENBQUM7QUFFM0UsUUFBQSxnQ0FBZ0MsR0FBRyxJQUFBLDBCQUFVLEVBS3hELDBDQUFrQyxFQUNsQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1QixNQUFNLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQStCLHNDQUFxQixDQUFDLENBQUM7SUFFNUcsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sNEJBQTRCLENBQUMsNEJBQTRCLENBQ3ZGLElBQUksQ0FDTCxDQUE0QixDQUFDO0lBRTlCLE9BQU8sSUFBSSw0QkFBWSxDQUNyQixnQkFBZ0IsRUFDaEIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQ3BDLENBQUM7QUFDSixDQUFDLEVBQ0QsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUIsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPO0lBRWxCLE1BQU0sNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBK0Isc0NBQXFCLENBQUMsQ0FBQztJQUU1RyxNQUFNLDRCQUE0QixDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXRFLE9BQU8sSUFBSSw0QkFBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUNGLENBQUMifQ==