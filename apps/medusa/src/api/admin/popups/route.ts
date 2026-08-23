import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { POPUP_MODULE } from "../../../modules/popup"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const [popups, count] = await service.listAndCountPopups(
    {},
    { order: { created_at: "DESC" } }
  )

  res.json({
    popups,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const service: any = req.scope.resolve(POPUP_MODULE)
  const popup = await service.createPopups(req.body)

  res.json({ popup })
}
