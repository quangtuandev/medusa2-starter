"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPageWorkflow = exports.createPageStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const page_1 = require("../modules/page");
exports.createPageStep = (0, workflows_sdk_1.createStep)("create-page-step", async (input, { container }) => {
    const pageModuleService = container.resolve(page_1.PAGE_MODULE);
    const page = await pageModuleService.createPages(input);
    return new workflows_sdk_1.StepResponse(page, page.id);
});
exports.createPageWorkflow = (0, workflows_sdk_1.createWorkflow)("create-page", (input) => {
    const page = (0, exports.createPageStep)(input);
    return new workflows_sdk_1.WorkflowResponse(page);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2NyZWF0ZS1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFFQUswQztBQUMxQywwQ0FBNkM7QUFhaEMsUUFBQSxjQUFjLEdBQUcsSUFBQSwwQkFBVSxFQUNwQyxrQkFBa0IsRUFDbEIsS0FBSyxFQUFFLEtBQTBCLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELE1BQU0saUJBQWlCLEdBQXNCLFNBQVMsQ0FBQyxPQUFPLENBQzFELGtCQUFXLENBQ2QsQ0FBQTtJQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0saUJBQWlCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXZELE9BQU8sSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUMsQ0FBQyxDQUNKLENBQUE7QUFZWSxRQUFBLGtCQUFrQixHQUFHLElBQUEsOEJBQWMsRUFDNUMsYUFBYSxFQUNiLENBQUMsS0FBOEIsRUFBRSxFQUFFO0lBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUEsc0JBQWMsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUVsQyxPQUFPLElBQUksZ0NBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckMsQ0FBQyxDQUNKLENBQUEifQ==