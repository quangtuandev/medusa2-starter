"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const bank_account_1 = require("../../../modules/bank-account");
const zod_1 = require("zod");
const createBankAccountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    account_holder: zod_1.z.string().min(1),
    account_number: zod_1.z.string().min(1),
    bank_code: zod_1.z.string().min(1),
    swift_code: zod_1.z.string().optional().nullable(),
    qr_code_url: zod_1.z.string().url().optional().nullable(),
    is_active: zod_1.z.boolean().optional().default(true),
    display_order: zod_1.z.number().optional().default(0),
});
const POST = async (req, res) => {
    try {
        const bankAccountService = req.scope.resolve(bank_account_1.BANK_ACCOUNT_MODULE);
        const validatedData = createBankAccountSchema.parse(req.body);
        // Clean up empty string qr_code_url
        const cleanedData = {
            ...validatedData,
            qr_code_url: validatedData.qr_code_url === "" ? null : validatedData.qr_code_url,
            swift_code: validatedData.swift_code === "" ? null : validatedData.swift_code,
        };
        const bankAccount = await bankAccountService.createBankAccounts(cleanedData);
        res.status(201).json({ bank_account: bankAccount });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            message: error.message || "Failed to create bank account",
        });
    }
};
exports.POST = POST;
const GET = async (req, res) => {
    try {
        const query = req.scope.resolve("query");
        const { is_active, offset, limit, order } = req.query;
        // Build filters
        const filters = {};
        if (is_active !== undefined) {
            filters.is_active = is_active === "true";
        }
        // Build pagination
        const pagination = {
            skip: offset ? parseInt(offset) : 0,
            take: limit ? parseInt(limit) : 20,
        };
        // Build order
        if (order) {
            pagination.order = {};
            const orderParts = order.split(",");
            for (const part of orderParts) {
                const [field, direction] = part.trim().split(":");
                pagination.order[field] = direction?.toUpperCase() || "ASC";
            }
        }
        else {
            // Default order by display_order, then created_at
            pagination.order = {
                display_order: "ASC",
                created_at: "DESC",
            };
        }
        const { data: bankAccounts, metadata: { count, take, skip } = {}, } = await query.graph({
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
        });
        res.status(200).json({
            bank_accounts: bankAccounts,
            count,
            limit: take,
            offset: skip,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch bank accounts",
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2JhbmstYWNjb3VudHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsZ0VBQW1FO0FBQ25FLDZCQUF1QjtBQUV2QixNQUFNLHVCQUF1QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDckMsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLGNBQWMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqQyxjQUFjLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakMsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVCLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzVDLFdBQVcsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ25ELFNBQVMsRUFBRSxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMvQyxhQUFhLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Q0FDbEQsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUNyQixHQUEwQyxFQUMxQyxHQUFtQixFQUNyQixFQUFFO0lBQ0EsSUFBSSxDQUFDO1FBQ0QsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQ0FB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