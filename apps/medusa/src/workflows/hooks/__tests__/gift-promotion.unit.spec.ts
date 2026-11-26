import {
  GiftConfig,
  computeGiftEligibleValue,
  decideGiftAction,
  hasIneligibleGift,
  isGiftEligible,
  parseGiftPromotion,
} from '../gift-promotion';

const promotion = {
  id: 'promo_gift',
  status: 'active',
  is_automatic: true,
  campaign: null,
  rules: [
    { attribute: 'gift_eligible_value', operator: 'gte', values: [{ value: '3500000' }] },
    { attribute: 'currency_code', operator: 'eq', values: [{ value: 'vnd' }] },
  ],
  application_method: {
    target_rules: [{ attribute: 'items.product.id', operator: 'in', values: [{ value: 'prod_gift' }] }],
  },
};

const config: GiftConfig = { threshold: 3_500_000, inclusive: true, productIds: ['prod_gift'], currencies: ['vnd'] };

const item = (id: string, productId: string, unitPrice: number, quantity = 1, isGift = false) => ({
  id,
  product_id: productId,
  unit_price: unitPrice,
  quantity,
  metadata: isGift ? { is_gift: true } : null,
});

describe('parseGiftPromotion', () => {
  it('reads threshold, gift products and currency from the promotion', () => {
    expect(parseGiftPromotion(promotion)).toEqual({
      promotionId: 'promo_gift',
      threshold: 3_500_000,
      inclusive: true,
      productIds: ['prod_gift'],
      currencies: ['vnd'],
    });
  });

  it('accepts plain string rule values and the gt operator', () => {
    const parsed = parseGiftPromotion({
      ...promotion,
      rules: [{ attribute: 'gift_eligible_value', operator: 'gt', values: ['1000'] }],
      application_method: { target_rules: [{ attribute: 'items.product.id', operator: 'eq', values: ['prod_a'] }] },
    });
    expect(parsed).toMatchObject({ threshold: 1000, inclusive: false, productIds: ['prod_a'], currencies: [] });
  });

  it('ignores promotions that are not an active automatic gift promotion', () => {
    expect(parseGiftPromotion(null)).toBeNull();
    expect(parseGiftPromotion({ ...promotion, status: 'draft' })).toBeNull();
    expect(parseGiftPromotion({ ...promotion, is_automatic: false })).toBeNull();
    expect(parseGiftPromotion({ ...promotion, rules: [] })).toBeNull();
    expect(parseGiftPromotion({ ...promotion, application_method: { target_rules: [] } })).toBeNull();
    expect(
      parseGiftPromotion({
        ...promotion,
        rules: [{ attribute: 'gift_eligible_value', operator: 'gte', values: [{ value: 'abc' }] }],
      }),
    ).toBeNull();
  });

  it('respects the campaign window', () => {
    const now = new Date('2026-06-15');
    expect(parseGiftPromotion({ ...promotion, campaign: { starts_at: '2026-07-01' } }, now)).toBeNull();
    expect(parseGiftPromotion({ ...promotion, campaign: { ends_at: '2026-06-01' } }, now)).toBeNull();
    expect(parseGiftPromotion({ ...promotion, campaign: { starts_at: '2026-06-01', ends_at: '2026-07-01' } }, now)).not.toBeNull();
  });
});

describe('computeGiftEligibleValue', () => {
  it('sums unit_price x quantity and ignores gift products and gift lines', () => {
    const items = [
      item('a', 'prod_a', 1_000_000, 2),
      item('b', 'prod_b', 500_000),
      item('g1', 'prod_gift', 300_000),
      item('g2', 'prod_other', 300_000, 1, true),
    ];
    expect(computeGiftEligibleValue(items, ['prod_gift'])).toBe(2_500_000);
    expect(computeGiftEligibleValue(undefined, [])).toBe(0);
  });
});

