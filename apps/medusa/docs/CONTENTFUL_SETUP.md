# Contentful Localization Integration Guide

This guide explains how to set up and use Contentful for managing localized product data in Medusa.

## Overview

The Contentful integration allows you to:
- Store localized product titles, descriptions, and SEO metadata
- Support multiple languages (English and Vietnamese by default)
- Sync products from Medusa to Contentful automatically
- Query localized content from the storefront
- Manage translations through the Contentful UI

## Prerequisites

1. A Contentful account (https://www.contentful.com)
2. A Contentful space created
3. Content Delivery API and Content Management API tokens

## Setup Steps

### 1. Create Contentful Space and Tokens

1. Log in to [Contentful](https://www.contentful.com)
2. Create a new Space (or use existing one)
3. Go to **Settings → API keys**
4. Create a new API key with:
   - **Name**: Medusa Integration
   - **Content Delivery API access token**: Copy this (read-only)
   - **Content Management API access token**: Copy this (for publishing)
5. Keep both tokens safe

### 2. Configure Environment Variables

Add Contentful credentials to `apps/medusa/.env`:

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_cma_token_here
CONTENTFUL_ENVIRONMENT=master
```

### 3. Initialize Content Types and Locales

When the Medusa app starts with Contentful credentials configured:

1. Content types are automatically created:
   - **Product**: For product translations
   - **Product Variant**: For variant translations

2. Locales are automatically enabled:
   - **en-US**: English (default/fallback)
   - **vi**: Vietnamese

### 4. Start Medusa and Sync Products

```bash
# Install dependencies (Contentful packages already included)
yarn install

# Start development server
yarn dev

# Run migrations
yarn migrate

# Sync existing products to Contentful
yarn seed
```

## Using the Module

### 1. Sync a Product to Contentful

**Admin API Endpoint**: `POST /admin/contentful/sync`

Request body:
```json
{
  "product_id": "prod_123456",
  "locales": {
    "en-US": {
      "title": "Premium Coffee Blend",
      "description": "A smooth and balanced blend of African and South American beans",
      "seoTitle": "Buy Premium Coffee Blend Online",
      "seoDescription": "High-quality coffee blend delivered fresh to your door"
    },
    "vi": {
      "title": "Hỗn Hợp Cà Phê Cao Cấp",
      "description": "Một hỗn hợp mịn và cân bằng giữa các hạt từ Châu Phi và Nam Mỹ",
      "seoTitle": "Mua Hỗn Hợp Cà Phê Cao Cấp Trực Tuyến",
      "seoDescription": "Cà phê chất lượng cao được giao tươi đến cửa bạn"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "medusaId": "prod_123456",
    "contentfulId": "entry_id_here",
    "synced": true
  }
}
```

### 2. List Products to Sync

**Admin API Endpoint**: `GET /admin/contentful/sync/products`

Query parameters:
- `limit`: Number of products (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

Response:
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

### 3. Fetch Localized Product Data

**Store API Endpoint**: `GET /store/products/:id/localized`

Query parameters:
- `locale`: Locale code (default: en-US)

Example:
```bash
curl "http://localhost:7901/store/products/prod_123/localized?locale=vi"
```

Response:
```json
{
  "product_id": "prod_123",
  "locale": "vi",
  "product": {
    "title": "Hỗn Hợp Cà Phê Cao Cấp",
    "description": "Một hỗn hợp mịn và cân bằng",
    "seoTitle": "Mua Hỗn Hợp Cà Phê Cao Cấp",
    "seoDescription": "Cà phê chất lượng cao được giao tươi"
  },
  "variants": [
    {
      "medusaVariantId": "variant_123",
      "title": "Whole Bean",
      "sku": "COFFEE-WHOLE"
    }
  ]
}
```

### 4. Get Available Locales

**Store API Endpoint**: `GET /store/contentful/locales`

Response:
```json
{
  "locales": ["en-US", "vi"]
}
```

## Frontend Integration

### Using the Hook

```tsx
import { useLocalizedProduct } from '@app/hooks/use-localized-product';

function ProductPage({ productId }: { productId: string }) {
  const locale = 'vi'; // Get from i18n
  const { data, isLoading, error } = useLocalizedProduct(productId, locale);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null; // No localized data

  return (
    <div>
      <h1>{data.product.title}</h1>
      <p>{data.product.description}</p>
      <ul>
        {data.variants.map((v) => (
          <li key={v.medusaVariantId}>{v.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Using the Component

```tsx
import { LocalizedProductInfo } from '@app/components/product/localized-product-info';

function ProductPage({ productId }: { productId: string }) {
  const [locale, setLocale] = useState('en-US');

  return (
    <LocalizedProductInfo
      productId={productId}
      currentLocale={locale}
      onLocaleChange={setLocale}
    />
  );
}
```

## Workflow: Publishing Products

The `sync-product-to-contentful` workflow handles:

1. Fetching product details from Medusa
2. Preparing localized data
3. Publishing to Contentful
4. Creating/updating entries with proper locales

You can trigger this workflow manually through the admin API or set it up to run automatically on product creation/update events.

## Database Schema

### product_contentful_link Table

```sql
CREATE TABLE product_contentful_link (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  contentful_entry_id TEXT NOT NULL,
  contentful_locale TEXT DEFAULT 'en-US',
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, contentful_locale),
  INDEX on (product_id),
  INDEX on (contentful_entry_id)
);
```

## Features

### Localization
- ✅ Multi-language support (easily expandable)
- ✅ Fallback locale handling
- ✅ Rich text descriptions
- ✅ SEO optimization fields (meta title, description)

### Sync Management
- ✅ Manual sync via admin API
- ✅ Automatic content type creation
- ✅ Automatic locale setup
- ✅ Product-Contentful link tracking

### Data Retrieval
- ✅ Query by product ID and locale
- ✅ Variant localization
- ✅ Fallback to default locale if translation missing
- ✅ Error handling and logging

## Troubleshooting

### Contentful credentials not working

1. Verify Space ID and tokens in Contentful dashboard
2. Check that Content Management API is enabled for your token
3. Ensure environment variable names are correct
4. Check logs: `yarn dev` should show Contentful initialization messages

### Content types not created

1. Ensure Contentful credentials are set before starting app
2. Check user permissions in Contentful (need admin or editor role)
3. Verify token has Content Management API access

### Products not syncing

1. Verify product exists in Medusa database
2. Check that Contentful space has the required locales
3. Review logs for specific errors: `yarn dev`
4. Try manual sync through admin API with simple data first

## Best Practices

1. **Test with English first**: En-US is the fallback locale
2. **Use meaningful handles**: Product handles are immutable in Contentful
3. **Set SEO fields**: Include seoTitle and seoDescription for each locale
4. **Regular backups**: Export content from Contentful periodically
5. **Update content types**: If you add new fields, update both loaders.ts and service.ts

## Security

- Store API tokens in environment variables (never commit to git)
- Use separate tokens for read (Delivery API) and write (Management API)
- Consider using a separate Contentful environment for staging/production
- Monitor token usage in Contentful dashboard

## Further Reading

- [Contentful API Documentation](https://www.contentful.com/developers/docs/)
- [Medusa Module Development](https://docs.medusajs.com/development/modules)
- [Multi-language in Headless Commerce](https://www.contentful.com/blog/multi-language/)
