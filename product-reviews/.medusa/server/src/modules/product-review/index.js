"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_REVIEW_MODULE = void 0;
const utils_1 = require("@medusajs/framework/utils");
const service_1 = __importDefault(require("./service"));
const validate_1 = __importDefault(require("./loaders/validate"));
exports.PRODUCT_REVIEW_MODULE = 'product_review';
exports.default = (0, utils_1.Module)(exports.PRODUCT_REVIEW_MODULE, {
    service: service_1.default,
    loaders: [validate_1.default],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBbUQ7QUFDbkQsd0RBQWdDO0FBQ2hDLGtFQUFnRDtBQUNuQyxRQUFBLHFCQUFxQixHQUFHLGdCQUFnQixDQUFDO0FBRXRELGtCQUFlLElBQUEsY0FBTSxFQUFDLDZCQUFxQixFQUFFO0lBQzNDLE9BQU8sRUFBRSxpQkFBTztJQUNoQixPQUFPLEVBQUUsQ0FBQyxrQkFBYyxDQUFDO0NBQzFCLENBQUMsQ0FBQyJ9