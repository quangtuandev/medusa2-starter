"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const bank_account_1 = require("../../../modules/bank-account");
const GET = async (req, res) => {
    const bankAccountService = req.scope.resolve(bank_account_1.BANK_ACCOUNT_MODULE);
    const query = req.scope.resolve("query");
    // Only return active bank accounts for storefront
    const { data: bankAccounts, metadata: { count, take, skip } = {}, } = await query.graph({
        entity: "bank_account",
        fields: ["id", "name", "account_holder", "account_number", "bank_code", "swift_code", "qr_code_url", "display_order"],
        filters: {
            is_active: true,
            deleted_at: null,
        },
        pagination: {
            order: { display_order: "ASC" },
            take: 10,
            skip: 0,
            ...req.queryConfig,
        },
    });
    res.json({
        bank_accounts: bankAccounts,
        count,
        limit: take,
        offset: skip,
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2JhbmstYWNjb3VudHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsZ0VBQW1FO0FBRTVELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDcEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDckIsRUFBRTtJQUNBLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0NBQW1CLENBQUMsQ0FBQTtJQUNqRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUV4QyxrREFBa0Q7SUFDbEQsTUFBTSxFQUNGLElBQUksRUFBRSxZQUFZLEVBQ2xCLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUN2QyxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNsQixNQUFNLEVBQUUsY0FBYztRQUN0QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQztRQUNySCxPQUFPLEVBQUU7WUFDTCxTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxJQUFJO1NBQ25CO1FBQ0QsVUFBVSxFQUFFO1lBQ1IsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRTtZQUMvQixJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDO1lBQ1AsR0FBRyxHQUFHLENBQUMsV0FBVztTQUNyQjtLQUNKLENBQUMsQ0FBQTtJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDTCxhQUFhLEVBQUUsWUFBWTtRQUMzQixLQUFLO1FBQ0wsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsSUFBSTtLQUNmLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQTtBQWhDWSxRQUFBLEdBQUcsT0FnQ2YifQ==