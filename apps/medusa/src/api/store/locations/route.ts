import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const query = req.scope.resolve("query")
        const regionModuleService = req.scope.resolve(Modules.REGION)
        const [countries, countriesCount] = await regionModuleService.listAndCountCountries()

        const {
            data: locations,
            metadata: { count, take, skip } = {},
        } = await query.graph({
            entity: "location",
            fields: [
                "id",
                "name",
                "iso_country_code",
                "address_lines",
                "options",
                "created_at",
                "updated_at",
            ],
        })

        const result = Object.values(
            locations.reduce((acc, cur) => {
                const key = cur.iso_country_code;

                if (!acc[key]) {
                    acc[key] = {
                        id: cur.id,
                        iso_country_code: key,
                        items: []
                    };
                }

                acc[key].items.push({
                    name: cur.name,
                    address_lines: cur.address_lines,
                    options: cur.options
                });

                return acc;
            }, {})
        );

        const locationsMapping = result.map((location) => {
            return {
                ...location,
                country: countries.find((country) => country.iso_2 === location.iso_country_code.toLowerCase())?.display_name,
            }
        })
        res.status(200).json({
            locations: locationsMapping
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch locations",
        })
    }
}

