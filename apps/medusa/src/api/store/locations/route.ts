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

        // Group by country, then by business name within each country
        const byCountry: Record<string, any> = {}

        for (const cur of locations) {
            const countryKey = cur.iso_country_code
            if (!byCountry[countryKey]) {
                byCountry[countryKey] = {
                    id: cur.id,
                    iso_country_code: countryKey,
                    items: {},
                }
            }

            const nameKey = cur.name || ''
            if (!byCountry[countryKey].items[nameKey]) {
                byCountry[countryKey].items[nameKey] = {
                    name: cur.name,
                    branches: [],
                }
            }

            byCountry[countryKey].items[nameKey].branches.push({
                address_lines: cur.address_lines,
                options: cur.options || [],
            })
        }

        // Convert the nested objects to arrays
        const result = Object.values(byCountry).map((group: any) => ({
            ...group,
            items: Object.values(group.items),
        }))

        const locationsMapping = result.map((location: any) => {
            return {
                ...location,
                country: countries.find((country) => country.iso_2 === location.iso_country_code.toLowerCase())?.display_name,
            }
        }).sort((a, b) => (a.country ?? '').localeCompare(b.country ?? ''))
        res.status(200).json({
            locations: locationsMapping
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch locations",
        })
    }
}

