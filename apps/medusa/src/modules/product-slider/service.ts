import { MedusaService } from "@medusajs/framework/utils"
import { SliderCard } from "./models/card"

class ProductSliderModuleService extends MedusaService({
  SliderCard,
}) {}

export default ProductSliderModuleService
