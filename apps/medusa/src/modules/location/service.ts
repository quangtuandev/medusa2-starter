import { MedusaService } from "@medusajs/framework/utils"
import { Location } from "./models/location"

class LocationService extends MedusaService({
    Location,
}) {
    // Custom methods can be added here if needed
    // The base CRUD methods are automatically available from MedusaService
}

export default LocationService

