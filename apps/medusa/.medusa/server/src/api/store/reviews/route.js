"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const runtime_store_1 = require("../../admin/feature-flags/runtime-store");
const zod_1 = require("zod");
const CreateReviewSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    name: zod_1.z.string(),
    content: zod_1.z.string(),
    stars: zod_1.z.number().min(1).max(5),
});
// POST /store/reviews - Create a new review
const POST = async (req, res) => {
    const reviewsEnabled = runtime_store_1.runtimeFeatureFlags.get("customer_reviews")
        ?? utils_1.FeatureFlag.isFeatureEnabled("customer_reviews");
    if (!reviewsEnabled) {
        return res.sendStatus(404);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXVEO0FBQ3ZELDJFQUE2RTtBQUM3RSw2QkFBdUI7QUFFdkIsTUFBTSxrQkFBa0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2xDLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ3RCLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2hCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ25CLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDaEMsQ0FBQyxDQUFBO0FBSUYsNENBQTRDO0FBQ3JDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBb0MsRUFDcEMsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sY0FBYyxHQUFHLG1DQUFtQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztXQUM3RCxtQkFBVyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDckQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsd0JBQXdCO1FBQ3hCLE1BQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEQsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1FBQ3BGLGFBQWE7UUFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLDJCQUEyQixDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUU1RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixNQUFNO1lBQ04sT0FBTyxFQUFFLHVEQUF1RDtTQUNqRSxDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSx5QkFBeUI7U0FDbEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQTtBQTFCWSxRQUFBLElBQUksUUEwQmhCIn0=