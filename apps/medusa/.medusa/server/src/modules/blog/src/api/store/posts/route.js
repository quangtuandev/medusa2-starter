"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const __1 = require("../../../");
async function GET(req, res) {
    const blogModuleService = req.scope.resolve(__1.BLOG_MODULE);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ibG9nL3NyYy9hcGkvc3RvcmUvcG9zdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkFtQkM7QUFyQkQsaUNBQXdDO0FBRWpDLEtBQUssVUFBVSxHQUFHLENBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CO0lBRW5CLE1BQU0saUJBQWlCLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBVyxDQUFDLENBQUM7SUFFOUQsTUFBTSxPQUFPLEdBQUc7UUFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQixJQUFJLFdBQVc7UUFDakQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBcUI7UUFDNUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBZ0I7S0FDbkMsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsSUFBSSxFQUFFO1FBQ2hELE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQixDQUFDLElBQUksQ0FBQztLQUNsRCxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3JFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsQ0FBQyJ9