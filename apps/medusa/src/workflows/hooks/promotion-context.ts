import { computeGiftEligibleValue, GiftCartItem, isGiftLine } from './gift-promotion';

/**
 * Extra attributes exposed to promotion rules, on top of the cart fields Medusa already provides.
 * Gift lines never count, so a free gift cannot help a cart qualify for another promotion.
 */
export const buildPromotionContext = (cart: { items?: GiftCartItem[] | null }, giftProductIds: string[] = []) => ({
  // Total units in the cart, for rules like "buy 3 or more" (attribute: total_item_quantity)
  total_item_quantity: (cart.items ?? [])
    .filter((item) => !isGiftLine(item))
    .reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0),
  // Value before discounts, excluding gifts, for the free-gift promotion (attribute: gift_eligible_value)
  gift_eligible_value: computeGiftEligibleValue(cart.items, giftProductIds),
});
