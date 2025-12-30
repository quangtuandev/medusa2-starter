import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const regionModuleService = req.scope.resolve(Modules.REGION)

    const [countries, count] = await regionModuleService.listAndCountCountries()

    res.json({ countries, count })
}