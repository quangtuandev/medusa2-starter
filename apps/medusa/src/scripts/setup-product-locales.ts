import type { ExecArgs, IStoreModuleService } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { PRODUCT_LOCALES } from "../modules/product-content/locales"

export default async function setupProductLocales({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storeService = container.resolve<IStoreModuleService>(Modules.STORE)
  const [store] = await storeService.listStores()

  if (!store) {
    throw new Error("Store not found")
  }

  await storeService.updateStores(store.id, {
    supported_locales: PRODUCT_LOCALES.map((locale_code) => ({ locale_code })),
  })

  logger.info(`Configured product locales: ${PRODUCT_LOCALES.join(", ")}`)
}
