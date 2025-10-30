"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data: posts } = await query.graph({
        entity: "post",
        fields: ["id", "title", "description", "slug", "sub_title", "content", "thumbnail", "created_at", "updated_at"],
        filters: {
            published: true,
        },
        pagination: {
            order: {
                created_at: "DESC",
            }
        },
    });
    res.json(posts);
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2Jsb2cvcG9zdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxNQUFNO1FBQ2QsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7UUFDL0csT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFLElBQUk7U0FDaEI7UUFDRCxVQUFVLEVBQUU7WUFDVixLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFLE1BQU07YUFDbkI7U0FDRjtLQUNGLENBQUMsQ0FBQTtJQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFBO0FBZlksUUFBQSxHQUFHLE9BZWYifQ==