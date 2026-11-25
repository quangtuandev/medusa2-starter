/** Extra attributes exposed to promotion rules, on top of the cart fields Medusa already provides. */
export const buildPromotionContext = (cart: { items?: ({ quantity?: unknown } | null | undefined)[] | null }) => ({
  // Total units in the cart, for rules like "buy 3 or more" (attribute: total_item_quantity)
  total_item_quantity: (cart.items ?? []).reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0),
});
