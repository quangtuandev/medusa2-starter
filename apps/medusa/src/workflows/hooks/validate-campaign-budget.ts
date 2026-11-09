import {
  createCampaignsWorkflow,
  updateCampaignsWorkflow,
  createPromotionsWorkflow,
  updatePromotionsWorkflow,
} from '@medusajs/medusa/core-flows';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { assertNoUseByAttributeBudget } from './guest-safe-campaign-budget';

type Container = { resolve: (key: string) => any };

const checkCampaigns = async (container: Container, ids: string[]) => {
  if (!ids.length) return;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'campaign',
    fields: ['id', 'name', 'budget.type', 'budget.attribute'],
    filters: { id: ids },
  });
  assertNoUseByAttributeBudget(data);
};

const checkPromotions = async (container: Container, ids: string[]) => {
  if (!ids.length) return;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'promotion',
    fields: ['id', 'campaign.id', 'campaign.name', 'campaign.budget.type', 'campaign.budget.attribute'],
    filters: { id: ids },
  });
  assertNoUseByAttributeBudget(data.map((promotion: { campaign?: any }) => promotion.campaign));
};

// Throwing inside a hook fails the workflow and rolls back the preceding steps.
createCampaignsWorkflow.hooks.campaignsCreated(async ({ campaigns }, { container }) => {
  await checkCampaigns(
    container,
    campaigns.map((c) => c.id),
  );
});

updateCampaignsWorkflow.hooks.campaignsUpdated(async ({ campaigns }, { container }) => {
  await checkCampaigns(
    container,
    campaigns.map((c) => c.id),
  );
});

createPromotionsWorkflow.hooks.promotionsCreated(async ({ promotions }, { container }) => {
  await checkPromotions(
    container,
    promotions.map((p) => p.id),
  );
});

updatePromotionsWorkflow.hooks.promotionsUpdated(async ({ promotions }, { container }) => {
  await checkPromotions(
    container,
    promotions.map((p) => p.id),
  );
});
