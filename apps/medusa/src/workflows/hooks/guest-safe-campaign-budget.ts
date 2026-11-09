import { MedusaError } from '@medusajs/framework/utils';

type BudgetLike = { type?: string | null; attribute?: string | null } | null;
type CampaignLike = { id?: string; name?: string | null; budget?: BudgetLike } | null;

/**
 * The storefront has no customer login, so carts never have a customer_id and Medusa throws
 * `Attribute value for "customer_id" is required by promotion campaing budget` for any promotion
 * whose campaign budget limits usage per attribute. Reject that configuration when it is saved.
 */
export const findUseByAttributeCampaigns = (campaigns: (CampaignLike | undefined)[]) =>
  campaigns.filter(
    (campaign): campaign is NonNullable<CampaignLike> =>
      !!campaign && (campaign.budget?.type === 'use_by_attribute' || !!campaign.budget?.attribute),
  );

export const assertNoUseByAttributeBudget = (campaigns: (CampaignLike | undefined)[]) => {
  const invalid = findUseByAttributeCampaigns(campaigns);

  if (!invalid.length) return;

  const names = invalid.map((campaign) => campaign.name || campaign.id).join(', ');

  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    `Campaign "${names}": "Limit usage per" (customer/email) is not supported because the store has no customer login. ` +
      'Use a total "Usage" limit instead, or remove the budget.',
  );
};
