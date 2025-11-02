"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const order_1 = __importDefault(require("@medusajs/medusa/order"));
const product_review_1 = __importDefault(require("../modules/product-review"));
exports.default = (0, utils_1.defineLink)(product_review_1.default.linkable.productReview, order_1.default.linkable.orderItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctb3JkZXItaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saW5rcy9wcm9kdWN0LXJldmlldy1vcmRlci1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBQXVEO0FBQ3ZELG1FQUFpRDtBQUNqRCwrRUFBNEQ7QUFFNUQsa0JBQWUsSUFBQSxrQkFBVSxFQUFDLHdCQUFtQixDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsZUFBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyJ9