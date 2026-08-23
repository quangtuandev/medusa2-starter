import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { POPUP_MODULE } from "../../../modules/popup"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const popups = await service.listPopups(
    { is_active: true },
    { order: { created_at: "DESC" } }
  )

  res.json({
    popups: popups || [],
  })
}
