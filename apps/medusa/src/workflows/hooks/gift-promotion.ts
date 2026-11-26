/**
 * Free-gift promotion, configured entirely in the Admin as an automatic promotion:
 *  - rules:        `gift_eligible_value` gte|gt <threshold>, and optionally `currency_code` eq|in <currencies>
 *  - target rules: `items.product.id` in <gift product ids>
 *  - method:       100% off, once, max_quantity 1
 * The helpers below read that promotion and decide what the cart needs. They are pure so they can be unit tested.
 */
export const GIFT_RULE_ATTRIBUTE = 'gift_eligible_value';
export const GIFT_ITEM_METADATA_KEY = 'is_gift';

type RuleValue = string | { value?: string | null } | null | undefined;
type Rule = { attribute?: string | null; operator?: string | null; values?: RuleValue[] | null } | null | undefined;

export type GiftPromotionLike = {
  id?: string | null;
  status?: string | null;
  is_automatic?: boolean | null;
  campaign?: { starts_at?: Date | string | null; ends_at?: Date | string | null } | null;
  rules?: Rule[] | null;
  application_method?: { target_rules?: Rule[] | null } | null;
};

export type GiftConfig = {
  promotionId?: string;
  threshold: number;
  /** true for `gte`, false for `gt` */
  inclusive: boolean;
  productIds: string[];
  /** Lowercase currency codes the gift applies to; empty means any currency. */
  currencies: string[];
};

export type GiftCartItem =
  | {
      id?: string | null;
      quantity?: unknown;
      unit_price?: unknown;
      product_id?: string | null;
      product?: { id?: string | null } | null;
      metadata?: Record<string, unknown> | null;
    }
  | null
  | undefined;

export type GiftCart = { currency_code?: string | null; items?: GiftCartItem[] | null };

const ruleValues = (rule: Rule) =>
  (rule?.values ?? [])
    .map((value) => (typeof value === 'string' ? value : value?.value))
    .filter((value): value is string => !!value);

const isWithinCampaign = (campaign: GiftPromotionLike['campaign'], now: Date) => {
  const startsAt = campaign?.starts_at ? new Date(campaign.starts_at) : null;
  const endsAt = campaign?.ends_at ? new Date(campaign.ends_at) : null;
  return (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);
};

/** Reads the gift configuration out of a promotion, or null when it is not an active gift promotion. */
export const parseGiftPromotion = (promotion: GiftPromotionLike | null | undefined, now = new Date()): GiftConfig | null => {
  if (!promotion || promotion.status !== 'active' || promotion.is_automatic === false) return null;
  if (!isWithinCampaign(promotion.campaign, now)) return null;

  const rules = promotion.rules ?? [];
  const thresholdRule = rules.find(
    (rule) => rule?.attribute === GIFT_RULE_ATTRIBUTE && (rule.operator === 'gte' || rule.operator === 'gt'),
  );
  const threshold = Number(ruleValues(thresholdRule)[0]);
  if (!thresholdRule || !Number.isFinite(threshold)) return null;

  const productIds = (promotion.application_method?.target_rules ?? [])
    .filter((rule) => rule?.attribute === 'items.product.id' && (rule.operator === 'in' || rule.operator === 'eq'))
    .flatMap(ruleValues);
  if (!productIds.length) return null;

  const currencies = rules
    .filter((rule) => rule?.attribute === 'currency_code' && (rule.operator === 'eq' || rule.operator === 'in'))
    .flatMap(ruleValues)
    .map((currency) => currency.toLowerCase());

  return {
    promotionId: promotion.id ?? undefined,
    threshold,
    inclusive: thresholdRule.operator === 'gte',
    productIds,
    currencies,
  };
};

export const isGiftLine = (item: GiftCartItem) => item?.metadata?.[GIFT_ITEM_METADATA_KEY] === true;

const productIdOf = (item: GiftCartItem) => item?.product_id ?? item?.product?.id ?? '';

/** Cart value before discounts, excluding gifts, so a gift can never unlock itself. */
export const computeGiftEligibleValue = (items: GiftCartItem[] | null | undefined, giftProductIds: string[]) =>
  (items ?? [])
    .filter((item) => !isGiftLine(item) && !giftProductIds.includes(productIdOf(item)))
    .reduce((sum, item) => sum + Number(item?.unit_price ?? 0) * Number(item?.quantity ?? 0), 0);

export const isGiftEligible = (cart: GiftCart, config: GiftConfig | null) => {
  if (!config) return false;

  const currency = (cart.currency_code ?? '').toLowerCase();
  if (config.currencies.length && !config.currencies.includes(currency)) return false;

  const value = computeGiftEligibleValue(cart.items, config.productIds);
  return config.inclusive ? value >= config.threshold : value > config.threshold;
};

export type GiftSyncPlan = {
  add: boolean;
  removeItemIds: string[];
  /** The gift line to reset to quantity 1 */
  resetQuantityItemId?: string;
};

/**
 * What the cart needs so that it holds exactly one gift line when eligible and none otherwise.
 * Without a gift promotion (inactive, ended or deleted) every gift line goes: nothing would discount it any more.
 */
export const decideGiftAction = (cart: GiftCart, config: GiftConfig | null): GiftSyncPlan => {
  const giftLines = (cart.items ?? []).filter(isGiftLine);
  const ids = (lines: GiftCartItem[]) => lines.map((line) => line?.id).filter((id): id is string => !!id);

  if (!config || !isGiftEligible(cart, config)) return { add: false, removeItemIds: ids(giftLines) };
  if (!giftLines.length) return { add: true, removeItemIds: [] };

  const [kept, ...extra] = giftLines;
  return {
    add: false,
    removeItemIds: ids(extra),
    resetQuantityItemId: Number(kept?.quantity) !== 1 ? (kept?.id ?? undefined) : undefined,
  };
};

/** A gift line that no longer qualifies would be sold at full price. */
export const hasIneligibleGift = (cart: GiftCart, config: GiftConfig | null) =>
  (cart.items ?? []).some(isGiftLine) && !isGiftEligible(cart, config);
