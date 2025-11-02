import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/reviews/:product_id - Get approved reviews for a product
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query")
    const { product_id } = req.params
    const { offset, limit } = req.query

    const { data: reviews, metadata: { count, take, skip } = {} } = await query.graph({
      entity: "review",
      fields: ["id", "product_id", "name", "content", "stars", "created_at", "updated_at"],
      filters: {
        product_id: product_id,
        status: "approved",
      },
      pagination: {
        order: {
          created_at: "DESC",
        },
        skip: parseInt(offset as string) ?? 0,
        take: parseInt(limit as string) ?? 10,
      },
    })

    res.json({
      reviews,
      limit: take,
      offset: skip,
      count
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch reviews"
    })
  }
}
