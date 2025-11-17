"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const contentful_1 = require("../../../../modules/contentful");
/**
 * GET /store/products/:id/localized
 *
 * Fetch localized product data from Contentful
 * Query params:
 *   - locale: Locale code (default: en-US)
 *
 * Example: GET /store/products/prod_123/localized?locale=vi
 */
const GET = async (req, res) => {
    const { id } = req.params;
    const locale = req.query.locale || 'en-US';
    try {
        const contentfulService = req.scope.resolve(contentful_1.CONTENTFUL_MODULE);
        // Get localized product data from Contentful
        const localizedProduct = await contentfulService.getLocalizedProduct(id, locale);
        if (!localizedProduct) {
            return res.status(404).json({
                error: 'Product not found in Contentful',
                product_id: id,
                locale,
            });
        }
        // Get localized variants
        const localizedVariants = await contentfulService.getLocalizedVariants(id, locale);
        return res.json({
            product_id: id,
            locale,
            product: localizedProduct,
            variants: localizedVariants,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            error: message,
            product_id: id,
            locale,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9wcm9kdWN0cy9baWRdL2xvY2FsaXplZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrREFBbUU7QUFFbkU7Ozs7Ozs7O0dBUUc7QUFDSSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUMxQixNQUFNLE1BQU0sR0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWlCLElBQUksT0FBTyxDQUFDO0lBRXZELElBQUksQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsOEJBQWlCLENBQVEsQ0FBQztRQUV0RSw2Q0FBNkM7UUFDN0MsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN0QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsaUNBQWlDO2dCQUN4QyxVQUFVLEVBQUUsRUFBRTtnQkFDZCxNQUFNO2FBQ1AsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELHlCQUF5QjtRQUN6QixNQUFNLGlCQUFpQixHQUFHLE1BQU0saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRW5GLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLFVBQVUsRUFBRSxFQUFFO1lBQ2QsTUFBTTtZQUNOLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsUUFBUSxFQUFFLGlCQUFpQjtTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sT0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO1FBQzdFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87WUFDZCxVQUFVLEVBQUUsRUFBRTtZQUNkLE1BQU07U0FDUCxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBdENXLFFBQUEsR0FBRyxPQXNDZCJ9