"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeContentful = initializeContentful;
exports.createContentTypes = createContentTypes;
exports.enableLocales = enableLocales;
const contentful = __importStar(require("contentful-management"));
const LOCALES = ['en-US', 'vi'];
const PRODUCT_CONTENT_TYPE_ID = 'product';
const PRODUCT_VARIANT_CONTENT_TYPE_ID = 'productVariant';
async function initializeContentful(container) {
    const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID || '';
    const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN || '';
    const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
    if (!contentfulSpaceId || !contentfulAccessToken) {
        console.warn('Contentful credentials not configured');
        return null;
    }
    try {
        const client = contentful.createClient({
            accessToken: contentfulAccessToken,
        });
        const space = await client.getSpace(contentfulSpaceId);
        const environment = await space.getEnvironment(contentfulEnvironment);
        console.log('Contentful initialized successfully');
        return { client, space, environment };
    }
    catch (error) {
        console.error('Failed to initialize Contentful:', error);
        throw error;
    }
}
/**
 * Create content types in Contentful for products, variants, and options
 */
async function createContentTypes(environment) {
    try {
        // Check if content type already exists
        let contentType;
        try {
            contentType = await environment.getContentType(PRODUCT_CONTENT_TYPE_ID);
            console.log('Product content type already exists');
            return;
        }
        catch (error) {
            // Check if it's a 404 (not found) - content type doesn't exist yet
            // The error object from Contentful has a statusText property
            const statusText = error?.statusText || error?.status || error?.message || '';
            const isNotFound = statusText === 'Not Found' || error?.status === 404 || statusText.includes('404');
            if (!isNotFound) {
                console.error(`Unexpected error checking for Product content type:`, error.message || error);
                throw error;
            }
            // Content type doesn't exist, continue with creation
            console.log('✓ Product content type does not exist, will create it...');
        }
        // Create Product Content Type
        try {
            console.log('Attempting to create Product content type...');
            contentType = await environment.createContentTypeWithId(PRODUCT_CONTENT_TYPE_ID, {
                name: 'Product',
                fields: [
                    {
                        id: 'medusaId',
                        name: 'Medusa ID',
                        type: 'Symbol',
                        required: true,
                    },
                    {
                        id: 'title',
                        name: 'Title',
                        type: 'Symbol',
                        localized: true,
                        required: true,
                    },
                    {
                        id: 'description',
                        name: 'Description',
                        type: 'Text',
                        localized: true,
                    },
                    {
                        id: 'handle',
                        name: 'Handle',
                        type: 'Symbol',
                        required: true,
                    },
                    {
                        id: 'seoTitle',
                        name: 'SEO Title',
                        type: 'Symbol',
                        localized: true,
                    },
                    {
                        id: 'seoDescription',
                        name: 'SEO Description',
                        type: 'Text',
                        localized: true,
                    },
                ],
                displayField: 'title',
            });
            console.log('Publishing Product content type...');
            await contentType.publish();
            console.log('✓ Product content type created and published');
        }
        catch (error) {
            console.error('✗ Error creating Product content type:', error.message || error);
            // Don't throw - try to continue with variant
        }
        // Create Product Variant Content Type
        try {
            console.log('Attempting to create Product Variant content type...');
            const variantContentType = await environment.createContentTypeWithId(PRODUCT_VARIANT_CONTENT_TYPE_ID, {
                name: 'Product Variant',
                fields: [
                    {
                        id: 'medusaVariantId',
                        name: 'Medusa Variant ID',
                        type: 'Symbol',
                        required: true,
                    },
                    {
                        id: 'productMedusaId',
                        name: 'Product Medusa ID',
                        type: 'Symbol',
                        required: true,
                    },
                    {
                        id: 'title',
                        name: 'Title',
                        type: 'Symbol',
                        localized: true,
                        required: true,
                    },
                    {
                        id: 'sku',
                        name: 'SKU',
                        type: 'Symbol',
                    },
                ],
                displayField: 'title',
            });
            console.log('Publishing Product Variant content type...');
            await variantContentType.publish();
            console.log('✓ Product Variant content type created and published');
        }
        catch (error) {
            console.error('✗ Error creating Product Variant content type:', error.message || error);
            // Don't throw - allow app to continue
        }
    }
    catch (error) {
        console.error('Failed to create content types:', error);
        // Don't re-throw - allow app to continue without this
    }
}
/**
 * Enable locales in Contentful environment
 */
