import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { PRODUCT_CONTENT_MODULE } from "../../../modules/product-content"
import {
  normalizeProductContentInput,
  type ProductContentInput,
} from "../../../modules/product-content/input"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productId = String(req.query.product_id ?? "").trim()

  if (!productId) {
    return res.status(400).json({ message: "product_id is required" })
  }

  const service = req.scope.resolve(PRODUCT_CONTENT_MODULE) as any
  const [items] = await service.listAndCountProductContents({ product_id: productId })

  return res.json({ product_content: items[0] ?? null })
}

export const POST = async (
  req: MedusaRequest<ProductContentInput>,
  res: MedusaResponse,
) => {
  let input

  try {
    input = normalizeProductContentInput(req.body)
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Invalid product content",
    })
  }

  const productService = req.scope.resolve(Modules.PRODUCT) as any
  try {
    await productService.retrieveProduct(input.product_id)
  } catch {
    return res.status(404).json({ message: "Product not found" })
  }

  const service = req.scope.resolve(PRODUCT_CONTENT_MODULE) as any
  const [existing] = await service.listAndCountProductContents({
    product_id: input.product_id,
  })

  const productContent = existing[0]
    ? await service.updateProductContents({ id: existing[0].id, ...input })
    : await service.createProductContents(input)

  return res.json({ product_content: productContent })
}
