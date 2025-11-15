# Product Localization with Contentful

## Quick Start

This project now supports product localization through Contentful integration. Products can have translations in multiple languages (English and Vietnamese by default).

## What's Been Implemented

### Backend (Medusa)

1. **Contentful Module** (`apps/medusa/src/modules/contentful/`)
   - Service to manage Contentful API interactions
   - Loaders to initialize Contentful and create content types
   - Database model to track product-Contentful links
   - Migration to create the link table

2. **Workflows**
   - `sync-product-to-contentful`: Publishes products with localizations to Contentful

3. **API Endpoints**

   **Store API:**
   - `GET /store/products/:id/localized?locale=vi` - Get localized product data
   - `GET /store/contentful/locales` - Get available locales

   **Admin API:**
   - `POST /admin/contentful/sync` - Manually sync product to Contentful
   - `GET /admin/contentful/sync/products` - List products to sync

4. **Seed Script**
   - `apps/medusa/src/scripts/seed-contentful.ts` - Demo seeding with Vietnamese translations

### Frontend (Storefront)

1. **Hook** (`app/hooks/use-localized-product.ts`)
   - `useLocalizedProduct()` - Fetch localized product data
   - `useAvailableLocales()` - Get list of available locales

2. **Component** (`app/components/product/localized-product-info.tsx`)
   - `LocalizedProductInfo` - Display localized product with locale selector

## Setup

### 1. Configure Contentful Credentials

Add to `apps/medusa/.env`:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_cma_token
CONTENTFUL_ENVIRONMENT=master
```

Get these from your [Contentful workspace](https://app.contentful.com) → Settings → API keys

### 2. Ensure Dependencies Are Installed

Contentful packages are already in `package.json`:
```bash
yarn install
```

### 3. Start Backend

```bash
cd apps/medusa
yarn dev
```

The app will automatically:
- Initialize Contentful connection
- Create content types (Product, Product Variant)
- Enable locales (en-US, vi)

### 4. Run Migrations

```bash
# From monorepo root
yarn run migrate
```

This creates the `product_contentful_link` table.

### 5. Seed Data with Localizations

```bash
# From medusa app directory
yarn medusa exec ./src/scripts/seed-contentful.ts
```

This syncs existing coffee products with Vietnamese translations to Contentful.

## Usage Examples

### Backend: Sync a Product

```bash
curl -X POST http://localhost:7901/admin/contentful/sync \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123",
    "locales": {
      "en-US": {
        "title": "Premium Coffee",
        "description": "High-quality coffee blend"
      },
      "vi": {
        "title": "Cà Phê Cao Cấp",
        "description": "Hỗn hợp cà phê chất lượng cao"
      }
    }
  }'
```

### Frontend: Display Localized Product

```tsx
import { LocalizedProductInfo } from '@app/components/product/localized-product-info';
import { useState } from 'react';

export function ProductPage({ productId }: { productId: string }) {
  const [locale, setLocale] = useState('en-US');

  return (
    <LocalizedProductInfo
      productId={productId}
      currentLocale={locale}
      onLocaleChange={setLocale}
      className="mb-6"
    />
  );
}
```

Or use the hook directly:

```tsx
import { useLocalizedProduct } from '@app/hooks/use-localized-product';

export function ProductInfo({ productId }: { productId: string }) {
  const { data, isLoading, error } = useLocalizedProduct(productId, 'vi');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>{data.product.title}</h1>
      <p>{data.product.description}</p>
    </div>
  );
}
```

## Architecture

```
Medusa Backend
    ↓
contentful module
    ├── service.ts (API interactions)
    ├── loaders.ts (initialization)
    ├── models.ts (database schema)
    └── migrations/
    ↓
Contentful API
    ├── Product content type
    ├── ProductVariant content type
    ├── Locales (en-US, vi)
    └── Entries (product translations)
    ↓
Store API Endpoints
    ├── GET /store/products/:id/localized
    └── GET /store/contentful/locales
    ↓
React Frontend
    ├── use-localized-product hook
    ├── useAvailableLocales hook
    └── LocalizedProductInfo component
