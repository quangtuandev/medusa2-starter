"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const order_1 = __importDefault(require("@medusajs/medusa/order"));
const product_review_1 = __importDefault(require("../modules/product-review"));
exports.default = (0, utils_1.defineLink)(product_review_1.default.linkable.productReview, order_1.default.linkable.orderLineItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXctb3JkZXItbGluZS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpbmtzL3Byb2R1Y3QtcmV2aWV3LW9yZGVyLWxpbmUtaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUF1RDtBQUN2RCxtRUFBaUQ7QUFDakQsK0VBQTREO0FBRTVELGtCQUFlLElBQUEsa0JBQVUsRUFBQyx3QkFBbUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLGVBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMifQ==