"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.Post = utils_1.model.define("post", {
    id: utils_1.model.id().primaryKey(),
    title: utils_1.model.text(),
    content: utils_1.model.text(),
    slug: utils_1.model.text(),
    thumbnail: utils_1.model.text().nullable(),
    published: utils_1.model.boolean().default(false),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvbW9kZWxzL3Bvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlEO0FBRXBDLFFBQUEsSUFBSSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0lBQ3ZDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ25CLE9BQU8sRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3JCLElBQUksRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2xCLFNBQVMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ2xDLFNBQVMsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztDQUMxQyxDQUFDLENBQUEifQ==