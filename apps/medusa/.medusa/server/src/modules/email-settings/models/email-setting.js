"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSetting = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.EmailSetting = utils_1.model.define("email_setting", {
    id: utils_1.model.id().primaryKey(),
    type: utils_1.model.text(), // "customer_order_confirmation" | "internal_order_notification"
    is_enabled: utils_1.model.boolean().default(false),
    subject: utils_1.model.text().default(""),
    body_html: utils_1.model.text().default(""),
    recipients: utils_1.model.text().nullable(), // comma-separated emails for internal notifications
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtc2V0dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2VtYWlsLXNldHRpbmdzL21vZGVscy9lbWFpbC1zZXR0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFpRDtBQUVwQyxRQUFBLFlBQVksR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtJQUN0RCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxFQUFFLGdFQUFnRTtJQUNwRixVQUFVLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDMUMsT0FBTyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQ2pDLFNBQVMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLG9EQUFvRDtDQUM1RixDQUFDLENBQUEifQ==