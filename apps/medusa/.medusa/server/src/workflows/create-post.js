"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostWorkflow = exports.createPostStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const blog_1 = require("../modules/blog");
exports.createPostStep = (0, workflows_sdk_1.createStep)("create-post-step", async (input, { container }) => {
    const blogModuleService = container.resolve(blog_1.BLOG_MODULE);
    const post = await blogModuleService.createPosts(input);
    return new workflows_sdk_1.StepResponse(post, post.id);
});
exports.createPostWorkflow = (0, workflows_sdk_1.createWorkflow)("create-post", (input) => {
    const post = (0, exports.createPostStep)(input);
    return new workflows_sdk_1.WorkflowResponse(post);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2NyZWF0ZS1wb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFFQUswQztBQUMxQywwQ0FBNkM7QUFXaEMsUUFBQSxjQUFjLEdBQUcsSUFBQSwwQkFBVSxFQUNwQyxrQkFBa0IsRUFDbEIsS0FBSyxFQUFFLEtBQTBCLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELE1BQU0saUJBQWlCLEdBQXNCLFNBQVMsQ0FBQyxPQUFPLENBQzFELGtCQUFXLENBQ2QsQ0FBQTtJQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0saUJBQWlCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXZELE9BQU8sSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUMsQ0FBQyxDQUNKLENBQUE7QUFVWSxRQUFBLGtCQUFrQixHQUFHLElBQUEsOEJBQWMsRUFDNUMsYUFBYSxFQUNiLENBQUMsS0FBOEIsRUFBRSxFQUFFO0lBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUEsc0JBQWMsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUVsQyxPQUFPLElBQUksZ0NBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckMsQ0FBQyxDQUNKLENBQUEifQ==