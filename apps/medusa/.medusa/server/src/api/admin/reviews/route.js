"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const validators_1 = require("./validators");
// GET /admin/reviews - List all reviews with optional status filter
const GET = async (req, res) => {
    try {
        const query = req.scope.resolve("query");
        const { status } = req.query;
        const filters = {};
        if (status) {
            filters.status = status;
        }
        const { data: reviews, metadata: { count, take, skip } = {}, } = await query.graph({
            entity: "review",
            ...req.queryConfig,
        });
        res.status(200).json({
            reviews,
            count,
            limit: take,
            offset: skip,
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message || "Failed to fetch reviews"
        });
    }
};
exports.GET = GET;
// POST /admin/reviews - Create a new review (admin only)
const POST = async (req, res) => {
    try {
        const validatedData = validators_1.AdminCreateReview.parse(req.body);
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.createReviews(validatedData);
        res.status(201).json({
            review
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Failed to create review"
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNkNBQWdEO0FBSWhELG9FQUFvRTtBQUM3RCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUE0QixDQUFBO1FBRW5ELE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQTtRQUN2QixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDekIsQ0FBQztRQUVELE1BQU0sRUFDSixJQUFJLEVBQUUsT0FBTyxFQUNiLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUNyQyxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNwQixNQUFNLEVBQUUsUUFBUTtZQUNoQixHQUFHLEdBQUcsQ0FBQyxXQUFXO1NBQ25CLENBQUMsQ0FBQTtRQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLE9BQU87WUFDUCxLQUFLO1lBQ0wsS0FBSyxFQUFFLElBQUk7WUFDWCxNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLHlCQUF5QjtTQUNsRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBN0JZLFFBQUEsR0FBRyxPQTZCZjtBQUVELHlEQUF5RDtBQUNsRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQXlDLEVBQ3pDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLGFBQWEsR0FBRyw4QkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtRQUVwRixhQUFhO1FBQ2IsTUFBTSxNQUFNLEdBQUcsTUFBTSwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFN0UsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsTUFBTTtTQUNQLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLHlCQUF5QjtTQUNsRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBbkJZLFFBQUEsSUFBSSxRQW1CaEIifQ==