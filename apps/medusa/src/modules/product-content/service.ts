import { MedusaService } from "@medusajs/framework/utils"
import { ProductContent } from "./models/product-content"

class ProductContentService extends MedusaService({
  ProductContent,
}) {}

export default ProductContentService
