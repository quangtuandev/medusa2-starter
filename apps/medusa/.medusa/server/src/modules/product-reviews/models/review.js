"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.Review = utils_1.model.define("review", {
    id: utils_1.model.id().primaryKey(),
    product_id: utils_1.model.text(),
    name: utils_1.model.text(),
    content: utils_1.model.text(),
    stars: utils_1.model.number(),
    status: utils_1.model.enum(["pending", "approved", "rejected"]).default("pending"),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1yZXZpZXdzL21vZGVscy9yZXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlEO0FBRXBDLFFBQUEsTUFBTSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQzNDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3hCLElBQUksRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2xCLE9BQU8sRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3JCLEtBQUssRUFBRSxhQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3JCLE1BQU0sRUFBRSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7Q0FDM0UsQ0FBQyxDQUFBIn0=