```

## Features

### ✅ Multi-Language Support
- English (en-US) - default/fallback
- Vietnamese (vi)
- Easily expandable to more languages

### ✅ Automatic Setup
- Content types created on app start
- Locales enabled automatically
- No manual Contentful configuration needed (if credentials provided)

### ✅ Product Sync
- Manual sync via admin API
- Support for product variants
- Localized variant titles and SKUs
- SEO fields (title, description)

### ✅ Flexible Data Retrieval
- Query by product ID and locale
- Fallback to default locale if translation missing
- Get all variants with translations
- Error handling and graceful degradation

### ✅ Frontend Integration
- Custom React hooks for data fetching
- Pre-built component with locale selector
- i18n compatibility
- Loading and error states

## API Reference

### Store API: Get Localized Product

```
GET /store/products/:id/localized?locale=vi
```

**Response:**
```json
{
  "product_id": "prod_123",
  "locale": "vi",
  "product": {
    "title": "Tên Sản Phẩm",
    "description": "Mô tả sản phẩm",
    "seoTitle": "SEO Title",
    "seoDescription": "SEO Description"
  },
  "variants": [
    {
      "medusaVariantId": "variant_123",
      "title": "Tên Biến Thể",
      "sku": "SKU-123"
    }
  ]
}
```

### Store API: Get Available Locales

```
GET /store/contentful/locales
```

**Response:**
```json
{
  "locales": ["en-US", "vi"]
}
```

### Admin API: Sync Product

```
POST /admin/contentful/sync
```

**Request Body:**
```json
{
  "product_id": "prod_123",
  "locales": {
    "en-US": {
      "title": "Product Title",
      "description": "Description",
      "seoTitle": "SEO Title",
      "seoDescription": "SEO Description"
    },
    "vi": {
      "title": "Tên Sản Phẩm",
      "description": "Mô tả",
      "seoTitle": "Tiêu Đề SEO",
      "seoDescription": "Mô Tả SEO"
    }
  }
}
```

### Admin API: List Products to Sync

```
GET /admin/contentful/sync/products?limit=20&offset=0
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "title": "Product Title",
      "handle": "product-handle",
      "status": "published"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## File Structure

```
apps/medusa/
├── src/
│   ├── modules/
│   │   └── contentful/
│   │       ├── index.ts
│   │       ├── service.ts
│   │       ├── loaders.ts
│   │       ├── initialize.ts
│   │       ├── models.ts
│   │       └── migrations/
│   │           └── Migration20241113000000_CreateProductContentfulLink.ts
│   ├── api/
│   │   ├── store/
│   │   │   ├── products/[id]/localized.ts
│   │   │   └── contentful/locales.ts
│   │   └── admin/
│   │       └── contentful/sync.ts
│   ├── workflows/
│   │   └── sync-product-to-contentful.ts
│   └── scripts/
│       └── seed-contentful.ts
├── docs/
│   └── CONTENTFUL_SETUP.md
└── .env.template

apps/storefront/
├── app/
│   ├── hooks/
│   │   └── use-localized-product.ts
│   └── components/
│       └── product/
│           └── localized-product-info.tsx
```

## Troubleshooting

### "Contentful not configured"

**Problem:** The app runs fine but doesn't integrate with Contentful

**Solution:** Add Contentful credentials to `.env` file and restart the app

### "Failed to initialize Contentful"

**Problem:** Error during Contentful module initialization

**Solution:**
1. Check credentials in `.env` are correct
2. Verify Space ID and tokens in Contentful dashboard
3. Check token has Content Management API permissions
4. Review logs in terminal output

### "Product not found in Contentful"

**Problem:** `GET /store/products/:id/localized` returns 404

**Solution:**
1. Make sure product was synced using `/admin/contentful/sync` endpoint
2. Verify Contentful entries were published
3. Check that locale code matches available locales

### "Module 'contentful-management' not found"

**Problem:** TypeScript or runtime error about missing module

**Solution:**
```bash
yarn install
```

## Next Steps

### 1. Add More Languages

Edit `apps/medusa/src/modules/contentful/loaders.ts`:

```typescript
const LOCALES = ['en-US', 'vi', 'es', 'fr']; // Add your languages
```

### 2. Add More Fields

In loaders.ts, add fields to content type creation:

```typescript
{
  id: 'richDescription',
  name: 'Rich Description',
  type: 'RichText',
  localized: true,
},
```

And update service.ts to handle new fields.

### 3. Webhook Sync (Contentful → Medusa)

Set up Contentful webhooks to sync translations back to Medusa when published in Contentful.

### 4. Admin Dashboard

Create an admin widget similar to product-widget.tsx to manage translations directly in Medusa admin.

## Additional Resources

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Medusa Module Development](https://docs.medusajs.com/development/modules)
- [API Documentation - Detailed Guide](apps/medusa/docs/CONTENTFUL_SETUP.md)

## Support

For detailed technical setup, see: [Contentful Setup Documentation](apps/medusa/docs/CONTENTFUL_SETUP.md)
