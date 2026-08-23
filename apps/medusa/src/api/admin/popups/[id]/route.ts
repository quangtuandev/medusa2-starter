import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { POPUP_MODULE } from "../../../../modules/popup"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const { id } = req.params

  const popup = await service.retrievePopup(id)
  if (!popup) {
    res.status(404).json({ error: "Popup not found" })
    return
  }

  res.json({ popup })
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const { id } = req.params

  const popup = await service.updatePopups([{ id, ...(req.body as any) }])
  res.json({ popup })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const { id } = req.params

  await service.deletePopups(id)
  res.status(204).send()
}
