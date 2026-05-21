"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const create_page_1 = require("../../../workflows/create-page");
const POST = async (req, res) => {
    const { result } = await (0, create_page_1.createPageWorkflow)(req.scope)
        .run({
        input: req.validatedBody,
    });
    res.json({ page: result });
};
exports.POST = POST;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data: pages, metadata: { count, take, skip } = {}, } = await query.graph({
        entity: "page",
        ...req.queryConfig,
        fields: ['id', 'title', 'slug', 'content', 'language', 'meta_title', 'meta_description', 'published', 'created_at', 'updated_at'],
    });
    res.json({
        pages,
        count,
        limit: take,
        offset: skip,
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3BhZ2VzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGdFQUV1QztBQU1oQyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3JCLEdBQTJDLEVBQzNDLEdBQW1CLEVBQ3JCLEVBQUU7SUFDQSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGdDQUFrQixFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7U0FDakQsR0FBRyxDQUFDO1FBQ0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxhQUFhO0tBQzNCLENBQUMsQ0FBQTtJQUVOLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFWWSxRQUFBLElBQUksUUFVaEI7QUFFTSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3BCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ3JCLEVBQUU7SUFDQSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUV4QyxNQUFNLEVBQ0YsSUFBSSxFQUFFLEtBQUssRUFDWCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FDdkMsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbEIsTUFBTSxFQUFFLE1BQU07UUFDZCxHQUFHLEdBQUcsQ0FBQyxXQUFXO1FBQ2xCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO0tBQ3BJLENBQUMsQ0FBQTtJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLElBQUk7S0FDZixDQUFDLENBQUE7QUFDTixDQUFDLENBQUE7QUFyQlksUUFBQSxHQUFHLE9BcUJmIn0=