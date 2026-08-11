"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProductContentInput = normalizeProductContentInput;
function normalizeProductContentInput(input) {
    const productId = input.product_id?.trim();
    if (!productId) {
        throw new Error("product_id is required");
    }
    return {
        product_id: productId,
        notes: input.notes?.trim() ?? "",
        ingredients: input.ingredients?.trim() ?? "",
        precautions_of_use: input.precautions_of_use?.trim() ?? "",
        application_tips: input.application_tips?.trim() ?? "",
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LWNvbnRlbnQvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxvRUFnQkM7QUFoQkQsU0FBZ0IsNEJBQTRCLENBQzFDLEtBQTBCO0lBRTFCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFFMUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxPQUFPO1FBQ0wsVUFBVSxFQUFFLFNBQVM7UUFDckIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUNoQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzVDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzFELGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0tBQ3ZELENBQUE7QUFDSCxDQUFDIn0=