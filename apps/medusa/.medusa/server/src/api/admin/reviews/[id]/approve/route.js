"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
// POST /admin/reviews/:id/approve - Approve a review
const POST = async (req, res) => {
    try {
        const { id } = req.params;
        const productReviewsModuleService = req.scope.resolve("productReviewsModuleService");
        // @ts-ignore
        const review = await productReviewsModuleService.approveReview(id);
        res.json({
            review,
            message: "Review approved successfully"
        });
    }
    catch (error) {
        res.status(404).json({
            error: error.message || "Failed to approve review"
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3MvW2lkXS9hcHByb3ZlL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFEQUFxRDtBQUM5QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDcEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7UUFDekIsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1FBRXBGLGFBQWE7UUFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVsRSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsTUFBTTtZQUNOLE9BQU8sRUFBRSw4QkFBOEI7U0FDeEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksMEJBQTBCO1NBQ25ELENBQUMsQ0FBQTtJQUNKLENBQUM7QUFDSCxDQUFDLENBQUE7QUFqQlksUUFBQSxJQUFJLFFBaUJoQiJ9