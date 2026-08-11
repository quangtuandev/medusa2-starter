import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { LOCATION_MODULE } from "../../../modules/location"
import { z } from "zod"

const createLocationSchema = z.object({
    iso_country_code: z.string().min(2).max(2),
    name: z.string().min(1),
    address_lines: z.string().min(1),
    options: z.array(z.object({
        name: z.string(),
        value: z.string(),
        type: z.string(),
    })).optional().default([]),
})

type CreateLocationInput = z.infer<typeof createLocationSchema>

export const POST = async (
    req: MedusaRequest<CreateLocationInput>,
    res: MedusaResponse
) => {
    try {
        const locationService = req.scope.resolve(LOCATION_MODULE)
        const validatedData = createLocationSchema.parse(req.body)

        const location = await locationService.createLocations(validatedData as any)

        res.status(201).json({ location: location })
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
            return
        }
        res.status(400).json({
            message: error.message || "Failed to create location",
        })
    }
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const query = req.scope.resolve("query")
        const { iso_country_code, offset, limit, order } = req.query as {
            iso_country_code?: string
            offset?: string
            limit?: string
            order?: string
        }

        // Build filters
        const filters: any = {}
        if (iso_country_code) {
            filters.iso_country_code = iso_country_code
        }

        // Build pagination
        const pagination: any = {
            skip: offset ? parseInt(offset) : 0,
            take: limit ? parseInt(limit) : 20,
        }

        // Build order
        if (order) {
            pagination.order = {}
            const orderParts = order.split(",")
            for (const part of orderParts) {
                const [field, direction] = part.trim().split(":")
                pagination.order[field] = direction?.toUpperCase() || "ASC"
            }
        } else {
            // Default order by created_at
            pagination.order = {
                created_at: "DESC",
            }
        }

        const {
            data: locations,
            metadata: { count, take, skip } = {},
        } = await query.graph({
            entity: "location",
            fields: [
                "id",
                "iso_country_code",
                "name",
                "address_lines",
                "options",
            ],
            filters,
            pagination,
        })

        res.status(200).json({
            locations: locations,
            count,
            limit: take,
            offset: skip,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch locations",
        })
    }
}
