import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { IStoreModuleService } from "@medusajs/framework/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const storeService = req.scope.resolve<IStoreModuleService>(Modules.STORE)
    const [store] = await storeService.listStores()

    res.json({
      settings: store?.metadata || {},
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch site settings" })
  }
}
