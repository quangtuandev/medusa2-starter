import { buildPromotionContext } from '../promotion-context';

const gift = { quantity: 1, unit_price: 300_000, product_id: 'prod_gift', metadata: { is_gift: true } };

describe('buildPromotionContext', () => {
  describe('total_item_quantity', () => {
    it('sums the quantity of every line item', () => {
      expect(buildPromotionContext({ items: [{ quantity: 2 }, { quantity: 1 }] }).total_item_quantity).toBe(3);
    });

    it('handles numeric strings and BigNumber-like values', () => {
      const items = [{ quantity: '2' }, { quantity: { toString: () => '1' } }];
      expect(buildPromotionContext({ items }).total_item_quantity).toBe(3);
    });

    it('returns 0 for an empty or missing cart', () => {
      expect(buildPromotionContext({ items: [] }).total_item_quantity).toBe(0);
      expect(buildPromotionContext({}).total_item_quantity).toBe(0);
      expect(buildPromotionContext({ items: null }).total_item_quantity).toBe(0);
    });

    it('does not count gift lines, so a gift cannot unlock "buy 3"', () => {
      expect(buildPromotionContext({ items: [{ quantity: 2 }, gift] }).total_item_quantity).toBe(2);
    });
  });

  describe('gift_eligible_value', () => {
    it('sums unit_price x quantity, excluding gift products and gift lines', () => {
      const items = [
        { product_id: 'prod_a', unit_price: 1_000_000, quantity: 2 },
        { product_id: 'prod_gift', unit_price: 300_000, quantity: 1 },
        gift,
      ];
      expect(buildPromotionContext({ items }, ['prod_gift']).gift_eligible_value).toBe(2_000_000);
    });

    it('is 0 for an empty cart', () => {
      expect(buildPromotionContext({}).gift_eligible_value).toBe(0);
    });
  });
});
