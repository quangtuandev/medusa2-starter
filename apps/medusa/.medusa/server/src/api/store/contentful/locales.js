"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const contentful_1 = require("../../../modules/contentful");
/**
 * GET /store/contentful/locales
 *
 * Fetch list of available locales from Contentful
 * This is used by the storefront to populate locale selector
 */
const GET = async (req, res) => {
    try {
        const contentfulService = req.scope.resolve(contentful_1.CONTENTFUL_MODULE);
        const locales = await contentfulService.getAvailableLocales();
        return res.json({
            locales,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch locales';
        return res.status(500).json({
            error: message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvY29udGVudGZ1bC9sb2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDREQUFnRTtBQUVoRTs7Ozs7R0FLRztBQUNJLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsOEJBQWlCLENBQVEsQ0FBQztRQUN0RSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFOUQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ2QsT0FBTztTQUNSLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxPQUFPLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMseUJBQXlCLENBQUM7UUFDbkYsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsT0FBTztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUFqQlcsUUFBQSxHQUFHLE9BaUJkIn0=