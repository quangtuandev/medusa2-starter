import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /admin/reviews/:id/approve - Approve a review
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    // @ts-ignore
    const review = await productReviewsModuleService.approveReview(id)

    res.json({
      review,
      message: "Review approved successfully"
    })
  } catch (error: any) {
    res.status(404).json({
      error: error.message || "Failed to approve review"
    })
  }
}
