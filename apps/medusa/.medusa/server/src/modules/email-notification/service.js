"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const nodemailer = __importStar(require("nodemailer"));
class NodemailerNotificationService extends utils_1.AbstractNotificationProviderService {
    static identifier = "nodemailer";
    transporter;
    from;
    constructor(container, options) {
        super();
        const port = Number(options.port) || 587;
        this.from = options.from || options.auth_user;
        this.transporter = nodemailer.createTransport({
            host: options.host,
            port,
            secure: port === 465,
            auth: {
                user: options.auth_user,
                pass: options.auth_pass,
            },
        });
    }
    async send(notification) {
        const { to, template, data } = notification;
        // data should contain subject, html for our custom usage
        const subject = data?.subject || template || "Notification";
        let html = data?.html || "";
        // Replace template variables in html
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === "string" || typeof value === "number") {
                    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
                }
            }
        }
        const info = await this.transporter.sendMail({
            from: this.from,
            to,
            subject,
            html: html || `<p>${subject}</p>`,
        });
        return { id: info.messageId };
    }
}
exports.default = NodemailerNotificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2VtYWlsLW5vdGlmaWNhdGlvbi9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscURBRWtDO0FBS2xDLHVEQUF3QztBQVd4QyxNQUFNLDZCQUE4QixTQUFRLDJDQUFtQztJQUMzRSxNQUFNLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQTtJQUN0QixXQUFXLENBQXdCO0lBQ25DLElBQUksQ0FBUTtJQUV0QixZQUFZLFNBQWMsRUFBRSxPQUEwQjtRQUNsRCxLQUFLLEVBQUUsQ0FBQTtRQUVQLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFBO1FBRTdDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztZQUMxQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSTtZQUNKLE1BQU0sRUFBRSxJQUFJLEtBQUssR0FBRztZQUNwQixJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTO2dCQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLFNBQVM7YUFDMUI7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FDTixZQUF5QztRQUV6QyxNQUFNLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxZQUFZLENBQUE7UUFFM0MseURBQXlEO1FBQ3pELE1BQU0sT0FBTyxHQUFJLElBQUksRUFBRSxPQUFrQixJQUFJLFFBQVEsSUFBSSxjQUFjLENBQUE7UUFDdkUsSUFBSSxJQUFJLEdBQUksSUFBSSxFQUFFLElBQWUsSUFBSSxFQUFFLENBQUE7UUFFdkMscUNBQXFDO1FBQ3JDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDekQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2YsSUFBSSxNQUFNLENBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUNoQixDQUFBO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDekMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsRUFBRTtZQUNGLE9BQU87WUFDUCxJQUFJLEVBQUUsSUFBSSxJQUFJLE1BQU0sT0FBTyxNQUFNO1NBQ3BDLENBQUMsQ0FBQTtRQUVGLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBQ2pDLENBQUM7O0FBR0wsa0JBQWUsNkJBQTZCLENBQUEifQ==