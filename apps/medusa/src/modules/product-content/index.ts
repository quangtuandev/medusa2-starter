import { Module } from "@medusajs/framework/utils"
import ProductContentService from "./service"

export const PRODUCT_CONTENT_MODULE = "product_content"

export default Module(PRODUCT_CONTENT_MODULE, {
  service: ProductContentService,
})
