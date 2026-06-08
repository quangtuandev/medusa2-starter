import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_SLIDER_MODULE } from "../../../modules/product-slider"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(PRODUCT_SLIDER_MODULE)
  const [cards, count] = await service.listAndCountSliderCards(
    {},
    { order: { rank: "ASC" } }
  )

  res.json({
    slider_cards: cards,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(PRODUCT_SLIDER_MODULE)
  const card = await service.createSliderCards(req.body)

  res.json({ slider_card: card })
}
