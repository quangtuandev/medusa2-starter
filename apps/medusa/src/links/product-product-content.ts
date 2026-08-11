import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductContentModule from "../modules/product-content"

export default defineLink(
  {
    linkable: ProductContentModule.linkable.productContent,
    field: "product_id",
  },
  ProductModule.linkable.product,
  {
    readOnly: true,
  },
)