describe('isGiftEligible', () => {
  const cartOf = (value: number, currency = 'vnd') => ({ currency_code: currency, items: [item('a', 'prod_a', value)] });

  it('is inclusive for gte', () => {
    expect(isGiftEligible(cartOf(3_499_999), config)).toBe(false);
    expect(isGiftEligible(cartOf(3_500_000), config)).toBe(true);
  });

  it('is exclusive for gt', () => {
    expect(isGiftEligible(cartOf(3_500_000), { ...config, inclusive: false })).toBe(false);
    expect(isGiftEligible(cartOf(3_500_001), { ...config, inclusive: false })).toBe(true);
  });

  it('only applies to the configured currencies', () => {
    expect(isGiftEligible(cartOf(9_000_000, 'usd'), config)).toBe(false);
    expect(isGiftEligible(cartOf(9_000_000, 'VND'), config)).toBe(true);
    expect(isGiftEligible(cartOf(9_000_000, 'usd'), { ...config, currencies: [] })).toBe(true);
  });

  it('does not let the gift itself unlock the gift', () => {
    const cart = { currency_code: 'vnd', items: [item('a', 'prod_a', 3_400_000), item('g', 'prod_gift', 300_000, 1, true)] };
    expect(isGiftEligible(cart, config)).toBe(false);
  });
});

describe('decideGiftAction', () => {
  const cart = (items: ReturnType<typeof item>[], currency = 'vnd') => ({ currency_code: currency, items });

  it('does nothing below the threshold with no gift', () => {
    expect(decideGiftAction(cart([item('a', 'prod_a', 1_000_000)]), config)).toEqual({ add: false, removeItemIds: [] });
  });

  it('adds the gift when eligible and missing', () => {
    expect(decideGiftAction(cart([item('a', 'prod_a', 3_600_000)]), config)).toEqual({ add: true, removeItemIds: [] });
  });

  it('is already correct when eligible with exactly one gift', () => {
    const plan = decideGiftAction(cart([item('a', 'prod_a', 3_600_000), item('g', 'prod_gift', 300_000, 1, true)]), config);
    expect(plan).toEqual({ add: false, removeItemIds: [], resetQuantityItemId: undefined });
  });

  it('removes the gift when the cart stops qualifying', () => {
    const plan = decideGiftAction(cart([item('a', 'prod_a', 3_000_000), item('g', 'prod_gift', 300_000, 1, true)]), config);
    expect(plan).toEqual({ add: false, removeItemIds: ['g'] });
  });

  it('removes the gift from a cart in another currency', () => {
    const plan = decideGiftAction(cart([item('a', 'prod_a', 9_000_000), item('g', 'prod_gift', 3, 1, true)], 'usd'), config);
    expect(plan.removeItemIds).toEqual(['g']);
  });

  it('keeps one gift line at quantity 1', () => {
    const items = [item('a', 'prod_a', 3_600_000), item('g1', 'prod_gift', 300_000, 2, true), item('g2', 'prod_gift', 300_000, 1, true)];
    expect(decideGiftAction(cart(items), config)).toEqual({ add: false, removeItemIds: ['g2'], resetQuantityItemId: 'g1' });
  });
});

describe('without a gift promotion', () => {
  const items = [item('a', 'prod_a', 9_000_000), item('g', 'prod_gift', 300_000, 1, true)];

  it('removes every gift line, since nothing discounts it any more', () => {
    expect(decideGiftAction({ currency_code: 'vnd', items }, null)).toEqual({ add: false, removeItemIds: ['g'] });
  });

  it('flags a cart that still holds a gift line, but not one without', () => {
    expect(hasIneligibleGift({ currency_code: 'vnd', items }, null)).toBe(true);
    expect(hasIneligibleGift({ currency_code: 'vnd', items: [item('a', 'prod_a', 9_000_000)] }, null)).toBe(false);
  });
});

describe('hasIneligibleGift', () => {
  it('flags a gift line in a cart that does not qualify', () => {
    const items = [item('a', 'prod_a', 3_000_000), item('g', 'prod_gift', 300_000, 1, true)];
    expect(hasIneligibleGift({ currency_code: 'vnd', items }, config)).toBe(true);
  });

  it('accepts carts without a gift, or with a qualifying one', () => {
    expect(hasIneligibleGift({ currency_code: 'vnd', items: [item('a', 'prod_a', 3_000_000)] }, config)).toBe(false);
    const items = [item('a', 'prod_a', 3_600_000), item('g', 'prod_gift', 300_000, 1, true)];
    expect(hasIneligibleGift({ currency_code: 'vnd', items }, config)).toBe(false);
  });
});
