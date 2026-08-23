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
      store: store ? { id: store.id, name: store.name } : null,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch site settings" })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const storeService = req.scope.resolve<IStoreModuleService>(Modules.STORE)
    const [store] = await storeService.listStores()

    if (!store) {
      res.status(404).json({ message: "Store not found" })
      return
    }

    const currentMetadata = (store.metadata || {}) as Record<string, any>
    const newMetadata = {
      ...currentMetadata,
      ...(req.body as Record<string, any>),
    }

    const updatedStore = await storeService.updateStores(store.id, {
      metadata: newMetadata,
    })

    res.json({
      settings: updatedStore.metadata,
      message: "Site settings updated successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update site settings" })
  }
}
