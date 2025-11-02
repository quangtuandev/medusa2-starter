"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.GET = void 0;
const validators_1 = require("../validators");
// GET /admin/reviews/:id - Get a single review
const GET = async (req, res) => {
    try {
        const { id } = req.params;
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.retrieveReview(id);
        if (!review) {
            return res.status(404).json({
                error: "Review not found"
            });
        }
        res.json({ review });
    }
    catch (error) {
        res.status(500).json({
            error: error.message || "Failed to fetch review"
        });
    }
};
exports.GET = GET;
// PUT /admin/reviews/:id - Update a review
const PUT = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = validators_1.AdminUpdateReview.parse(req.body);
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.updateReviews([{ id, ...validatedData }]);
        res.json({ review });
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Failed to update review"
        });
    }
};
exports.PUT = PUT;
// DELETE /admin/reviews/:id - Delete a review
const DELETE = async (req, res) => {
    try {
        const { id } = req.params;
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        await productReviewsModuleService.deleteReview(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({
            error: error.message || "Failed to delete review"
        });
    }
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3MvW2lkXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw4Q0FBaUQ7QUFJakQsK0NBQStDO0FBQ3hDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtRQUN6QixNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUE7UUFFcEYsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLE1BQU0sMkJBQTJCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRW5FLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxrQkFBa0I7YUFDMUIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLHdCQUF3QjtTQUNqRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBcEJZLFFBQUEsR0FBRyxPQW9CZjtBQUVELDJDQUEyQztBQUNwQyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQXlDLEVBQ3pDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtRQUN6QixNQUFNLGFBQWEsR0FBRyw4QkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtRQUVwRixhQUFhO1FBQ2IsTUFBTSxNQUFNLEdBQUcsTUFBTSwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUxRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUN0QixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSx5QkFBeUI7U0FDbEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQTtBQWxCWSxRQUFBLEdBQUcsT0FrQmY7QUFFRCw4Q0FBOEM7QUFDdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ3RFLElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO1FBQ3pCLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtRQUVwRixhQUFhO1FBQ2IsTUFBTSwyQkFBMkIsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN4QixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSx5QkFBeUI7U0FDbEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQTtBQWRZLFFBQUEsTUFBTSxVQWNsQiJ9