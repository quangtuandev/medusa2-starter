"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const contentful_1 = require("../../../../../../modules/contentful");
/**
 * GET /store/contentful/products/:id/variants
 *
 * Fetch localized variants for a product from Contentful
 * Query params:
 *   - locale: Contentful locale code (default: en-US)
 */
const GET = async (req, res) => {
    try {
        const { id } = req.params;
        const locale = req.query.locale || 'en-US';
        if (!id) {
            return res.status(400).json({
                error: 'Product ID is required',
            });
        }
        const contentfulService = req.scope.resolve(contentful_1.CONTENTFUL_MODULE);
        if (!contentfulService) {
            return res.status(503).json({
                error: 'Contentful service not available',
            });
        }
        // Get localized variants from Contentful
        const variants = await contentfulService.getLocalizedVariants(id, locale);
        return res.json({
            product_id: id,
            locale,
            variants,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            error: message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NvbnRlbnRmdWwvcHJvZHVjdHMvW2lkXS92YXJpYW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxRUFBeUU7QUFFekU7Ozs7OztHQU1HO0FBQ0ksTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFpQixJQUFJLE9BQU8sQ0FBQztRQUV2RCxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDUixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsd0JBQXdCO2FBQ2hDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhCQUFpQixDQUFRLENBQUM7UUFFdEUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDdkIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxFQUFFLGtDQUFrQzthQUMxQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQseUNBQXlDO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTFFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLFVBQVUsRUFBRSxFQUFFO1lBQ2QsTUFBTTtZQUNOLFFBQVE7U0FDVCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sT0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO1FBQzdFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBcENXLFFBQUEsR0FBRyxPQW9DZCJ9