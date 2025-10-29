"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const create_post_1 = require("../../../../workflows/create-post");
const POST = async (req, res) => {
    const { result } = await (0, create_post_1.createPostWorkflow)(req.scope)
        .run({
        input: req.validatedBody,
    });
    res.json({ post: result });
};
exports.POST = POST;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data: posts, metadata: { count, take, skip } = {}, } = await query.graph({
        entity: "post",
        ...req.queryConfig,
    });
    res.json({
        posts,
        count,
        limit: take,
        offset: skip,
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2Jsb2cvcG9zdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsbUVBRTBDO0FBS25DLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBMkMsRUFDM0MsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsZ0NBQWtCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztTQUNuRCxHQUFHLENBQUM7UUFDSCxLQUFLLEVBQUUsR0FBRyxDQUFDLGFBQWE7S0FDekIsQ0FBQyxDQUFBO0lBRUosR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQzVCLENBQUMsQ0FBQTtBQVZZLFFBQUEsSUFBSSxRQVVoQjtBQUNNLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhDLE1BQU0sRUFDSixJQUFJLEVBQUUsS0FBSyxFQUNYLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUNyQyxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNwQixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsR0FBRyxDQUFDLFdBQVc7S0FDbkIsQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNQLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQXBCWSxRQUFBLEdBQUcsT0FvQmYifQ==