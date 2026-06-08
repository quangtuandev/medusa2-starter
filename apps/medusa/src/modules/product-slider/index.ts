import ProductSliderModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PRODUCT_SLIDER_MODULE = "productSliderModuleService"

export default Module(PRODUCT_SLIDER_MODULE, {
  service: ProductSliderModuleService,
})
