"use strict";
/**
 * Seed script: Sync products to Contentful with localizations
 *
 * Usage:
 *   yarn medusa exec ./src/scripts/seed-contentful.ts
 *
 * This script demonstrates how to sync existing products to Contentful
 * with Vietnamese and English localizations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const utils_1 = require("@medusajs/framework/utils");
const sync_product_to_contentful_1 = require("../workflows/sync-product-to-contentful");
// Sample localization data for coffee products
const PRODUCT_LOCALIZATIONS = {
    // Barrio Blend - Medium Roast
    'barrio-blend-medium-roast': {
        viTitle: 'Hỗn Hợp Barrio - Rang Vừa',
        viDescription: 'Một hỗn hợp mịn và cân bằng giữa các hạt từ Châu Phi và Nam Mỹ. Hương vị phong phú với ghi chú của socola và hạt dẻ.',
        viSeoTitle: 'Mua Hỗn Hợp Barrio Rang Vừa - Cà Phê Cao Cấp',
        viSeoDescription: 'Cà phê hỗn hợp chất lượng cao từ Châu Phi và Nam Mỹ. Giao hàng tươi đến cửa bạn.',
    },
    // Sunrise Blend - Light Roast
    'sunrise-blend-light-roast': {
        viTitle: 'Hỗn Hợp Mặt Trời - Rang Nhẹ',
        viDescription: 'Một loại cà phê rang nhẹ với hương vị sáng sủa và tươi mới. Các ghi chú của trái cây và citrus nổi bật.',
        viSeoTitle: 'Mua Hỗn Hợp Mặt Trời Rang Nhẹ - Cà Phê Cao Cấp',
        viSeoDescription: 'Cà phê rang nhẹ tươi mới với hương vị citrus. Giao hàng nhanh chóng.',
    },
    // Midnight Roast - Dark Roast
    'midnight-roast-dark-roast': {
        viTitle: 'Rang Tối Nửa Đêm - Rang Đậm',
        viDescription: 'Một loại cà phê rang đậm mạnh mẽ với hương vị sâu sắc. Ghi chú của socola, caramen và tpices.',
        viSeoTitle: 'Mua Cà Phê Rang Tối Nửa Đêm - Đậm Đà Và Mạnh Mẽ',
        viSeoDescription: 'Cà phê rang đậm chất lượng cao với hương vị sâu sắc.',
    },
    // Ethiopian Highlands
    'ethiopian-highlands': {
        viTitle: 'Núi Cao Ethiopia',
        viDescription: 'Cà phê Arabica từ vùng cao nguyên Ethiopia nổi tiếng. Hương vị phức tạp với ghi chú của hoa và trái cây.',
        viSeoTitle: 'Mua Cà Phê Ethiopia Highlands - Hàng Cao Cấp Nhập Khẩu',
        viSeoDescription: 'Cà phê Arabica nguyên bản từ Ethiopia với hương vị hoa trái.',
    },
    // Colombian Mountain Water
    'colombian-mountain-water': {
        viTitle: 'Nước Núi Colombia',
        viDescription: 'Cà phê từ những trang trại cao nhất ở Colombia. Hương vị mịn với ghi chú của dâu tây và kẹo.',
        viSeoTitle: 'Mua Cà Phê Colombia Mountain Water - Cao Cấp',
        viSeoDescription: 'Cà phê Colombia nguyên bản từ vùng núi cao.',
    },
    // Brazilian Paradise
    'brazilian-paradise': {
        viTitle: 'Thiên Đường Brazil',
        viDescription: 'Cà phê từ các trang trại lớn nhất Brazil. Hương vị thơm mộng mơ với ghi chú của kẹo và đất.',
        viSeoTitle: 'Mua Cà Phê Brazil Paradise - Hàng Nhập Khẩu',
        viSeoDescription: 'Cà phê Brazil chất lượng cao với hương vị ngọt ngào.',
    },
    // Costa Rican Rainforest
    'costa-rican-rainforest': {
        viTitle: 'Rừng Mưa Costa Rica',
        viDescription: 'Cà phê từ rừng mưa Costa Rica. Hương vị cân bằng với ghi chú của cacao và quả mọng.',
        viSeoTitle: 'Mua Cà Phê Costa Rica Rainforest - Cao Cấp',
        viSeoDescription: 'Cà phê Costa Rica nguyên bản từ rừng mưa.',
    },
    // Kenyan Reserve
    'kenyan-reserve': {
        viTitle: 'Dự Trữ Kenya',
        viDescription: 'Cà phê hiếm từ Kenya với hương vị đặc trưng. Ghi chú của cà chua đen và cam.',
        viSeoTitle: 'Mua Cà Phê Kenya Reserve - Hàng Quý Hiếm',
        viSeoDescription: 'Cà phê Kenya hiếm có với hương vị độc đáo.',
    },
};
async function run({ container }) {
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    try {
        console.info('[Contentful Seed] Starting Contentful product seeding...');
        // Get list of products
        const products = await productModule.listProducts({ status: 'published' }, { take: 100 });
        console.info(`[Contentful Seed] Found ${products.length} published products`);
        let syncedCount = 0;
        let failedCount = 0;
        for (const product of products) {
            try {
                // Check if we have localization data for this product
                const localization = PRODUCT_LOCALIZATIONS[product.handle];
                if (!localization) {
                    console.info(`[Contentful Seed] Skipping ${product.handle} - no localization data`);
                    continue;
                }
                console.info(`[Contentful Seed] Syncing product: ${product.title}`);
                // Prepare localization data
                const locales = {
                    'en-US': {
                        title: product.title,
                        description: product.description,
                        seoTitle: product.title,
                        seoDescription: product.description || '',
                    },
                    vi: {
                        title: localization.viTitle,
                        description: localization.viDescription,
                        seoTitle: localization.viSeoTitle,
                        seoDescription: localization.viSeoDescription,
                    },
                };
                // Run sync workflow
                await (0, sync_product_to_contentful_1.syncProductToContentfulWorkflow)(container).run({
                    input: {
                        product_id: product.id,
                        locales,
                    },
                });
                console.info(`[Contentful Seed] ✓ Synced ${product.title} to Contentful`);
                syncedCount++;
            }
            catch (error) {
                console.error(`[Contentful Seed] ✗ Failed to sync ${product.handle}:`, error);
                failedCount++;
            }
        }
        console.info(`\n[Contentful Seed] === Contentful Sync Summary ===`);
        console.info(`[Contentful Seed] ✓ Successfully synced: ${syncedCount}`);
        console.info(`[Contentful Seed] ✗ Failed: ${failedCount}`);
        console.info(`[Contentful Seed] ⏭️  Skipped: ${products.length - syncedCount - failedCount}`);
        console.info(`[Contentful Seed] Total: ${products.length}`);
    }
    catch (error) {
        console.error('[Contentful Seed] Contentful seeding failed:', error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1jb250ZW50ZnVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2VlZC1jb250ZW50ZnVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7R0FRRzs7QUEwRkgsc0JBd0VDO0FBL0pELHFEQUFvRDtBQUNwRCx3RkFBMEY7QUFFMUYsK0NBQStDO0FBQy9DLE1BQU0scUJBQXFCLEdBUXZCO0lBQ0YsOEJBQThCO0lBQzlCLDJCQUEyQixFQUFFO1FBQzNCLE9BQU8sRUFBRSwyQkFBMkI7UUFDcEMsYUFBYSxFQUNYLHNIQUFzSDtRQUN4SCxVQUFVLEVBQUUsOENBQThDO1FBQzFELGdCQUFnQixFQUNkLGtGQUFrRjtLQUNyRjtJQUVELDhCQUE4QjtJQUM5QiwyQkFBMkIsRUFBRTtRQUMzQixPQUFPLEVBQUUsNkJBQTZCO1FBQ3RDLGFBQWEsRUFDWCx5R0FBeUc7UUFDM0csVUFBVSxFQUFFLGdEQUFnRDtRQUM1RCxnQkFBZ0IsRUFBRSxzRUFBc0U7S0FDekY7SUFFRCw4QkFBOEI7SUFDOUIsMkJBQTJCLEVBQUU7UUFDM0IsT0FBTyxFQUFFLDZCQUE2QjtRQUN0QyxhQUFhLEVBQ1gsK0ZBQStGO1FBQ2pHLFVBQVUsRUFBRSxpREFBaUQ7UUFDN0QsZ0JBQWdCLEVBQUUsc0RBQXNEO0tBQ3pFO0lBRUQsc0JBQXNCO0lBQ3RCLHFCQUFxQixFQUFFO1FBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsYUFBYSxFQUNYLDBHQUEwRztRQUM1RyxVQUFVLEVBQUUsd0RBQXdEO1FBQ3BFLGdCQUFnQixFQUFFLDhEQUE4RDtLQUNqRjtJQUVELDJCQUEyQjtJQUMzQiwwQkFBMEIsRUFBRTtRQUMxQixPQUFPLEVBQUUsbUJBQW1CO1FBQzVCLGFBQWEsRUFDWCw4RkFBOEY7UUFDaEcsVUFBVSxFQUFFLDhDQUE4QztRQUMxRCxnQkFBZ0IsRUFBRSw2Q0FBNkM7S0FDaEU7SUFFRCxxQkFBcUI7SUFDckIs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