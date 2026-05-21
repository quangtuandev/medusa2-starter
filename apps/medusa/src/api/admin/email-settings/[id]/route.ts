import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { EMAIL_SETTINGS_MODULE } from "../../../../modules/email-settings"
import { z } from "zod"

const updateEmailSettingSchema = z.object({
    is_enabled: z.boolean().optional(),
    subject: z.string().optional(),
    body_html: z.string().optional(),
    recipients: z.string().optional().nullable(),
})

type UpdateEmailSettingInput = z.infer<typeof updateEmailSettingSchema>

// GET /admin/email-settings/:id
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params
        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)
        const setting = await emailSettingsService.retrieveEmailSetting(id)

        res.status(200).json({ email_setting: setting })
    } catch (error: any) {
        res.status(404).json({
            message: error.message || "Email setting not found",
        })
    }
}

// POST /admin/email-settings/:id (update)
export const POST = async (
    req: MedusaRequest<UpdateEmailSettingInput>,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                message: "Email setting ID is required",
            })
        }

        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)
        const validatedData = updateEmailSettingSchema.parse(req.body)

        const setting = await emailSettingsService.updateEmailSettings({
            id,
            ...validatedData,
        })

        res.status(200).json({ email_setting: setting })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
        }
        res.status(400).json({
            message: error.message || "Failed to update email setting",
        })
    }
}

// DELETE /admin/email-settings/:id
export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params
        const emailSettingsService = req.scope.resolve(EMAIL_SETTINGS_MODULE)
        await emailSettingsService.deleteEmailSettings(id)

        res.status(200).json({ id, deleted: true })
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to delete email setting",
        })
    }
}
