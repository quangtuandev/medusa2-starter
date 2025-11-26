"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
// POST /admin/reviews/:id/reject - Reject a review
const POST = async (req, res) => {
    try {
        const { id } = req.params;
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.rejectReview(id);
        res.json({
            review,
            message: "Review rejected successfully"
        });
    }
    catch (error) {
        res.status(404).json({
            error: error.message || "Failed to reject review"
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3MvW2lkXS9yZWplY3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbURBQW1EO0FBQzVDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNwRSxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtRQUN6QixNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUE7UUFFcEYsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLE1BQU0sMkJBQTJCLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWpFLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxNQUFNO1lBQ04sT0FBTyxFQUFFLDhCQUE4QjtTQUN4QyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSx5QkFBeUI7U0FDbEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQTtBQWpCWSxRQUFBLElBQUksUUFpQmhCIn0=