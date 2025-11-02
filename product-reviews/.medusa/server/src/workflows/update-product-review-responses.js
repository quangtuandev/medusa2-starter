"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductReviewResponsesWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const update_product_review_response_1 = require("./steps/update-product-review-response");
exports.updateProductReviewResponsesWorkflow = (0, workflows_sdk_2.createWorkflow)('update-product-review-responses-workflow', (input) => {
    const updatedProductReviewResponses = (0, update_product_review_response_1.updateProductReviewResponseStep)(input.responses);
    const emitData = (0, workflows_sdk_1.transform)({ updatedProductReviewResponses }, ({ updatedProductReviewResponses }) => {
        return {
            eventName: 'product_review_response.updated',
            data: updatedProductReviewResponses.map((response) => ({
                id: response.id,
            })),
        };
    });
    (0, core_flows_1.emitEventStep)(emitData);
    return new workflows_sdk_2.WorkflowResponse(updatedProductReviewResponses);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvdXBkYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBOEQ7QUFDOUQsNERBQTREO0FBQzVELDJEQUE4RjtBQUU5RiwyRkFBeUY7QUFFNUUsUUFBQSxvQ0FBb0MsR0FBRyxJQUFBLDhCQUFjLEVBQ2hFLDBDQUEwQyxFQUMxQyxDQUFDLEtBQThELEVBQUUsRUFBRTtJQUNqRSxNQUFNLDZCQUE2QixHQUFHLElBQUEsZ0VBQStCLEVBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXZGLE1BQU0sUUFBUSxHQUFHLElBQUEseUJBQVMsRUFBQyxFQUFFLDZCQUE2QixFQUFFLEVBQUUsQ0FBQyxFQUFFLDZCQUE2QixFQUFFLEVBQUUsRUFBRTtRQUNsRyxPQUFPO1lBQ0wsU0FBUyxFQUFFLGlDQUFpQztZQUM1QyxJQUFJLEVBQUUsNkJBQTZCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7YUFDaEIsQ0FBQyxDQUFDO1NBQ0osQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBQSwwQkFBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXhCLE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FDRixDQUFDIn0=