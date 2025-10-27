"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const BLOG_MODULE = 'blogModuleService';
async function GET(req, res) {
    const blogModuleService = req.scope.resolve(BLOG_MODULE);
    const filters = {
        status: req.query.status || 'published',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2Jsb2cvcG9zdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkFtQkM7QUFyQkQsTUFBTSxXQUFXLEdBQUcsbUJBQW1CLENBQUM7QUFFakMsS0FBSyxVQUFVLEdBQUcsQ0FDdkIsR0FBa0IsRUFDbEIsR0FBbUI7SUFFbkIsTUFBTSxpQkFBaUIsR0FBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUU5RCxNQUFNLE9BQU8sR0FBRztRQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWdCLElBQUksV0FBVztRQUNqRCxXQUFXLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFxQjtRQUM1QyxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQjtLQUNuQyxDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQUc7UUFDakIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQWUsQ0FBQyxJQUFJLEVBQUU7UUFDaEQsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWdCLENBQUMsSUFBSSxDQUFDO0tBQ2xELENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQixDQUFDIn0=