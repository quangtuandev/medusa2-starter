"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const contentful_1 = require("../../../../../modules/contentful");
const utils_1 = require("@medusajs/framework/utils");
/**
 * GET /store/contentful/products/:id/localized
 *
 * Fetch localized product data from Contentful
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
        const productModule = req.scope.resolve(utils_1.Modules.PRODUCT);
        if (!contentfulService) {
            return res.status(503).json({
                error: 'Contentful service not available',
            });
        }
        // Get product from Medusa
        const product = await productModule.retrieveProduct(id, {
            select: ['id', 'title', 'description', 'handle'],
        }).catch(() => null);
        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
            });
        }
        // Get localized data from Contentful
        const localizedData = await contentfulService.getLocalizedProduct(id, locale);
        return res.json({
            product: {
                id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description,
            },
            contentful: localizedData || {
                title: product.title,
                description: product.description,
            },
            locale,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9jb250ZW50ZnVsL3Byb2R1Y3RzL1tpZF0vbG9jYWxpemVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGtFQUFzRTtBQUN0RSxxREFBb0Q7QUFFcEQ7Ozs7OztHQU1HO0FBQ0ksTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFpQixJQUFJLE9BQU8sQ0FBQztRQUV2RCxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDUixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsd0JBQXdCO2FBQ2hDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhCQUFpQixDQUFRLENBQUM7UUFDdEUsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBUSxDQUFDO1FBRWhFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxrQ0FBa0M7YUFDMUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFO1lBQ3RELE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQztTQUNqRCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNiLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxtQkFBbUI7YUFDM0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELHFDQUFxQztRQUNyQyxNQUFNLGFBQWEsR0FBRyxNQUFNLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU5RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDZCxPQUFPLEVBQUU7Z0JBQ1AsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztnQkFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7YUFDakM7WUFDRCxVQUFVLEVBQUUsYUFBYSxJQUFJO2dCQUMzQixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7Z0JBQ3BCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVzthQUNqQztZQUNELE1BQU07U0FDUCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sT0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO1FBQzdFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBeERXLFFBQUEsR0FBRyxPQXdEZCJ9