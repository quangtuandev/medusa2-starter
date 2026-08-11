import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query") as any
  const { data } = await query.graph(
    {
      entity: "product_content",
      fields: [
        "id",
        "product_id",
        "notes",
        "ingredients",
        "precautions_of_use",
        "application_tips",
      ],
      filters: { product_id: req.params.id },
    },
    { locale: req.locale },
  )

  if (!data[0]) {
    return res.status(404).json({ message: "Product content not found" })
  }

  return res.json({ product_content: data[0] })
}
