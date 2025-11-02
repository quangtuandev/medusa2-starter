"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReviewResponsesWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const create_product_review_responses_1 = require("./steps/create-product-review-responses");
exports.createProductReviewResponsesWorkflow = (0, workflows_sdk_2.createWorkflow)('create-product-review-responses-workflow', (input) => {
    const productReviewResponses = (0, create_product_review_responses_1.createProductReviewResponsesStep)(input.responses);
    const emitData = (0, workflows_sdk_1.transform)({ productReviewResponses }, ({ productReviewResponses }) => {
        return {
            eventName: 'product_review_response.created',
            data: productReviewResponses.map((response) => ({
                id: response.id,
            })),
        };
    });
    (0, core_flows_1.emitEventStep)(emitData);
    return new workflows_sdk_2.WorkflowResponse(productReviewResponses);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvY3JlYXRlLXByb2R1Y3QtcmV2aWV3LXJlc3BvbnNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBOEQ7QUFDOUQsNERBQTREO0FBQzVELDJEQUE4RjtBQUU5Riw2RkFBMkY7QUFFOUUsUUFBQSxvQ0FBb0MsR0FBRyxJQUFBLDhCQUFjLEVBQ2hFLDBDQUEwQyxFQUMxQyxDQUFDLEtBQTZELEVBQUUsRUFBRTtJQUNoRSxNQUFNLHNCQUFzQixHQUFHLElBQUEsa0VBQWdDLEVBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWpGLE1BQU0sUUFBUSxHQUFHLElBQUEseUJBQVMsRUFBQyxFQUFFLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUFFLHNCQUFzQixFQUFFLEVBQUUsRUFBRTtRQUNwRixPQUFPO1lBQ0wsU0FBUyxFQUFFLGlDQUFpQztZQUM1QyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7YUFDaEIsQ0FBQyxDQUFDO1NBQ0osQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBQSwwQkFBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXhCLE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FDRixDQUFDIn0=