/** Free-gift configuration, read from the active gift promotion on the backend (GET /store/gift). */
export type GiftConfig = {
  productIds: string[];
  threshold: number;
  /** true when the threshold itself qualifies (`gte`), false for `gt` */
  inclusive: boolean;
  /** Lowercase currency codes the gift applies to; empty means any currency. */
  currencies: string[];
};

export const GIFT_ITEM_METADATA_KEY = 'is_gift';

type GiftLineItem = {
  product_id?: string | null;
  metadata?: Record<string, unknown> | null;
  unit_price?: number | null;
  quantity?: number | null;
  subtotal?: number | null;
  discount_total?: number | null;
};

/** The backend tags the gift line it adds with `metadata.is_gift`. */
export const isGiftItem = (item: GiftLineItem | null | undefined) => item?.metadata?.[GIFT_ITEM_METADATA_KEY] === true;

/**
 * Cart value before discounts, excluding gifts, so a gift can never unlock itself.
 * Mirrors `gift_eligible_value` in the backend (apps/medusa gift-promotion.ts).
 */
export const getGiftEligibleValue = (items: GiftLineItem[] | null | undefined, giftProductIds: string[]) =>
  (items ?? [])
    .filter((item) => !isGiftItem(item) && !giftProductIds.includes(item.product_id ?? ''))
    .reduce((sum, item) => sum + Number(item.unit_price ?? 0) * Number(item.quantity ?? 0), 0);

export const isGiftEligibleCart = (
  cart: { currency_code?: string | null; items?: GiftLineItem[] | null },
  config: GiftConfig,
) => {
  const currency = (cart.currency_code ?? '').toLowerCase();
  if (config.currencies.length && !config.currencies.includes(currency)) return false;

  const value = getGiftEligibleValue(cart.items, config.productIds);
  return config.inclusive ? value >= config.threshold : value > config.threshold;
};

/** What the gift lines contribute to the cart's subtotal and discount, so they can be left out of both. */
export const getGiftTotals = (items: GiftLineItem[] | null | undefined) =>
  (items ?? []).filter(isGiftItem).reduce<{ subtotal: number; discount: number }>(
    (totals, item) => ({
      subtotal: totals.subtotal + Number(item.subtotal ?? Number(item.unit_price ?? 0) * Number(item.quantity ?? 0)),
      discount: totals.discount + Number(item.discount_total ?? 0),
    }),
    { subtotal: 0, discount: 0 },
  );
