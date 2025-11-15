import { MedusaService } from '@medusajs/framework/utils';
import * as contentful from 'contentful-management';

export interface LocalizedProductData {
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContentfulProduct {
  medusaId: string;
  title: string;
  description?: string;
  handle: string;
  seoTitle?: string;
  seoDescription?: string;
  locales?: {
    [key: string]: LocalizedProductData;
  };
}

export class ContentfulService extends MedusaService({}) {
  private environment: contentful.Environment | null = null;

  constructor(container: any) {
    super(container);
  }

  /**
   * Simple logger utility
   */
  private log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [Contentful] [${level.toUpperCase()}]`;
    if (data) {
      console[level](prefix, message, data);
    } else {
      console[level](prefix, message);
    }
  }

  /**
   * Set the Contentful environment for API calls
   */
  setEnvironment(environment: contentful.Environment) {
    this.environment = environment;
  }

  /**
   * Publish a product to Contentful with localizations
   */
  async publishProduct(
    productData: ContentfulProduct,
    locales: string[]
  ): Promise<any> {
    if (!this.environment) {
      throw new Error('Contentful environment not initialized');
    }

    try {
      // Check if entry already exists
      let entry;
      try {
        const entries = await this.environment.getEntries({
          content_type: 'product',
          'fields.medusaId': productData.medusaId,
        });

        if (entries.items.length > 0) {
          entry = entries.items[0];
          this.log('info', `Updating existing Contentful entry for product ${productData.medusaId}`);
        }
      } catch (error) {
        this.log('info', `Creating new Contentful entry for product ${productData.medusaId}`);
      }

      // Create or update entry
      if (!entry) {
        entry = await this.environment.createEntry('product', {
          fields: {
            medusaId: {
              'en-US': productData.medusaId,
            },
            handle: {
              'en-US': productData.handle,
            },
            title: {
              'en-US': productData.title,
            },
            description: {
              'en-US': productData.description || '',
            },
            seoTitle: {
              'en-US': productData.seoTitle || productData.title,
            },
            seoDescription: {
              'en-US': productData.seoDescription || productData.description || '',
            },
          },
        } as any);
      }

      // Update localized fields
      if (productData.locales) {
        for (const [locale, data] of Object.entries(productData.locales)) {
          if (locale !== 'en-US') {
            entry.fields.title[locale] = data.title;
            entry.fields.description[locale] = data.description || '';
            entry.fields.seoTitle[locale] = data.seoTitle || data.title;
            entry.fields.seoDescription[locale] = data.seoDescription || data.description || '';
          }
        }
      }

      // Save and publish entry
      const updatedEntry = await entry.update();
      const publishedEntry = await updatedEntry.publish();

      this.log('info', `Successfully published product ${productData.medusaId} to Contentful`);

      return {
        id: publishedEntry.sys.id,
        medusaId: productData.medusaId,
        handle: productData.handle,
      };
    } catch (error) {
      this.log('error', `Failed to publish product to Contentful:`, error);
      throw error;
    }
  }

  /**
   * Get localized product data from Contentful
   */
  async getLocalizedProduct(
    medusaId: string,
    locale: string = 'en-US'
  ): Promise<LocalizedProductData | null> {
    if (!this.environment) {
      throw new Error('Contentful environment not initialized');
    }

    try {
      const entries = await this.environment.getEntries({
        content_type: 'product',
        'fields.medusaId': medusaId,
      });

      if (entries.items.length === 0) {
        return null;
      }

      const entry = entries.items[0] as any;

      return {
        title: entry.fields.title?.[locale] || entry.fields.title?.['en-US'] || '',
        description: entry.fields.description?.[locale] || entry.fields.description?.['en-US'],
        seoTitle: entry.fields.seoTitle?.[locale] || entry.fields.seoTitle?.['en-US'],
        seoDescription:
          entry.fields.seoDescription?.[locale] || entry.fields.seoDescription?.['en-US'],
      };
    } catch (error) {
      this.log('error', `Failed to fetch product from Contentful:`, error);
      return null;
    }
  }

  /**
   * Get all localized variants for a product
   */
  async getLocalizedVariants(
    productMedusaId: string,
    locale: string = 'en-US'
  ): Promise<any[]> {
    if (!this.environment) {
      throw new Error('Contentful environment not initialized');
    }

    try {
      const entries = await this.environment.getEntries({
        content_type: 'productVariant',
        'fields.productMedusaId': productMedusaId,
      });

      return entries.items.map((entry: any) => ({
        medusaVariantId: entry.fields.medusaVariantId?.['en-US'],
        title: entry.fields.title?.[locale] || entry.fields.title?.['en-US'] || '',
        sku: entry.fields.sku?.['en-US'],
      }));
    } catch (error) {
      this.log('error', `Failed to fetch variants from Contentful:`, error);
      return [];
    }
  }

  /**
   * Delete product entry from Contentful
   */
  async deleteProduct(medusaId: string): Promise<void> {
    if (!this.environment) {
      throw new Error('Contentful environment not initialized');
    }

    try {
      const entries = await this.environment.getEntries({
        content_type: 'product',
        'fields.medusaId': medusaId,
      });

      if (entries.items.length > 0) {
        const entry = entries.items[0] as any;

        // Unpublish before deletion
        await entry.unpublish();
        await entry.delete();

        this.log('info', `Successfully deleted product ${medusaId} from Contentful`);
      }
    } catch (error) {
      this.log('error', `Failed to delete product from Contentful:`, error);
      throw error;
    }
  }

  /**
   * Get available locales from Contentful
   */
  async getAvailableLocales(): Promise<string[]> {
    if (!this.environment) {
      throw new Error('Contentful environment not initialized');
    }

    try {
      const locales = await this.environment.getLocales();
      return locales.items.map((l: any) => l.code);
    } catch (error) {
      this.log('error', `Failed to fetch locales from Contentful:`, error);
      return ['en-US'];
    }
  }
}
