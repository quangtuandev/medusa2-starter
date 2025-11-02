"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductReviewResponsesWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const delete_product_review_responses_1 = require("./steps/delete-product-review-responses");
exports.deleteProductReviewResponsesWorkflow = (0, workflows_sdk_2.createWorkflow)('delete-product-review-responses-workflow', (input) => {
    const result = (0, delete_product_review_responses_1.deleteProductReviewResponseStep)(input.ids);
    const emitData = (0, workflows_sdk_1.transform)({ result, input }, ({ result, input }) => {
        return {
            eventName: 'product_review_response.deleted',
            data: input.ids.map((id) => ({
                id,
            })),
        };
    });
    (0, core_flows_1.emitEventStep)(emitData);
    return new workflows_sdk_2.WorkflowResponse(result);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvZGVsZXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBOEQ7QUFDOUQsNERBQTREO0FBQzVELDJEQUE4RjtBQUU5Riw2RkFBMEY7QUFFN0UsUUFBQSxvQ0FBb0MsR0FBRyxJQUFBLDhCQUFjLEVBQ2hFLDBDQUEwQyxFQUMxQyxDQUFDLEtBQThELEVBQUUsRUFBRTtJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFBLGlFQUErQixFQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUxRCxNQUFNLFFBQVEsR0FBRyxJQUFBLHlCQUFTLEVBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUNBQWlDO1lBQzVDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDM0IsRUFBRTthQUNILENBQUMsQ0FBQztTQUNKLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUEsMEJBQWEsRUFBQyxRQUFRLENBQUMsQ0FBQztJQUV4QixPQUFPLElBQUksZ0NBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUNGLENBQUMifQ==