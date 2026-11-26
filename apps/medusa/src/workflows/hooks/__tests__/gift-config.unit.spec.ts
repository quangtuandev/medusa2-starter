import { GIFT_PROMOTION_FIELDS, GIFT_PROMOTION_FILTERS, getGiftConfig, getGiftConfigState, resetGiftConfigCache } from '../gift-config';

const promotion = {
  id: 'promo_gift',
  status: 'active',
  is_automatic: true,
  rules: [{ attribute: 'gift_eligible_value', operator: 'gte', values: [{ value: '3500000' }] }],
  application_method: {
    target_rules: [{ attribute: 'items.product.id', operator: 'in', values: [{ value: 'prod_gift' }] }],
  },
};

const containerWith = (graph: jest.Mock) => ({
  resolve: (key: string) => (key === 'query' ? { graph } : { error: jest.fn() }),
});

describe('getGiftConfig', () => {
  beforeEach(() => resetGiftConfigCache());

  it('queries active automatic promotions and parses the gift one', async () => {
    const graph = jest.fn().mockResolvedValue({ data: [{ id: 'other', status: 'active', rules: [] }, promotion] });

    const config = await getGiftConfig(containerWith(graph));

    expect(graph).toHaveBeenCalledWith({ entity: 'promotion', fields: GIFT_PROMOTION_FIELDS, filters: GIFT_PROMOTION_FILTERS });
    expect(config).toMatchObject({ promotionId: 'promo_gift', threshold: 3_500_000, productIds: ['prod_gift'] });
  });

  it('caches the result for 30 seconds', async () => {
    const graph = jest.fn().mockResolvedValue({ data: [promotion] });
    const container = containerWith(graph);

    await getGiftConfig(container, 1_000);
    await getGiftConfig(container, 20_000);
    expect(graph).toHaveBeenCalledTimes(1);

    await getGiftConfig(container, 40_000);
    expect(graph).toHaveBeenCalledTimes(2);
  });

  it('returns null when there is no gift promotion', async () => {
    const graph = jest.fn().mockResolvedValue({ data: [] });
    expect(await getGiftConfig(containerWith(graph))).toBeNull();
  });

  it('reports a failed read as not ok instead of throwing', async () => {
    const graph = jest.fn().mockRejectedValue(new Error('db down'));
    expect(await getGiftConfigState(containerWith(graph))).toEqual({ ok: false, config: null });
  });
});
