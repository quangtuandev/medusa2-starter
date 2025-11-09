import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { BANK_ACCOUNT_MODULE } from '../../../../modules/bank-account'
import { z } from 'zod'

const updateBankAccountSchema = z.object({
    name: z.string().min(1).optional(),
    account_holder: z.string().min(1).optional(),
    account_number: z.string().min(1).optional(),
    bank_code: z.string().min(1).optional(),
    swift_code: z.string().optional().nullable(),
    qr_code_url: z.string().url().optional().nullable(),
    is_active: z.boolean().optional(),
    display_order: z.number().optional(),
})

type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        const bankAccountService: any = req.scope.resolve(BANK_ACCOUNT_MODULE)
        const { id } = req.params
        const bankAccount = await bankAccountService.retrieveBankAccount(id)
        res.json({ bank_account: bankAccount })
    } catch (error: any) {
        res.status(404).json({ message: error.message || 'Bank account not found' })
    }
}

export async function PUT(
    req: MedusaRequest<UpdateBankAccountInput>,
    res: MedusaResponse
): Promise<void> {
    const bankAccountService: any = req.scope.resolve(BANK_ACCOUNT_MODULE)
    const { id } = req.params

    try {
        const validatedData = updateBankAccountSchema.parse(req.body)
        const bankAccount = await bankAccountService.updateBankAccounts([{ id, ...validatedData }])
        res.json({ bank_account: bankAccount[0] })
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
            return
        }
        res.status(400).json({
            message: error.message || "Failed to update bank account",
        })
    }
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const bankAccountService: any = req.scope.resolve(BANK_ACCOUNT_MODULE)
    const { id } = req.params

    try {
        await bankAccountService.deleteBankAccounts(id)
        res.status(204).send()
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to delete bank account",
        })
    }
}

