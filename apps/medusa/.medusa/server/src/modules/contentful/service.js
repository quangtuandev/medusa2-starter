"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentfulService = void 0;
const utils_1 = require("@medusajs/framework/utils");
class ContentfulService extends (0, utils_1.MedusaService)({}) {
    environment = null;
    constructor(container) {
        super(container);
    }
    /**
     * Simple logger utility
     */
    log(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [Contentful] [${level.toUpperCase()}]`;
        if (data) {
            console[level](prefix, message, data);
        }
        else {
            console[level](prefix, message);
        }
    }
    /**
     * Set the Contentful environment for API calls
     */
    setEnvironment(environment) {
        this.environment = environment;
    }
    /**
     * Publish a product to Contentful with localizations
     */
    async publishProduct(productData, locales) {
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
            }
            catch (error) {
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
                });
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
        }
        catch (error) {
            this.log('error', `Failed to publish product to Contentful:`, error);
            throw error;
        }
    }
    /**
     * Get localized product data from Contentful
     */
    async getLocalizedProduct(medusaId, locale = 'en-US') {
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
            const entry = entries.items[0];
            return {
                title: entry.fields.title?.[locale] || entry.fields.title?.['en-US'] || '',
                description: entry.fields.description?.[locale] || entry.fields.description?.['en-US'],
                seoTitle: entry.fields.seoTitle?.[locale] || entry.fields.seoTitle?.['en-US'],
                seoDescription: entry.fields.seoDescription?.[locale] || entry.fields.seoDescription?.['en-US'],
            };
        }
        catch (error) {
            this.log('error', `Failed to fetch product from Contentful:`, error);
            return null;
        }
    }
    /**
     * Get all localized variants for a product
     */
    async getLocalizedVariants(productMedusaId, locale = 'en-US') {
        if (!this.environment) {
            throw new Error('Contentful environment not initialized');
        }
        try {
            const entries = await this.environment.getEntries({
                content_type: 'productVariant',
                'fields.productMedusaId': productMedusaId,
            });
            return entries.items.map((entry) => ({
                medusaVariantId: entry.fields.medusaVariantId?.['en-US'],
                title: entry.fields.title?.[locale] || entry.fields.title?.['en-US'] || '',
                sku: entry.fields.sku?.['en-US'],
            }));
        }
        catch (error) {
            this.log('error', `Failed to fetch variants from Contentful:`, error);
            return [];
        }
    }
    /**
     * Delete product entry from Contentful
     */
    async deleteProduct(medusaId) {
        if (!this.environment) {
            throw new Error('Contentful environment not initialized');
        }
        try {
            const entries = await this.environment.getEntries({
                content_type: 'product',
                'fields.medusaId': medusaId,
            });
            if (entries.items.length > 0) {
                const entry = entries.items[0];
                // Unpublish before deletion
                await entry.unpublish();
                await entry.delete();
                this.log('info', `Successfully deleted product ${medusaId} from Contentful`);
            }
        }
        catch (error) {
            this.log('error', `Failed to delete product from Contentful:`, error);
            throw error;
        }
    }
    /**
     * Get available locales from Contentful
     */
    async getAvailableLocales() {
        if (!this.environment) {
            throw new Error('Contentful environment not initialized');
        }
        try {
            const locales = await this.environment.getLocales();
            return locales.items.map((l) => l.code);
        }
        catch (error) {
            this.log('error', `Failed to fetch locales from Contentful:`, error);
            return ['en-US'];
        }
    }
}
exports.ContentfulService = ContentfulService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbnRlbnRmdWwvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBMEQ7QUFzQjFELE1BQWEsaUJBQWtCLFNBQVEsSUFBQSxxQkFBYSxFQUFDLEVBQUUsQ0FBQztJQUM5QyxXQUFXLEdBQWtDLElBQUksQ0FBQztJQUUxRCxZQUFZLFNBQWM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7T0FFRztJQUNLLEdBQUcsQ0FBQyxLQUFnQyxFQUFFLE9BQWUsRUFBRSxJQUFVO1FBQ3ZFLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLG1CQUFtQixLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQztRQUN0RSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxjQUFjLENBQUMsV0FBbUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FDbEIsV0FBOEIsRUFDOUIsT0FBaUI7UUFFakIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILGdD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