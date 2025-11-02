import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { AdminUpdateReview } from "../validators"

type AdminUpdateReviewType = z.infer<typeof AdminUpdateReview>

// GET /admin/reviews/:id - Get a single review
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    const review = await productReviewsModuleService.retrieveReview(id)

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      })
    }

    res.json({ review })
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch review"
    })
  }
}

// PUT /admin/reviews/:id - Update a review
export const PUT = async (
  req: MedusaRequest<AdminUpdateReviewType>,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const validatedData = AdminUpdateReview.parse(req.body)
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    const review = await productReviewsModuleService.updateReviews(id, validatedData)

    res.json({ review })
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Failed to update review"
    })
  }
}

// DELETE /admin/reviews/:id - Delete a review
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    await productReviewsModuleService.deleteReview(id)

    res.status(204).send()
  } catch (error: any) {
    res.status(404).json({
      error: error.message || "Failed to delete review"
    })
  }
}
