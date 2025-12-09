"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYPAL_MODULE = void 0;
const utils_1 = require("@medusajs/framework/utils");
const service_1 = __importDefault(require("./service"));
exports.PAYPAL_MODULE = "paypal";
exports.default = (0, utils_1.ModuleProvider)(utils_1.Modules.PAYMENT, {
    services: [service_1.default],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheXBhbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBb0U7QUFDcEUsd0RBQTRDO0FBRS9CLFFBQUEsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUV0QyxrQkFBZSxJQUFBLHNCQUFjLEVBQUMsZUFBTyxDQUFDLE9BQU8sRUFBRTtJQUM3QyxRQUFRLEVBQUUsQ0FBQyxpQkFBbUIsQ0FBQztDQUNoQyxDQUFDLENBQUMifQ==