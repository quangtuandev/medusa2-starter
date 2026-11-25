"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const promotion_context_1 = require("./promotion-context");
// The returned object is merged into the cart context before promotion rules are evaluated,
// so promotions can use these attributes in `rules` (created via the Admin API).
core_flows_1.updateCartPromotionsWorkflow.hooks.setPromotionContext(async ({ cart }) => {
    return new workflows_sdk_1.StepResponse((0, promotion_context_1.buildPromotionContext)(cart));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0LXByb21vdGlvbi1jb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9zZXQtcHJvbW90aW9uLWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFBaUU7QUFDakUsNERBQTJFO0FBQzNFLDJEQUE0RDtBQUU1RCw0RkFBNEY7QUFDNUYsaUZBQWlGO0FBQ2pGLHlDQUE0QixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO0lBQ3hFLE9BQU8sSUFBSSw0QkFBWSxDQUFDLElBQUEseUNBQXFCLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDLENBQUMsQ0FBQyJ9