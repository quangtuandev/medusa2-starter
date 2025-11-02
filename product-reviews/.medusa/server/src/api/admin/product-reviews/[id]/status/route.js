"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = void 0;
const update_product_reviews_1 = require("../../../../../workflows/update-product-reviews");
const PUT = async (req, res) => {
    const review_id = req.params.id;
    const { status } = req.validatedBody;
    const result = await (0, update_product_reviews_1.updateProductReviewsWorkflow)(req.scope).run({
        input: {
            productReviews: [{
                    id: review_id,
                    status
                }]
        }
    });
    res.status(200).json({ product_review: result.result[0] });
};
exports.PUT = PUT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3cy9baWRdL3N0YXR1cy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw0RkFBK0Y7QUFFeEYsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFnRSxFQUNoRSxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDaEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFFckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHFEQUE0QixFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDL0QsS0FBSyxFQUFFO1lBQ0wsY0FBYyxFQUFFLENBQUM7b0JBQ2YsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsTUFBTTtpQkFDUCxDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUM7QUFqQlcsUUFBQSxHQUFHLE9BaUJkIn0=