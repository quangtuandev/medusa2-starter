"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.POST = exports.GET = void 0;
const homepage_1 = require("../../../../modules/homepage");
const upsert_homepage_1 = require("../../../../workflows/upsert-homepage");
const validators_1 = require("../validators");
const pickCurrent = async (service) => {
    const [active] = await service.listBestSellerSections({ is_active: true }, { take: 1, order: { created_at: 'DESC' } });
    if (active)
        return active;
    const [latest] = await service.listBestSellerSections({}, { take: 1, order: { created_at: 'DESC' } });
    return latest ?? null;
};
const GET = async (req, res) => {
    const service = req.scope.resolve(homepage_1.HOMEPAGE_MODULE);
    const best_seller = await pickCurrent(service);
    res.json({ best_seller });
};
exports.GET = GET;
const upsert = async (req, res) => {
    const parsed = validators_1.bestSellerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            type: 'invalid_data',
            message: 'Invalid best seller payload',
            errors: parsed.error.flatten(),
        });
    }
    const input = parsed.data;
    const headingEn = input.heading_en || input.heading;
    if (!headingEn) {
        return res.status(400).json({
            type: 'invalid_data',
            message: 'heading_en (or heading) is required',
        });
    }
    const payload = {
        id: input.id,
        is_active: input.is_active,
        heading_en: headingEn,
        heading_vi: input.heading_vi || input.heading || headingEn,
        description_en: input.description_en ?? input.description ?? null,
        description_vi: input.description_vi ?? input.description ?? null,
        items: input.items,
    };
    const { result } = await (0, upsert_homepage_1.upsertBestSellerWorkflow)(req.scope).run({
        input: payload,
    });
    res.json({ best_seller: result });
};
exports.POST = upsert;
exports.PUT = upsert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2hvbWVwYWdlL2Jlc3Qtc2VsbGVyL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJEQUErRDtBQUMvRCwyRUFBMEc7QUFDMUcsOENBQWlEO0FBRWpELE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxPQUFZLEVBQUUsRUFBRTtJQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsc0JBQXNCLENBQ25ELEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUNuQixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQzNDLENBQUM7SUFDRixJQUFJLE1BQU07UUFBRSxPQUFPLE1BQU0sQ0FBQztJQUUxQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RHLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFSyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxPQUFPLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsMEJBQWUsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRS9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FBQztBQUxXLFFBQUEsR0FBRyxPQUtkO0FBRUYsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQy9ELE1BQU0sTUFBTSxHQUFHLDZCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksRUFBRSxjQUFjO1lBQ3BCLE9BQU8sRUFBRSw2QkFBNkI7WUFDdEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzFCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUVwRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksRUFBRSxjQUFjO1lBQ3BCLE9BQU8sRUFBRSxxQ0FBcUM7U0FDL0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sT0FBTyxHQUE0QjtRQUN2QyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDWixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7UUFDMUIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxTQUFTO1FBQzFELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSTtRQUNqRSxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUk7UUFDakUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO0tBQ25CLENBQUM7SUFFRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLDBDQUF3QixFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDL0QsS0FBSyxFQUFFLE9BQU87S0FDZixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRVcsUUFBQSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsUUFBQSxHQUFHLEdBQUcsTUFBTSxDQUFDIn0=