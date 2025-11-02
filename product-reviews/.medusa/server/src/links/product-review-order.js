"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const order_1 = __importDefault(require("@medusajs/medusa/order"));
const product_review_1 = __importDefault(require("../modules/product-review"));
exports.default = (0, utils_1.defineLink)(product_review_1.default.linkable.productReview, order_1.default.linkable.order);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlua3MvcHJvZHVjdC1yZXZpZXctb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBdUQ7QUFDdkQsbUVBQWlEO0FBQ2pELCtFQUE0RDtBQUU1RCxrQkFBZSxJQUFBLGtCQUFVLEVBQUMsd0JBQW1CLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxlQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=