async function enableLocales(environment) {
    try {
        // Get current locales
        const locales = await environment.getLocales();
        // Check which locales are missing
        const existingCodes = locales.items.map((l) => l.code);
        const missingLocales = LOCALES.filter((code) => !existingCodes.includes(code));
        if (missingLocales.length === 0) {
            console.log('All required locales are already enabled');
            return;
        }
        // Create missing locales
        for (const localeCode of missingLocales) {
            const name = localeCode === 'en-US' ? 'English (United States)' : 'Vietnamese';
            const locale = await environment.createLocale({
                code: localeCode,
                name,
                fallbackCode: 'en-US',
                contentManagementApi: true,
                contentDeliveryApi: true,
            });
            console.log(`Created locale: ${localeCode}`);
        }
    }
    catch (error) {
        console.error('Failed to enable locales:', error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbnRlbnRmdWwvbG9hZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLG9EQXlCQztBQUtELGdEQTRIQztBQUtELHNDQStCQztBQXBNRCxrRUFBb0Q7QUFFcEQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEMsTUFBTSx1QkFBdUIsR0FBRyxTQUFTLENBQUM7QUFDMUMsTUFBTSwrQkFBK0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUVsRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsU0FBMEI7SUFDbkUsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQztJQUNoRSxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksRUFBRSxDQUFDO0lBQ3hFLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsSUFBSSxRQUFRLENBQUM7SUFFN0UsSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDdEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUNyQyxXQUFXLEVBQUUscUJBQXFCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLE1BQU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRXRFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUVuRCxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekQsTUFBTSxLQUFLLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0ksS0FBSyxVQUFVLGtCQUFrQixDQUN0QyxXQUFtQztJQUVuQyxJQUFJLENBQUM7UUFDSCx1Q0FBdUM7UUFDdkMsSUFBSSxXQUFXLENBQUM7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUNuRCxPQUFPO1FBQ1QsQ0FBQztRQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7WUFDcEIsbUVBQW1FO1lBQ25FLDZEQUE2RDtZQUM3RCxNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQUUsVUFBVSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDOUUsTUFBTSxVQUFVLEdBQUcsVUFBVSxLQUFLLFdBQVcsSUFBSSxLQUFLLEVBQUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXJHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxREFBcUQsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDO2dCQUM3RixNQUFNLEtBQUssQ0FBQztZQUNkLENBQUM7WUFDRCxxREFBcUQ7WUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFRCw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBQzVELFdBQVcsR0FBRyxNQUFNLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDL0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsTUFBTSxFQUFFO29CQUNOO3dCQUNFLEVBQUUsRUFBRSxVQUFVO3dCQUNkLElBQUksRUFBRSxXQUFXO3dCQUNqQixJQUFJLEVBQUUsUUFBUTt3QkFDZCxRQUFRLEVBQUUsSUFBSTtxQkFDZjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsT0FBTzt3QkFDWCxJQUFJLEVBQUUsT0FBTzt3QkFDYixJQUFJLEVBQUUsUUFBUTt3QkFDZCxTQUFTLEVBQUUsSUFBSTt3QkFDZixRQUFRLEVBQUUsSUFBSTtxQkFDZjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsYUFBYTt3QkFDakIsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLElBQUksRUFBRSxNQUFNO3dCQUNaLFNBQVMsRUFBRSxJQUFJO3FCQUNoQjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsUUFBUTt3QkFDWixJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxRQUFRLEVBQUUsSUFBSTtxQkFDZjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsVUFBVTt3QkFDZCxJQUFJLEVBQUUsV0FBVzt3QkFDakIsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsU0FBUyxFQUFFLElBQUk7cUJBQ2hCO29CQUNEO3dCQUNFLEVBQUUsRUFBRSxnQkFBZ0I7d0JBQ3BCLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxNQUFNO3dCQUNaLFNBQVMsRUFBRSxJQUFJO3FCQUNoQjtpQkFDRjtnQkFDRCxZQUFZLEVBQUUsT0FBTzthQUNmLENBQUMsQ0FBQztZQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNsRCxNQUFNLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ2hGLDZDQUE2QztRQUMvQyxDQUFDO1FBRUQsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUNwRSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sV0FBVyxDQUFDLHVCQUF1QixDQUFDLCtCQUErQixFQUFFO2dCQUNwRyxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixNQUFNLEVBQUU7b0JBQ047d0JBQ0UsRUFBRSxFQUFFLGlCQUFpQjt3QkFDckIsSUFBSSxFQUFFLG1CQUFtQjt3QkFDekIsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsRUFBRSxFQUFFLGlCQUFpQjt3QkFDckIsSUFBSSxFQUFFLG1CQUFtQjt3QkFDekIsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsRUFBRSxFQUFFLE9BQU87d0JBQ1gsSUFBSSxFQUFFLE9BQU87d0JBQ2IsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsU0FBUyxFQUFFLElBQUk7d0JBQ2YsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsRUFBRSxFQUFFLEtBQUs7d0JBQ1QsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsSUFBSSxFQUFFLFFBQVE7cUJBQ2Y7aUJBQ0Y7Z0JBQ0QsWUFBWSxFQUFFLE9BQU87YUFDZixDQUFDLENBQUM7WUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDMUQsTUFBTSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ3hGLHNDQUFzQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hELHNEQUFzRDtJQUN4RCxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0ksS0FBSyxVQUFVLGFBQWEsQ0FBQyxXQUFtQztJQUNyRSxJQUFJLENBQUM7UUFDSCxzQkFBc0I7UUFDdEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFL0Msa0NBQWtDO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFL0UsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUN4RCxPQUFPO1FBQ1QsQ0FBQztRQUVELHlCQUF5QjtRQUN6QixLQUFLLE1BQU0sVUFBVSxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDL0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxXQUFXLENBQUMsWUFBWSxDQUFDO2dCQUM1QyxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSTtnQkFDSixZQUFZLEVBQUUsT0FBTztnQkFDckIsb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsa0JBQWtCLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7WUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsTUFBTSxLQUFLLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQyJ9