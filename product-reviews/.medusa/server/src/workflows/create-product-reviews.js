"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReviewsWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const create_product_reviews_1 = require("./steps/create-product-reviews");
const utils_1 = require("@medusajs/framework/utils");
const refresh_product_review_stats_1 = require("./refresh-product-review-stats");
const product_review_1 = require("../../src/modules/product-review");
exports.createProductReviewsWorkflow = (0, workflows_sdk_2.createWorkflow)('create-product-reviews-workflow', (input) => {
    const productReviews = (0, create_product_reviews_1.createProductReviewsStep)(input.productReviews);
    const productIds = (0, workflows_sdk_1.transform)({ productReviews }, ({ productReviews }) => {
        return productReviews.map((productReview) => productReview.product_id).filter((p) => p !== null);
    });
    const linkData = (0, workflows_sdk_1.transform)({ productReviews }, ({ productReviews }) => {
        const productLinks = productReviews
            .filter((productReview) => productReview.product_id)
            .map((productReview) => {
            return {
                [product_review_1.PRODUCT_REVIEW_MODULE]: {
                    product_review_id: productReview.id,
                },
                [utils_1.Modules.PRODUCT]: {
                    product_id: productReview.product_id,
                },
            };
        });
        const orderLinks = productReviews
            .filter((productReview) => productReview.order_id)
            .map((productReview) => {
            return {
                [product_review_1.PRODUCT_REVIEW_MODULE]: {
                    product_review_id: productReview.id,
                },
                [utils_1.Modules.ORDER]: {
                    order_id: productReview.order_id,
                },
            };
        });
        const orderLineItemLinks = productReviews
            .filter((productReview) => productReview.order_line_item_id)
            .map((productReview) => {
            return {
                [product_review_1.PRODUCT_REVIEW_MODULE]: {
                    product_review_id: productReview.id,
                },
                [utils_1.Modules.ORDER]: {
                    order_line_item_id: productReview.order_line_item_id,
                },
            };
        });
        return [...productLinks, ...orderLinks, ...orderLineItemLinks];
    });
    refresh_product_review_stats_1.refreshProductReviewStatsWorkflow.runAsStep({ input: { productIds: productIds } });
    (0, core_flows_1.createRemoteLinkStep)(linkData);
    const emitData = (0, workflows_sdk_1.transform)({ productReviews }, ({ productReviews }) => {
        return {
            eventName: 'product_review.created',
            data: productReviews.map((productReview) => ({
                id: productReview.id,
            })),
        };
    });
    (0, core_flows_1.emitEventStep)(emitData);
    return new workflows_sdk_2.WorkflowResponse(productReviews);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2R1Y3QtcmV2aWV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvY3JlYXRlLXByb2R1Y3QtcmV2aWV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBOEQ7QUFDOUQsNERBQWtGO0FBQ2xGLDJEQUE4RjtBQUU5RiwyRUFBMEU7QUFDMUUscURBQW9EO0FBQ3BELGlGQUFtRjtBQUNuRixxRUFBeUU7QUFFNUQsUUFBQSw0QkFBNEIsR0FBRyxJQUFBLDhCQUFjLEVBQ3hELGlDQUFpQyxFQUNqQyxDQUFDLEtBQXNELEVBQUUsRUFBRTtJQUN6RCxNQUFNLGNBQWMsR0FBRyxJQUFBLGlEQUF3QixFQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV0RSxNQUFNLFVBQVUsR0FBRyxJQUFBLHlCQUFTLEVBQUMsRUFBRSxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRTtRQUN0RSxPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNuRyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sUUFBUSxHQUFHLElBQUEseUJBQVMsRUFBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFO1FBQ3BFLE1BQU0sWUFBWSxHQUFHLGNBQWM7YUFDaEMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO2FBQ25ELEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3JCLE9BQU87Z0JBQ0wsQ0FBQyxzQ0FBcUIsQ0FBQyxFQUFFO29CQUN2QixpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRTtpQkFDcEM7Z0JBQ0QsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ2pCLFVBQVUsRUFBRSxhQUFhLENBQUMsVUFBVTtpQkFDckM7YUFDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFTCxNQUFNLFVBQVUsR0FBRyxjQUFjO2FBQzlCLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQzthQUNqRCxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNyQixPQUFPO2dCQUNMLENBQUMsc0NBQXFCLENBQUMsRUFBRTtvQkFDdkIsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLEVBQUU7aUJBQ3BDO2dCQUNELENBQUMsZUFBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNmLFFBQVEsRUFBRSxhQUFhLENBQUMsUUFBUTtpQkFDakM7YUFDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFTCxNQUFNLGtCQUFrQixHQUFHLGNBQWM7YUFDdEMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7YUFDM0QsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDckIsT0FBTztnQkFDTCxDQUFDLHNDQUFxQixDQUFDLEVBQUU7b0JBQ3ZCLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxFQUFFO2lCQUNwQztnQkFDRCxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDZixrQkFBa0IsRUFBRSxhQUFhLENBQUMsa0JBQWtCO2lCQUNyRDthQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVMLE9BQU8sQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLFVBQVUsRUFBRSxHQUFHLGtCQUFrQixDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxnRUFBaUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRW5GLElBQUEsaUNBQW9CLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUU7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSx3QkFBd0I7WUFDbkMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRTthQUNyQixDQUFDLENBQUM7U0FDSixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFBLDBCQUFhLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFFeEIsT0FBTyxJQUFJLGdDQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FDRixDQUFDIn0=