"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.Store = utils_1.model.define("store", {
    id: utils_1.model.id().primaryKey(),
    country: utils_1.model.text(),
    title: utils_1.model.text(),
    address_lines: utils_1.model.text(),
    phone: utils_1.model.text().nullable(),
    email: utils_1.model.text().nullable(),
    is_active: utils_1.model.boolean().default(true),
    display_order: utils_1.model.number().default(0),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zdG9yZXMvbW9kZWxzL3N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFpRDtBQUVwQyxRQUFBLEtBQUssR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtJQUN2QyxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixPQUFPLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNyQixLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNuQixhQUFhLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUMzQixLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM5QixLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM5QixTQUFTLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDeEMsYUFBYSxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQzNDLENBQUMsQ0FBQSJ9