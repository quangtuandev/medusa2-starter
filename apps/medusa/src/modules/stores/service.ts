import { MedusaService } from "@medusajs/framework/utils"
import { Store } from "./models/store"

class StoreService extends MedusaService({
    Store,
}) {
    // Custom methods can be added here if needed
    // The base CRUD methods are automatically available from MedusaService
}

export default StoreService
