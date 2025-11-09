import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { BANK_ACCOUNT_MODULE } from "../../../modules/bank-account"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bankAccountService = req.scope.resolve(BANK_ACCOUNT_MODULE)
    const query = req.scope.resolve("query")

    // Only return active bank accounts for storefront
    const {
        data: bankAccounts,
        metadata: { count, take, skip } = {},
    } = await query.graph({
        entity: "bank_account",
        fields: ["id", "name", "account_holder", "account_number", "bank_code", "swift_code", "qr_code_url", "display_order"],
        filters: {
            is_active: true,
            deleted_at: null,
        },
        order: { display_order: "ASC" },
        ...req.queryConfig,
    })

    res.json({
        bank_accounts: bankAccounts,
        count,
        limit: take,
        offset: skip,
    })
}

