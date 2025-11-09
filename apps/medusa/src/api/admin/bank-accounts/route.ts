import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { BANK_ACCOUNT_MODULE } from "../../../modules/bank-account"
import { z } from "zod"

const createBankAccountSchema = z.object({
    name: z.string().min(1),
    account_holder: z.string().min(1),
    account_number: z.string().min(1),
    bank_code: z.string().min(1),
    swift_code: z.string().optional().nullable(),
    qr_code_url: z.string().url().optional().nullable(),
    is_active: z.boolean().optional().default(true),
    display_order: z.number().optional().default(0),
})

type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>

export const POST = async (
    req: MedusaRequest<CreateBankAccountInput>,
    res: MedusaResponse
) => {
    try {
        const bankAccountService = req.scope.resolve(BANK_ACCOUNT_MODULE)
        const validatedData = createBankAccountSchema.parse(req.body)

        // Clean up empty string qr_code_url
        const cleanedData = {
            ...validatedData,
            qr_code_url: validatedData.qr_code_url === "" ? null : validatedData.qr_code_url,
            swift_code: validatedData.swift_code === "" ? null : validatedData.swift_code,
        }

        const bankAccount = await bankAccountService.createBankAccounts(cleanedData)

        res.status(201).json({ bank_account: bankAccount })
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
            return
        }
        res.status(400).json({
            message: error.message || "Failed to create bank account",
        })
    }
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const query = req.scope.resolve("query")
        const { is_active, offset, limit, order } = req.query as {
            is_active?: string
            offset?: string
            limit?: string
            order?: string
        }

        // Build filters
        const filters: any = {}
        if (is_active !== undefined) {
            filters.is_active = is_active === "true"
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
            // Default order by display_order, then created_at
            pagination.order = {
                display_order: "ASC",
                created_at: "DESC",
            }
        }

        const {
            data: bankAccounts,
            metadata: { count, take, skip } = {},
        } = await query.graph({
            entity: "bank_account",
            fields: [
                "id",
                "name",
                "account_holder",
                "account_number",
                "bank_code",
                "swift_code",
                "qr_code_url",
                "is_active",
                "display_order",
                "created_at",
                "updated_at",
            ],
            filters,
            pagination,
        })

        res.status(200).json({
            bank_accounts: bankAccounts,
            count,
            limit: take,
            offset: skip,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch bank accounts",
        })
    }
}

