"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const __1 = require("../../../");
const zod_1 = require("zod");
const createPostSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    excerpt: zod_1.z.string().optional(),
    featured_image: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'published', 'archived']).optional(),
});
const updatePostSchema = createPostSchema.partial();
async function GET(req, res) {
    const blogModuleService = req.scope.resolve(__1.BLOG_MODULE);
    const filters = {
        status: req.query.status,
        category_id: req.query.category_id,
        search: req.query.search,
    };
    const pagination = {
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0,
    };
    const result = await blogModuleService.getPosts(filters, pagination);
    res.json(result);
}
async function POST(req, res) {
    const blogModuleService = req.scope.resolve(__1.BLOG_MODULE);
    const validatedData = createPostSchema.parse(req.body);
    const post = await blogModuleService.createPost(validatedData);
    res.status(201).json(post);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ibG9nL3NyYy9hcGkvYWRtaW4vcG9zdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFjQSxrQkFtQkM7QUFFRCxvQkFTQztBQTNDRCxpQ0FBd0M7QUFDeEMsNkJBQXdCO0FBRXhCLE1BQU0sZ0JBQWdCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNoQyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNqQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNuQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM5QixjQUFjLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNyQyxNQUFNLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDOUQsQ0FBQyxDQUFDO0FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUU3QyxLQUFLLFVBQVUsR0FBRyxDQUN2QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixNQUFNLGlCQUFpQixHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQVcsQ0FBQyxDQUFDO0lBRTlELE1BQU0sT0FBTyxHQUFHO1FBQ2QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBZ0I7UUFDbEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBcUI7UUFDNUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBZ0I7S0FDbkMsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsSUFBSSxFQUFFO1FBQ2hELE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQixDQUFDLElBQUksQ0FBQztLQUNsRCxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3JFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVNLEtBQUssVUFBVSxJQUFJLENBQ3hCLEdBQWtCLEVBQ2xCLEdBQW1CO0lBRW5CLE1BQU0saUJBQWlCLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBVyxDQUFDLENBQUM7SUFFOUQsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMvRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixDQUFDIn0=