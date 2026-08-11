"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderCard = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.SliderCard = utils_1.model.define("slider_card", {
    id: utils_1.model.id().primaryKey(),
    title_en: utils_1.model.text(),
    title_vi: utils_1.model.text(),
    subtitle_en: utils_1.model.text().nullable(),
    subtitle_vi: utils_1.model.text().nullable(),
    image: utils_1.model.text(),
    image_active: utils_1.model.text().nullable(),
    icon: utils_1.model.text().nullable(),
    linkto: utils_1.model.text(),
    rank: utils_1.model.number().default(0),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3Qtc2xpZGVyL21vZGVscy9jYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFpRDtBQUVwQyxRQUFBLFVBQVUsR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtJQUNwRCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixRQUFRLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN0QixRQUFRLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN0QixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNuQixZQUFZLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNyQyxJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM3QixNQUFNLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNwQixJQUFJLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Q0FDaEMsQ0FBQyxDQUFBIn0=