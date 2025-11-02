import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const CreateReviewSchema = z.object({
  product_id: z.string(),
  name: z.string(),
  content: z.string(),
  stars: z.number().min(1).max(5),
})

type CreateReviewType = z.infer<typeof CreateReviewSchema>

// POST /store/reviews - Create a new review
export const POST = async (
  req: MedusaRequest<CreateReviewType>,
  res: MedusaResponse
) => {
  try {
    // Validate request body
    const validatedData = CreateReviewSchema.parse(req.body)
    console.log(validatedData, 'validatedData');
    const productReviewsModuleService = req.scope.resolve("productReviewsModuleService")
    console.log(productReviewsModuleService, 'productReviewsModuleService');
    const review = await productReviewsModuleService.createReview(validatedData)

    res.status(201).json({
      review,
      message: "Review submitted successfully and is pending approval"
    })
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Failed to create review"
    })
  }
}
