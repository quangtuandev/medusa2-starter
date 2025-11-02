import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /admin/reviews/:id/reject - Reject a review
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    const review = await productReviewsModuleService.rejectReview(id)

    res.json({
      review,
      message: "Review rejected successfully"
    })
  } catch (error: any) {
    res.status(404).json({
      error: error.message || "Failed to reject review"
    })
  }
}
