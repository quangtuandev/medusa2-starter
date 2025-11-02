"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshProductReviewStatsWorkflow = void 0;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const create_missing_product_review_stats_1 = require("./steps/create-missing-product-review-stats");
const recalculate_product_review_stats_1 = require("./steps/recalculate-product-review-stats");
const product_review_1 = require("../modules/product-review");
exports.refreshProductReviewStatsWorkflow = (0, workflows_sdk_2.createWorkflow)('refresh-product-review-stats-workflow', (input) => {
    const newStats = (0, create_missing_product_review_stats_1.createMissingProductReviewStatsStep)(input.productIds);
    const linkData = (0, workflows_sdk_1.transform)({ newStats }, ({ newStats }) => {
        const productLinks = newStats
            .filter((stat) => stat.product_id)
            .map((stat) => {
            return {
                [product_review_1.PRODUCT_REVIEW_MODULE]: {
                    product_review_stats_id: stat.id,
                },
                [utils_1.Modules.PRODUCT]: {
                    product_id: stat.product_id,
                },
            };
        });
        return productLinks;
    });
    (0, core_flows_1.createRemoteLinkStep)(linkData);
    (0, recalculate_product_review_stats_1.recalculateProductReviewStatsStep)(input.productIds);
    return new workflows_sdk_2.WorkflowResponse({});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1wcm9kdWN0LXJldmlldy1zdGF0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvcmVmcmVzaC1wcm9kdWN0LXJldmlldy1zdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBb0Q7QUFDcEQscUVBQThEO0FBQzlELDREQUFtRTtBQUNuRSwyREFBOEY7QUFDOUYscUdBQWtHO0FBQ2xHLCtGQUE2RjtBQUM3Riw4REFBa0U7QUFFckQsUUFBQSxpQ0FBaUMsR0FBRyxJQUFBLDhCQUFjLEVBQzdELHVDQUF1QyxFQUN2QyxDQUFDLEtBQTZDLEVBQUUsRUFBRTtJQUNoRCxNQUFNLFFBQVEsR0FBRyxJQUFBLHlFQUFtQyxFQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV2RSxNQUFNLFFBQVEsR0FBRyxJQUFBLHlCQUFTLEVBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtRQUN4RCxNQUFNLFlBQVksR0FBRyxRQUFRO2FBQzFCLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNaLE9BQU87Z0JBQ0wsQ0FBQyxzQ0FBcUIsQ0FBQyxFQUFFO29CQUN2Qix1QkFBdUIsRUFBRSxJQUFJLENBQUMsRUFBRTtpQkFDakM7Z0JBQ0QsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ2pCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUI7YUFDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUEsaUNBQW9CLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0IsSUFBQSxvRUFBaUMsRUFBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFcEQsT0FBTyxJQUFJLGdDQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FDRixDQUFDIn0=