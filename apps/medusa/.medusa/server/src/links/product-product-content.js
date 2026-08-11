"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const product_1 = __importDefault(require("@medusajs/medusa/product"));
const product_content_1 = __importDefault(require("../modules/product-content"));
exports.default = (0, utils_1.defineLink)({
    linkable: product_content_1.default.linkable.productContent,
    field: "product_id",
}, product_1.default.linkable.product, {
    readOnly: true,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1wcm9kdWN0LWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlua3MvcHJvZHVjdC1wcm9kdWN0LWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBc0Q7QUFDdEQsdUVBQW9EO0FBQ3BELGlGQUE2RDtBQUU3RCxrQkFBZSxJQUFBLGtCQUFVLEVBQ3ZCO0lBQ0UsUUFBUSxFQUFFLHlCQUFvQixDQUFDLFFBQVEsQ0FBQyxjQUFjO0lBQ3RELEtBQUssRUFBRSxZQUFZO0NBQ3BCLEVBQ0QsaUJBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUM5QjtJQUNFLFFBQVEsRUFBRSxJQUFJO0NBQ2YsQ0FDRixDQUFBIn0=