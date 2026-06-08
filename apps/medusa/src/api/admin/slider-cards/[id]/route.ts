import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_SLIDER_MODULE } from "../../../../modules/product-slider"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(PRODUCT_SLIDER_MODULE)
  const { id } = req.params

  const card = await service.retrieveSliderCard(id)
  if (!card) {
    res.status(404).json({ error: "Slider card not found" })
    return
  }

  res.json({ slider_card: card })
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(PRODUCT_SLIDER_MODULE)
  const { id } = req.params

  const card = await service.updateSliderCards([{ id, ...(req.body as any) }])
  res.json({ slider_card: card })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(PRODUCT_SLIDER_MODULE)
  const { id } = req.params

  await service.deleteSliderCards(id)
  res.status(204).send()
}
