"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNoUseByAttributeBudget = exports.findUseByAttributeCampaigns = void 0;
const utils_1 = require("@medusajs/framework/utils");
/**
 * The storefront has no customer login, so carts never have a customer_id and Medusa throws
 * `Attribute value for "customer_id" is required by promotion campaing budget` for any promotion
 * whose campaign budget limits usage per attribute. Reject that configuration when it is saved.
 */
const findUseByAttributeCampaigns = (campaigns) => campaigns.filter((campaign) => !!campaign && (campaign.budget?.type === 'use_by_attribute' || !!campaign.budget?.attribute));
exports.findUseByAttributeCampaigns = findUseByAttributeCampaigns;
const assertNoUseByAttributeBudget = (campaigns) => {
    const invalid = (0, exports.findUseByAttributeCampaigns)(campaigns);
    if (!invalid.length)
        return;
    const names = invalid.map((campaign) => campaign.name || campaign.id).join(', ');
    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Campaign "${names}": "Limit usage per" (customer/email) is not supported because the store has no customer login. ` +
        'Use a total "Usage" limit instead, or remove the budget.');
};
exports.assertNoUseByAttributeBudget = assertNoUseByAttributeBudget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Vlc3Qtc2FmZS1jYW1wYWlnbi1idWRnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2hvb2tzL2d1ZXN0LXNhZmUtY2FtcGFpZ24tYnVkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUF3RDtBQUt4RDs7OztHQUlHO0FBQ0ksTUFBTSwyQkFBMkIsR0FBRyxDQUFDLFNBQXVDLEVBQUUsRUFBRSxDQUNyRixTQUFTLENBQUMsTUFBTSxDQUNkLENBQUMsUUFBUSxFQUF5QyxFQUFFLENBQ2xELENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksS0FBSyxrQkFBa0IsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FDL0YsQ0FBQztBQUpTLFFBQUEsMkJBQTJCLCtCQUlwQztBQUVHLE1BQU0sNEJBQTRCLEdBQUcsQ0FBQyxTQUF1QyxFQUFFLEVBQUU7SUFDdEYsTUFBTSxPQUFPLEdBQUcsSUFBQSxtQ0FBMkIsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUV2RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07UUFBRSxPQUFPO0lBRTVCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqRixNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5QixhQUFhLEtBQUssa0dBQWtHO1FBQ2xILDBEQUEwRCxDQUM3RCxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBWlcsUUFBQSw0QkFBNEIsZ0NBWXZDIn0=