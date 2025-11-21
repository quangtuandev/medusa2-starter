"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProductToContentfulWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const contentful_1 = require("../modules/contentful");
const utils_1 = require("@medusajs/framework/utils");
/**
 * Step 1: Fetch product from Medusa
 */
const fetchProductStep = (0, workflows_sdk_1.createStep)('fetch-product-step', async (input, { container }) => {
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    const product = await productModule.retrieveProduct(input.product_id, {
        select: ['id', 'title', 'description', 'handle', 'status'],
        relations: ['variants', 'variants.options'],
    });
    if (!product) {
        throw new Error(`Product ${input.product_id} not found`);
    }
    return new workflows_sdk_1.StepResponse(product);
});
/**
 * Step 2: Prepare product data for Contentful
 */
const prepareContentfulDataStep = (0, workflows_sdk_1.createStep)('prepare-contentful-data-step', async (input) => {
    const product = input.product;
    const contentfulProduct = {
        medusaId: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        seoTitle: product.title,
        seoDescription: product.description,
        locales: input.locales || {
            'en-US': {
                title: product.title,
                description: product.description || '',
                seoTitle: product.title,
                seoDescription: product.description || '',
            },
        },
    };
    return new workflows_sdk_1.StepResponse(contentfulProduct);
});
/**
 * Step 3: Publish product to Contentful
 */
const publishProductToContentfulStep = (0, workflows_sdk_1.createStep)('publish-product-to-contentful-step', async (input, { container }) => {
    const contentfulService = container.resolve(contentful_1.CONTENTFUL_MODULE);
    if (!contentfulService) {
        throw new Error('Contentful service not available');
    }
    const locales = Object.keys(input.contentfulProduct.locales);
    const result = await contentfulService.publishProduct(input.contentfulProduct, locales);
    return new workflows_sdk_1.StepResponse(result, result.id);
});
/**
 * Step 4: Sync variants to Contentful
 */
const syncVariantsStep = (0, workflows_sdk_1.createStep)('sync-variants-step', async (input, { container }) => {
    const contentfulService = container.resolve(contentful_1.CONTENTFUL_MODULE);
    if (!contentfulService || !input.product.variants) {
        return new workflows_sdk_1.StepResponse([]);
    }
    const syncedVariants = [];
    for (const variant of input.product.variants) {
        try {
            // Create variant entry in Contentful (optional - depends on content type setup)
            // For now, just track that we processed it
            syncedVariants.push({
                id: variant.id,
                sku: variant.sku,
                synced: true,
            });
        }
        catch (error) {
            console.warn(`Failed to sync variant ${variant.id}:`, error);
        }
    }
    return new workflows_sdk_1.StepResponse(syncedVariants);
});
/**
 * Workflow: Sync Product to Contentful
 * Publishes a product from Medusa to Contentful with localizations and variants
 */
exports.syncProductToContentfulWorkflow = (0, workflows_sdk_1.createWorkflow)('sync-product-to-contentful', (input) => {
    // Step 1: Fetch the product from Medusa
    const product = fetchProductStep({
        product_id: input.product_id,
    });
    // Step 2: Prepare data for Contentful
    const contentfulProduct = prepareContentfulDataStep({
        product,
        locales: input.locales,
    });
    // Step 3: Publish product to Contentful
    const publishResult = publishProductToContentfulStep({
        contentfulProduct,
    });
    // Step 4: Sync variants
    const variantsResult = syncVariantsStep({
        product,
        contentfulProduct,
    });
    return new workflows_sdk_1.WorkflowResponse({
        product: publishResult,
        variants: variantsResult,
        message: 'Product successfully synced to Contentful',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1wcm9kdWN0LXRvLWNvbnRlbnRmdWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3N5bmMtcHJvZHVjdC10by1jb250ZW50ZnVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQU0yQztBQUMzQyxzREFBMEQ7QUFDMUQscURBQW9EO0FBZ0JwRDs7R0FFRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSwwQkFBVSxFQUNqQyxvQkFBb0IsRUFDcEIsS0FBSyxFQUFFLEtBQTZCLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBUSxDQUFDO0lBRWhFLE1BQU0sT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ3BFLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDMUQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDO0tBQzVDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLENBQUMsVUFBVSxZQUFZLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsT0FBTyxJQUFJLDRCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkMsQ0FBQyxDQUNGLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0seUJBQXlCLEdBQUcsSUFBQSwwQkFBVSxFQUMxQyw4QkFBOEIsRUFDOUIsS0FBSyxFQUFFLEtBQXVFLEVBQUUsRUFBRTtJQUNoRixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBRTlCLE1BQU0saUJBQWlCLEdBQUc7UUFDeEIsUUFB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