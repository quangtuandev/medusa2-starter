import { assertNoUseByAttributeBudget, findUseByAttributeCampaigns } from '../guest-safe-campaign-budget';

describe('assertNoUseByAttributeBudget', () => {
  it('rejects use_by_attribute budgets (customer_id)', () => {
    const campaigns = [
      { id: 'c1', name: 'Per customer', budget: { type: 'use_by_attribute', attribute: 'customer_id' } },
    ];
    expect(findUseByAttributeCampaigns(campaigns)).toHaveLength(1);
    expect(() => assertNoUseByAttributeBudget(campaigns)).toThrow(/Per customer/);
  });

  it('allows total usage, spend, no budget and missing campaigns', () => {
    expect(() =>
      assertNoUseByAttributeBudget([
        { id: 'c2', budget: { type: 'usage', attribute: null } },
        { id: 'c3', budget: { type: 'spend' } },
        { id: 'c4', budget: null },
        { id: 'c5' },
        null,
        undefined,
      ]),
    ).not.toThrow();
  });
});
