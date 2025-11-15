import { MedusaContainer } from '@medusajs/framework/types';
import { initializeContentful, createContentTypes, enableLocales } from './loaders';
import { ContentfulService } from './service';

/**
 * Initialize Contentful integration
 * This should be called when the module is loaded
 */
export async function initializeContentfulModule(
  container: MedusaContainer
): Promise<void> {
  try {
    // Initialize Contentful client
    const contentfulConfig = await initializeContentful(container);

    if (!contentfulConfig) {
      console.warn('[Contentful] Not configured. Skipping initialization.');
      return;
    }

    const { environment } = contentfulConfig;

    // Enable required locales
    console.info('[Contentful] Setting up locales...');
    await enableLocales(environment);

    // Create content types
    console.info('[Contentful] Creating content types...');
    await createContentTypes(environment);

    // Set environment on service for later use
    const contentfulService = container.resolve('contentfulService') as ContentfulService;
    contentfulService.setEnvironment(environment);

    console.info('[Contentful] Module initialized successfully');
  } catch (error) {
    console.error('[Contentful] Failed to initialize module:', error);
    // Don't throw - allow app to continue without Contentful
  }
}
