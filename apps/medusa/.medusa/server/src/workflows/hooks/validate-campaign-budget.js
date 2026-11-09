"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_flows_1 = require("@medusajs/medusa/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const guest_safe_campaign_budget_1 = require("./guest-safe-campaign-budget");
const checkCampaigns = async (container, ids) => {
    if (!ids.length)
        return;
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data } = await query.graph({
        entity: 'campaign',
        fields: ['id', 'name', 'budget.type', 'budget.attribute'],
        filters: { id: ids },
    });
    (0, guest_safe_campaign_budget_1.assertNoUseByAttributeBudget)(data);
};
const checkPromotions = async (container, ids) => {
    if (!ids.length)
        return;
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data } = await query.graph({
        entity: 'promotion',
        fields: ['id', 'campaign.id', 'campaign.name', 'campaign.budget.type', 'campaign.budget.attribute'],
        filters: { id: ids },
    });
    (0, guest_safe_campaign_budget_1.assertNoUseByAttributeBudget)(data.map((promotion) => promotion.campaign));
};
// Throwing inside a hook fails the workflow and rolls back the preceding steps.
core_flows_1.createCampaignsWorkflow.hooks.campaignsCreated(async ({ campaigns }, { container }) => {
    await checkCampaigns(container, campaigns.map((c) => c.id));
});
core_flows_1.updateCampaignsWorkflow.hooks.campaignsUpdated(async ({ campaigns }, { container }) => {
    await checkCampaigns(container, campaigns.map((c) => c.id));
});
core_flows_1.createPromotionsWorkflow.hooks.promotionsCreated(async ({ promotions }, { container }) => {
    await checkPromotions(container, promotions.map((p) => p.id));
});
core_flows_1.updatePromotionsWorkflow.hooks.promotionsUpdated(async ({ promotions }, { container }) => {
    await checkPromotions(container, promotions.map((p) => p.id));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtY2FtcGFpZ24tYnVkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy92YWxpZGF0ZS1jYW1wYWlnbi1idWRnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFLcUM7QUFDckMscURBQXNFO0FBQ3RFLDZFQUE0RTtBQUk1RSxNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsU0FBb0IsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU07UUFBRSxPQUFPO0lBQ3hCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNqQyxNQUFNLEVBQUUsVUFBVTtRQUNsQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQztRQUN6RCxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO0tBQ3JCLENBQUMsQ0FBQztJQUNILElBQUEseURBQTRCLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLFNBQW9CLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUN4QixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDakMsTUFBTSxFQUFFLFdBQVc7UUFDbkIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsc0JBQXNCLEVBQUUsMkJBQTJCLENBQUM7UUFDbkcsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtLQUNyQixDQUFDLENBQUM7SUFDSCxJQUFBLHlEQUE0QixFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUE2QixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNoRyxDQUFDLENBQUM7QUFFRixnRkFBZ0Y7QUFDaEYsb0NBQXVCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNwRixNQUFNLGNBQWMsQ0FDbEIsU0FBUyxFQUNULFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDM0IsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsb0NBQXVCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNwRixNQUFNLGNBQWMsQ0FDbEIsU0FBUyxFQUNULFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDM0IsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgscUNBQXdCLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RixNQUFNLGVBQWUsQ0FDbkIsU0FBUyxFQUNULFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDNUIsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgscUNBQXdCLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RixNQUFNLGVBQWUsQ0FDbkIsU0FBUyxFQUNULFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDNUIsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=