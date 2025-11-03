import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { AdminCreateReview } from "./validators"

type AdminCreateReviewType = z.infer<typeof AdminCreateReview>

// GET /admin/reviews - List all reviews with optional status filter
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query")
    const { status } = req.query as { status?: string }

    const filters: any = {}
    if (status) {
      filters.status = status
    }

    const {
      data: reviews,
      metadata: { count, take, skip } = {},
    } = await query.graph({
      entity: "review",
      fields: ["id", "product_id", "name", "content", "status", "stars", "created_at", "updated_at"],
      pagination: {
        order: {
          created_at: "DESC",
        },
        skip: parseInt(req.query.offset as string) ?? 0,
        take: parseInt(req.query.limit as string) ?? 10,
      },
    })

    res.status(200).json({
      reviews,
      count,
      limit: take,
      offset: skip,
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch reviews"
    })
  }
}

// POST /admin/reviews - Create a new review (admin only)
export const POST = async (
  req: MedusaRequest<AdminCreateReviewType>,
  res: MedusaResponse
) => {
  try {
    const validatedData = AdminCreateReview.parse(req.body)
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")

    // @ts-ignore
    const review = await productReviewsModuleService.createReviews(validatedData)

    res.status(201).json({
      review
    })
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Failed to create review"
    })
  }
}
