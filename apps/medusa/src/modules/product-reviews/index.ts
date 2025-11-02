import ProductReviewsModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PRODUCT_REVIEWS_MODULE = "productReviewsModuleService"

export default Module(PRODUCT_REVIEWS_MODULE, {
  service: ProductReviewsModuleService,
})
