import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { LOCATION_MODULE } from '../../../../modules/location'
import { z } from 'zod'

const updateLocationSchema = z.object({
    iso_country_code: z.string().min(2).max(2).optional(),
    name: z.string().min(1).optional(),
    address_lines: z.string().min(1).optional(),
    options: z.array(z.object({
        name: z.string(),
        value: z.string(),
        type: z.string(),
    })).optional(),
})

type UpdateLocationInput = z.infer<typeof updateLocationSchema>

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        const locationService: any = req.scope.resolve(LOCATION_MODULE)
        const { id } = req.params
        const location = await locationService.retrieveLocation(id)
        res.json({ location: location })
    } catch (error: any) {
        res.status(404).json({ message: error.message || 'Location not found' })
    }
}

export async function PUT(
    req: MedusaRequest<UpdateLocationInput>,
    res: MedusaResponse
): Promise<void> {
    const locationService: any = req.scope.resolve(LOCATION_MODULE)
    const { id } = req.params

    try {
        const validatedData = updateLocationSchema.parse(req.body)
        const location = await locationService.updateLocations([{ id, ...validatedData }])
        res.json({ location: location[0] })
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
            return
        }
        res.status(400).json({
            message: error.message || "Failed to update location",
        })
    }
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const locationService: any = req.scope.resolve(LOCATION_MODULE)
    const { id } = req.params

    try {
        await locationService.deleteLocations(id)
        res.status(204).send()
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to delete location",
        })
    }
}

