"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPromotionContext = void 0;
/** Extra attributes exposed to promotion rules, on top of the cart fields Medusa already provides. */
const buildPromotionContext = (cart) => ({
    // Total units in the cart, for rules like "buy 3 or more" (attribute: total_item_quantity)
    total_item_quantity: (cart.items ?? []).reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0),
});
exports.buildPromotionContext = buildPromotionContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90aW9uLWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2hvb2tzL3Byb21vdGlvbi1jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNHQUFzRztBQUMvRixNQUFNLHFCQUFxQixHQUFHLENBQUMsSUFBc0UsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoSCwyRkFBMkY7SUFDM0YsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDcEcsQ0FBQyxDQUFDO0FBSFUsUUFBQSxxQkFBcUIseUJBRy9CIn0=