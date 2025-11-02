"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const zod_1 = require("zod");
const CreateReviewSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    name: zod_1.z.string(),
    content: zod_1.z.string(),
    stars: zod_1.z.number().min(1).max(5),
});
// POST /store/reviews - Create a new review
const POST = async (req, res) => {
    try {
        // Validate request body
        const validatedData = CreateReviewSchema.parse(req.body);
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.createReview(validatedData);
        res.status(201).json({
            review,
            message: "Review submitted successfully and is pending approval"
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Failed to create review"
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkJBQXVCO0FBRXZCLE1BQU0sa0JBQWtCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNsQyxVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUN0QixJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNoQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNuQixLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2hDLENBQUMsQ0FBQTtBQUlGLDRDQUE0QztBQUNyQyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQW9DLEVBQ3BDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCx3QkFBd0I7UUFDeEIsTUFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RCxNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUE7UUFDcEYsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLE1BQU0sMkJBQTJCLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRTVFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLE1BQU07WUFDTixPQUFPLEVBQUUsdURBQXVEO1NBQ2pFLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLHlCQUF5QjtTQUNsRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBcEJZLFFBQUEsSUFBSSxRQW9CaEIifQ==