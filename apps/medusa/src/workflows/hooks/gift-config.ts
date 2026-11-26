import { ContainerRegistrationKeys, PromotionStatus } from '@medusajs/framework/utils';
import { GiftConfig, GiftPromotionLike, parseGiftPromotion } from './gift-promotion';

type Container = { resolve: (key: string) => any };

/** Promotions change rarely, but this runs on every cart refresh. */
const CACHE_TTL_MS = 30_000;

export const GIFT_PROMOTION_FIELDS = [
  'id',
  'status',
  'is_automatic',
  'campaign.starts_at',
  'campaign.ends_at',
  'rules.attribute',
  'rules.operator',
  'rules.values.value',
  'application_method.target_rules.attribute',
  'application_method.target_rules.operator',
  'application_method.target_rules.values.value',
];
export const GIFT_PROMOTION_FILTERS = { is_automatic: true, status: PromotionStatus.ACTIVE };

let cache: { at: number; value: GiftConfig | null } | null = null;

export const resetGiftConfigCache = () => {
  cache = null;
};

/** The active automatic gift promotion, found by its `gift_eligible_value` rule; null when there is none. */
export const getGiftConfig = async (container: Container, now = Date.now()): Promise<GiftConfig | null> => {
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.value;

  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'promotion',
    fields: GIFT_PROMOTION_FIELDS,
    filters: GIFT_PROMOTION_FILTERS,
  });

  const value =
    (data as GiftPromotionLike[]).map((promotion) => parseGiftPromotion(promotion, new Date(now))).find(Boolean) ?? null;
  cache = { at: now, value };
  return value;
};

/**
 * For code that runs inside core cart workflows: a failure here must never break the cart, so errors are
 * logged and reported as `ok: false`. Callers decide whether to fail open (the checkout guard does).
 */
export const getGiftConfigState = async (container: Container): Promise<{ ok: boolean; config: GiftConfig | null }> => {
  try {
    return { ok: true, config: await getGiftConfig(container) };
  } catch (error) {
    container.resolve(ContainerRegistrationKeys.LOGGER)?.error?.(`[Gift] Could not read the gift promotion: ${error}`);
    return { ok: false, config: null };
  }
};

export const getGiftConfigSafe = async (container: Container): Promise<GiftConfig | null> =>
  (await getGiftConfigState(container)).config;
