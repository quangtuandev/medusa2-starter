import { Module } from '@medusajs/framework/utils';
import { ContentfulService } from './service';
import { initializeContentful, createContentTypes, enableLocales } from './loaders';

export const CONTENTFUL_MODULE = 'contentful';

export default Module(CONTENTFUL_MODULE, {
  service: ContentfulService,
  loaders: [
    async (container: any) => {
      try {
        console.log('[Contentful] Initializing Contentful module...');

        // Initialize Contentful client
        const contentfulConfig = await initializeContentful(container);

        if (!contentfulConfig) {
          console.warn('[Contentful] Not configured. Skipping initialization.');
          return;
        }

        const { environment } = contentfulConfig;

        // Enable required locales
        console.log('[Contentful] Setting up locales...');
        await enableLocales(environment);

        // Create content types
        console.log('[Contentful] Creating content types...');
        await createContentTypes(environment);

        // Set environment on service for later use
        try {
          const contentfulService = container.resolve?.(CONTENTFUL_MODULE) as any;
          if (contentfulService && contentfulService.setEnvironment) {
            contentfulService.setEnvironment(environment);
          }
        } catch (e) {
          console.warn('[Contentful] Could not set environment on service:', (e as Error).message);
        }

        console.log('[Contentful] Module initialized successfully');
      } catch (error) {
        console.error('[Contentful] Failed to initialize module:', error);
        // Don't throw - allow app to continue without Contentful
      }
    },
  ],
});
