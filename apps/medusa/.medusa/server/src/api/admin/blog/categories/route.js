"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const BLOG_MODULE = 'blogModuleService';
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    featured_image: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional(),
});
const updateCategorySchema = createCategorySchema.partial();
async function GET(req, res) {
    const blogModuleService = req.scope.resolve(BLOG_MODULE);
    const filters = {
        is_active: req.query.is_active === 'true',
    };
    const pagination = {
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0,
    };
    const result = await blogModuleService.getCategories(filters, pagination);
    res.json(result);
}
async function POST(req, res) {
    const blogModuleService = req.scope.resolve(BLOG_MODULE);
    const validatedData = createCategorySchema.parse(req.body);
    const category = await blogModuleService.createCategory(validatedData);
    res.status(201).json(category);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2Jsb2cvY2F0ZWdvcmllcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWNBLGtCQWlCQztBQUVELG9CQVNDO0FBekNELE1BQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDO0FBQ3hDLDZCQUF3QjtBQUV4QixNQUFNLG9CQUFvQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDaEIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDaEIsV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDbEMsY0FBYyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDckMsU0FBUyxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDbEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUVyRCxLQUFLLFVBQVUsR0FBRyxDQUN2QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixNQUFNLGlCQUFpQixHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTlELE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU07S0FDMUMsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsSUFBSSxFQUFFO1FBQ2hELE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQixDQUFDLElBQUksQ0FBQztLQUNsRCxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVNLEtBQUssVUFBVSxJQUFJLENBQ3hCLEdBQWtCLEVBQ2xCLEdBQW1CO0lBRW5CLE1BQU0saUJBQWlCLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFOUQsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxDQUFDIn0=