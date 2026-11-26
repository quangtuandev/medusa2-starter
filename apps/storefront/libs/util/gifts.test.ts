import { getGiftEligibleValue, getGiftTotals, GiftConfig, isGiftEligibleCart, isGiftItem } from './gifts';

const config: GiftConfig = { productIds: ['prod_gift'], threshold: 3_500_000, inclusive: true, currencies: ['vnd'] };
const line = (productId: string, unitPrice: number, quantity = 1, isGift = false) => ({
  product_id: productId,
  unit_price: unitPrice,
  quantity,
  metadata: isGift ? { is_gift: true } : null,
});

describe('gifts', () => {
  it('detects gift lines by metadata', () => {
    expect(isGiftItem({ metadata: { is_gift: true } })).toBe(true);
    expect(isGiftItem({ metadata: { is_gift: 'true' } })).toBe(false);
    expect(isGiftItem({ metadata: null })).toBe(false);
    expect(isGiftItem(undefined)).toBe(false);
  });

  it('ignores gift lines and gift products when computing the eligible value', () => {
    const items = [line('prod_a', 1_000_000, 2), line('prod_gift', 300_000), line('prod_b', 300_000, 1, true)];
    expect(getGiftEligibleValue(items, ['prod_gift'])).toBe(2_000_000);
    expect(getGiftEligibleValue(undefined, [])).toBe(0);
  });

  it('checks the threshold and currency like the backend', () => {
    const cart = (value: number, currency = 'vnd') => ({ currency_code: currency, items: [line('prod_a', value)] });
    expect(isGiftEligibleCart(cart(3_499_999), config)).toBe(false);
    expect(isGiftEligibleCart(cart(3_500_000), config)).toBe(true);
    expect(isGiftEligibleCart(cart(3_500_000), { ...config, inclusive: false })).toBe(false);
    expect(isGiftEligibleCart(cart(9_000_000, 'usd'), config)).toBe(false);
    expect(isGiftEligibleCart(cart(9_000_000, 'usd'), { ...config, currencies: [] })).toBe(true);
  });

  it('sums what gift lines add to the subtotal and discount', () => {
    const items = [
      { ...line('prod_a', 3_600_000), subtotal: 3_600_000, discount_total: 180_000 },
      { ...line('prod_gift', 300_000, 1, true), subtotal: 300_000, discount_total: 300_000 },
    ];
    expect(getGiftTotals(items)).toEqual({ subtotal: 300_000, discount: 300_000 });
    expect(getGiftTotals([line('prod_gift', 300_000, 2, true)])).toEqual({ subtotal: 600_000, discount: 0 });
    expect(getGiftTotals(undefined)).toEqual({ subtotal: 0, discount: 0 });
  });
});
