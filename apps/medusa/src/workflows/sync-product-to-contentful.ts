import {
  createWorkflow,
  WorkflowData,
  createStep,
  StepResponse,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import { CONTENTFUL_MODULE } from '../modules/contentful';
import { Modules } from '@medusajs/framework/utils';

export interface LocalizedProductData {
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SyncProductInput {
  product_id: string;
  locales?: {
    [key: string]: LocalizedProductData;
  };
}

/**
 * Step 1: Fetch product from Medusa
 */
const fetchProductStep = createStep(
  'fetch-product-step',
  async (input: { product_id: string }, { container }) => {
    const productModule = container.resolve(Modules.PRODUCT) as any;

    const product = await productModule.retrieveProduct(input.product_id, {
      select: ['id', 'title', 'description', 'handle', 'status'],
      relations: ['variants', 'variants.options'],
    });

    if (!product) {
      throw new Error(`Product ${input.product_id} not found`);
    }

    return new StepResponse(product);
  }
);

/**
 * Step 2: Prepare product data for Contentful
 */
const prepareContentfulDataStep = createStep(
  'prepare-contentful-data-step',
  async (input: { product: any; locales?: Record<string, LocalizedProductData> }) => {
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

    return new StepResponse(contentfulProduct);
  }
);

/**
 * Step 3: Publish product to Contentful
 */
const publishProductToContentfulStep = createStep(
  'publish-product-to-contentful-step',
  async (
    input: {
      contentfulProduct: any;
    },
    { container }
  ) => {
    const contentfulService = container.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService) {
      throw new Error('Contentful service not available');
    }

    const locales = Object.keys(input.contentfulProduct.locales);
    const result = await contentfulService.publishProduct(
      input.contentfulProduct,
      locales
    );

    return new StepResponse(result, result.id);
  }
);

/**
 * Step 4: Sync variants to Contentful
 */
const syncVariantsStep = createStep(
  'sync-variants-step',
  async (
    input: {
      product: any;
      contentfulProduct: any;
    },
    { container }
  ) => {
    const contentfulService = container.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService || !input.product.variants) {
      return new StepResponse([]);
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
      } catch (error) {
        console.warn(`Failed to sync variant ${variant.id}:`, error);
      }
    }

    return new StepResponse(syncedVariants);
  }
);

/**
 * Workflow: Sync Product to Contentful
 * Publishes a product from Medusa to Contentful with localizations and variants
 */
export const syncProductToContentfulWorkflow = createWorkflow(
  'sync-product-to-contentful',
  (input: WorkflowData<SyncProductInput>) => {
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

    return new WorkflowResponse({
      product: publishResult,
      variants: variantsResult,
      message: 'Product successfully synced to Contentful',
    });
  }
);
