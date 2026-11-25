import { buildPromotionContext } from '../promotion-context';

describe('buildPromotionContext', () => {
  it('sums the quantity of every line item', () => {
    expect(buildPromotionContext({ items: [{ quantity: 2 }, { quantity: 1 }] })).toEqual({ total_item_quantity: 3 });
  });

  it('handles numeric strings and BigNumber-like values', () => {
    expect(buildPromotionContext({ items: [{ quantity: '2' }, { quantity: { toString: () => '1' } }] })).toEqual({
      total_item_quantity: 3,
    });
  });

  it('returns 0 for an empty or missing cart', () => {
    expect(buildPromotionContext({ items: [] })).toEqual({ total_item_quantity: 0 });
    expect(buildPromotionContext({})).toEqual({ total_item_quantity: 0 });
    expect(buildPromotionContext({ items: null })).toEqual({ total_item_quantity: 0 });
  });
});
