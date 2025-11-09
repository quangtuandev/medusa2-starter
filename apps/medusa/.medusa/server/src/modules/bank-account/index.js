"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANK_ACCOUNT_MODULE = void 0;
const service_1 = __importDefault(require("./service"));
const utils_1 = require("@medusajs/framework/utils");
exports.BANK_ACCOUNT_MODULE = "bankAccount";
exports.default = (0, utils_1.Module)(exports.BANK_ACCOUNT_MODULE, {
    service: service_1.default,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9iYW5rLWFjY291bnQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQTBDO0FBQzFDLHFEQUFrRDtBQUVyQyxRQUFBLG1CQUFtQixHQUFHLGFBQWEsQ0FBQTtBQUVoRCxrQkFBZSxJQUFBLGNBQU0sRUFBQywyQkFBbUIsRUFBRTtJQUN2QyxPQUFPLEVBQUUsaUJBQWtCO0NBQzlCLENBQUMsQ0FBQSJ9