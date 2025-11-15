import { MedusaContainer } from '@medusajs/framework/types';
import * as contentful from 'contentful-management';

const LOCALES = ['en-US', 'vi'];
const PRODUCT_CONTENT_TYPE_ID = 'product';
const PRODUCT_VARIANT_CONTENT_TYPE_ID = 'productVariant';

export async function initializeContentful(container: MedusaContainer) {
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
  } catch (error) {
    console.error('Failed to initialize Contentful:', error);
    throw error;
  }
}

/**
 * Create content types in Contentful for products, variants, and options
 */
export async function createContentTypes(
  environment: contentful.Environment
) {
  try {
    // Check if content type already exists
    let contentType;
    try {
      contentType = await environment.getContentType(PRODUCT_CONTENT_TYPE_ID);
      console.log('Product content type already exists');
      return;
    } catch (error: any) {
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
      } as any);

      console.log('Publishing Product content type...');
      await contentType.publish();
      console.log('✓ Product content type created and published');
    } catch (error: any) {
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
      } as any);

      console.log('Publishing Product Variant content type...');
      await variantContentType.publish();
      console.log('✓ Product Variant content type created and published');
    } catch (error: any) {
      console.error('✗ Error creating Product Variant content type:', error.message || error);
      // Don't throw - allow app to continue
    }
  } catch (error) {
    console.error('Failed to create content types:', error);
    // Don't re-throw - allow app to continue without this
  }
}

/**
 * Enable locales in Contentful environment
 */
export async function enableLocales(environment: contentful.Environment) {
  try {
    // Get current locales
    const locales = await environment.getLocales();

    // Check which locales are missing
    const existingCodes = locales.items.map((l: any) => l.code);
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
      } as any);

      console.log(`Created locale: ${localeCode}`);
    }
  } catch (error) {
    console.error('Failed to enable locales:', error);
    throw error;
  }
}
