/**
 * Seed script: Sync products to Contentful with localizations
 *
 * Usage:
 *   yarn medusa exec ./src/scripts/seed-contentful.ts
 *
 * This script demonstrates how to sync existing products to Contentful
 * with Vietnamese and English localizations
 */

import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';
import { syncProductToContentfulWorkflow } from '../workflows/sync-product-to-contentful';

// Sample localization data for coffee products
const PRODUCT_LOCALIZATIONS: Record<
  string,
  {
    viTitle: string;
    viDescription: string;
    viSeoTitle: string;
    viSeoDescription: string;
  }
> = {
  // Barrio Blend - Medium Roast
  'barrio-blend-medium-roast': {
    viTitle: 'Hỗn Hợp Barrio - Rang Vừa',
    viDescription:
      'Một hỗn hợp mịn và cân bằng giữa các hạt từ Châu Phi và Nam Mỹ. Hương vị phong phú với ghi chú của socola và hạt dẻ.',
    viSeoTitle: 'Mua Hỗn Hợp Barrio Rang Vừa - Cà Phê Cao Cấp',
    viSeoDescription:
      'Cà phê hỗn hợp chất lượng cao từ Châu Phi và Nam Mỹ. Giao hàng tươi đến cửa bạn.',
  },

  // Sunrise Blend - Light Roast
  'sunrise-blend-light-roast': {
    viTitle: 'Hỗn Hợp Mặt Trời - Rang Nhẹ',
    viDescription:
      'Một loại cà phê rang nhẹ với hương vị sáng sủa và tươi mới. Các ghi chú của trái cây và citrus nổi bật.',
    viSeoTitle: 'Mua Hỗn Hợp Mặt Trời Rang Nhẹ - Cà Phê Cao Cấp',
    viSeoDescription: 'Cà phê rang nhẹ tươi mới với hương vị citrus. Giao hàng nhanh chóng.',
  },

  // Midnight Roast - Dark Roast
  'midnight-roast-dark-roast': {
    viTitle: 'Rang Tối Nửa Đêm - Rang Đậm',
    viDescription:
      'Một loại cà phê rang đậm mạnh mẽ với hương vị sâu sắc. Ghi chú của socola, caramen và tpices.',
    viSeoTitle: 'Mua Cà Phê Rang Tối Nửa Đêm - Đậm Đà Và Mạnh Mẽ',
    viSeoDescription: 'Cà phê rang đậm chất lượng cao với hương vị sâu sắc.',
  },

  // Ethiopian Highlands
  'ethiopian-highlands': {
    viTitle: 'Núi Cao Ethiopia',
    viDescription:
      'Cà phê Arabica từ vùng cao nguyên Ethiopia nổi tiếng. Hương vị phức tạp với ghi chú của hoa và trái cây.',
    viSeoTitle: 'Mua Cà Phê Ethiopia Highlands - Hàng Cao Cấp Nhập Khẩu',
    viSeoDescription: 'Cà phê Arabica nguyên bản từ Ethiopia với hương vị hoa trái.',
  },

  // Colombian Mountain Water
  'colombian-mountain-water': {
    viTitle: 'Nước Núi Colombia',
    viDescription:
      'Cà phê từ những trang trại cao nhất ở Colombia. Hương vị mịn với ghi chú của dâu tây và kẹo.',
    viSeoTitle: 'Mua Cà Phê Colombia Mountain Water - Cao Cấp',
    viSeoDescription: 'Cà phê Colombia nguyên bản từ vùng núi cao.',
  },

  // Brazilian Paradise
  'brazilian-paradise': {
    viTitle: 'Thiên Đường Brazil',
    viDescription:
      'Cà phê từ các trang trại lớn nhất Brazil. Hương vị thơm mộng mơ với ghi chú của kẹo và đất.',
    viSeoTitle: 'Mua Cà Phê Brazil Paradise - Hàng Nhập Khẩu',
    viSeoDescription: 'Cà phê Brazil chất lượng cao với hương vị ngọt ngào.',
  },

  // Costa Rican Rainforest
  'costa-rican-rainforest': {
    viTitle: 'Rừng Mưa Costa Rica',
    viDescription:
      'Cà phê từ rừng mưa Costa Rica. Hương vị cân bằng với ghi chú của cacao và quả mọng.',
    viSeoTitle: 'Mua Cà Phê Costa Rica Rainforest - Cao Cấp',
    viSeoDescription: 'Cà phê Costa Rica nguyên bản từ rừng mưa.',
  },

  // Kenyan Reserve
  'kenyan-reserve': {
    viTitle: 'Dự Trữ Kenya',
    viDescription:
      'Cà phê hiếm từ Kenya với hương vị đặc trưng. Ghi chú của cà chua đen và cam.',
    viSeoTitle: 'Mua Cà Phê Kenya Reserve - Hàng Quý Hiếm',
    viSeoDescription: 'Cà phê Kenya hiếm có với hương vị độc đáo.',
  },
};

export default async function run({ container }: ExecArgs) {
  const productModule = container.resolve(Modules.PRODUCT) as any;

  try {
    console.info('[Contentful Seed] Starting Contentful product seeding...');

    // Get list of products
    const products = await productModule.listProducts(
      { status: 'published' },
      { take: 100 }
    );

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
        await syncProductToContentfulWorkflow(container).run({
          input: {
            product_id: product.id,
            locales,
          },
        });

        console.info(`[Contentful Seed] ✓ Synced ${product.title} to Contentful`);
        syncedCount++;
      } catch (error) {
        console.error(`[Contentful Seed] ✗ Failed to sync ${product.handle}:`, error);
        failedCount++;
      }
    }

    console.info(`\n[Contentful Seed] === Contentful Sync Summary ===`);
    console.info(`[Contentful Seed] ✓ Successfully synced: ${syncedCount}`);
    console.info(`[Contentful Seed] ✗ Failed: ${failedCount}`);
    console.info(
      `[Contentful Seed] ⏭️  Skipped: ${products.length - syncedCount - failedCount}`
    );
    console.info(`[Contentful Seed] Total: ${products.length}`);
  } catch (error) {
    console.error('[Contentful Seed] Contentful seeding failed:', error);
    throw error;
  }
}
