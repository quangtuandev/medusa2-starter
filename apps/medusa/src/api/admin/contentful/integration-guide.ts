/**
 * CONTENTFUL INTEGRATION GUIDE
 * ===========================
 *
 * This file provides integration instructions for adding Contentful sync button
 * to the Medusa Admin Panel. This is NOT executable code but documentation.
 *
 * API ENDPOINTS:
 * ==============
 *
 * 1. SYNC SINGLE PRODUCT
 *    POST /admin/contentful/sync
 *    Body:
 *    {
 *      "product_id": "prod_123",
 *      "locales": {
 *        "en-US": {
 *          "title": "Product Title",
 *          "description": "Product Description",
 *          "seoTitle": "SEO Title",
 *          "seoDescription": "SEO Description"
 *        },
 *        "vi": {
 *          "title": "Tên Sản Phẩm",
 *          "description": "Mô tả Sản Phẩm",
 *          "seoTitle": "Tiêu đề SEO",
 *          "seoDescription": "Mô tả SEO"
 *        }
 *      }
 *    }
 *
 * 2. BULK SYNC MULTIPLE PRODUCTS
 *    POST /admin/contentful/sync/bulk
 *    Body:
 *    {
 *      "product_ids": ["prod_123", "prod_456", "prod_789"],
 *      "locales": {
 *        "en-US": { "title": "...", "description": "..." },
 *        "vi": { "title": "...", "description": "..." }
 *      }
 *    }
 *
 * 3. GET AVAILABLE PRODUCTS FOR SYNC
 *    GET /admin/contentful/sync/products
 *    Query Params:
 *      - limit: Number of products (default: 20, max: 100)
 *      - offset: Pagination offset (default: 0)
 *      - q: Search query for product title/handle
 *
 * 4. CHECK SYNC STATUS
 *    GET /admin/contentful/sync/status/:productId
 *    Response:
 *    {
 *      "product_id": "prod_123",
 *      "synced": true,
 *      "data": {
 *        "title": "Product Title",
 *        "description": "Product Description",
 *        "seoTitle": "SEO Title",
 *        "seoDescription": "SEO Description"
 *      }
 *    }
 *
 * 5. REMOVE PRODUCT FROM CONTENTFUL
 *    DELETE /admin/contentful/sync/:productId
 *    Response:
 *    {
 *      "success": true,
 *      "message": "Product removed from Contentful"
 *    }
 *
 * STOREFRONT ENDPOINTS (for fetching localized content):
 * =======================================================
 *
 * 1. GET LOCALIZED PRODUCT
 *    GET /store/contentful/products/:id/localized
 *    Query Params:
 *      - locale: Contentful locale code (default: en-US)
 *    Response:
 *    {
 *      "product": { "id", "title", "handle", "description" },
 *      "contentful": { "title", "description", "seoTitle", "seoDescription" },
 *      "locale": "en-US"
 *    }
 *
 * 2. GET LOCALIZED VARIANTS
 *    GET /store/contentful/products/:id/variants
 *    Query Params:
 *      - locale: Contentful locale code (default: en-US)
 *    Response:
 *    {
 *      "product_id": "prod_123",
 *      "locale": "en-US",
 *      "variants": [
 *        { "id": "variant_123", "sku": "SKU123", "synced": true }
 *      ]
 *    }
 *
 * 3. GET AVAILABLE LOCALES
 *    GET /store/contentful/locales
 *    Response:
 *    {
 *      "locales": ["en-US", "vi"]
 *    }
 *
 * ADMIN UI BUTTON INTEGRATION:
 * ============================
 *
 * To add a "Sync to Contentful" button to the product detail page:
 *
 * 1. Create button component: apps/medusa/src/admin/contentful-sync-button.tsx
 *
 *    import { useState } from "react"
 *    import { Button } from "@medusajs/ui"
 *
 *    interface ContentfulSyncButtonProps {
 *      productId: string
 *      onSyncComplete?: () => void
 *    }
 *
 *    export const ContentfulSyncButton = ({
 *      productId,
 *      onSyncComplete,
 *    }: ContentfulSyncButtonProps) => {
 *      const [isLoading, setIsLoading] = useState(false)
 *      const [error, setError] = useState<string | null>(null)
 *      const [success, setSuccess] = useState(false)
 *
 *      const handleSync = async () => {
 *        setIsLoading(true)
 *        setError(null)
 *        setSuccess(false)
 *
 *        try {
 *          const response = await fetch(
 *            "/admin/contentful/sync",
 *            {
 *              method: "POST",
 *              headers: { "Content-Type": "application/json" },
 *              body: JSON.stringify({
 *                product_id: productId,
 *                locales: {
 *                  "en-US": { title: "", description: "" },
 *                  "vi": { title: "", description: "" }
 *                }
 *              })
 *            }
 *          )
 *
 *          if (!response.ok) {
 *            throw new Error("Failed to sync product")
 *          }
 *
 *          const data = await response.json()
 *          setSuccess(true)
 *          onSyncComplete?.()
 *          setTimeout(() => setSuccess(false), 3000)
 *        } catch (err) {
 *          setError(err instanceof Error ? err.message : "An error occurred")
 *        } finally {
 *          setIsLoading(false)
 *        }
 *      }
 *
 *      return (
 *        <div>
 *          <Button
 *            onClick={handleSync}
 *            disabled={isLoading}
 *            variant="secondary"
 *          >
 *            {isLoading ? "Syncing..." : "Sync to Contentful"}
 *          </Button>
 *          {error && <p style={{ color: "red" }}>{error}</p>}
 *          {success && <p style={{ color: "green" }}>Product synced successfully!</p>}
 *        </div>
 *      )
 *    }
 *
 * 2. Add to product detail page widget
 *
 *    In your product detail admin widget:
 *
 *    import { ContentfulSyncButton } from "./contentful-sync-button"
 *
 *    export default function ProductDetailWidget({ product }) {
 *      return (
 *        <div>
 *          {/* Other product details */}
 *          <ContentfulSyncButton productId={product.id} />
 *        </div>
 *      )
 *    }
 *
 * ENVIRONMENT VARIABLES:
 * ======================
 *
 * Add to your .env file:
 *
 *   CONTENTFUL_SPACE_ID=your_space_id
 *   CONTENTFUL_ACCESS_TOKEN=your_management_token
 *   CONTENTFUL_ENVIRONMENT=master
 *
 * WORKFLOW ARCHITECTURE:
 * ======================
 *
 * The sync workflow (syncProductToContentfulWorkflow) performs these steps:
 *
 *   1. fetchProductStep
 *      - Retrieves product from Medusa with variants and relations
 *      - Validates product exists
 *
 *   2. prepareContentfulDataStep
 *      - Transforms Medusa product data to Contentful format
 *      - Merges localized content from request
 *      - Creates default locale if not provided
 *
 *   3. publishProductToContentfulStep
 *      - Creates or updates product entry in Contentful
 *      - Publishes entry to make it live
 *      - Returns Contentful entry ID
 *
 *   4. syncVariantsStep
 *      - Processes product variants
 *      - Creates variant entries in Contentful (optional)
 *      - Returns variant sync status
 *
 * ERROR HANDLING:
 * ================
 *
 * All endpoints include comprehensive error handling:
 *
 *   - 400: Bad Request (validation errors, missing required fields)
 *   - 404: Not Found (product not found)
 *   - 500: Internal Server Error (Contentful API issues)
 *   - 503: Service Unavailable (Contentful service not configured)
 *
 * LOCALIZATION SUPPORT:
 * =====================
 *
 * The integration supports multi-language content:
 *
 * Supported locales by default: en-US, vi
 *
 * To add more locales:
 * 1. Edit apps/medusa/src/modules/contentful/loaders.ts
 * 2. Update LOCALES array:
 *    const LOCALES = ['en-US', 'vi', 'fr', 'de']
 * 3. Restart the application
 *
 * CONTENT TYPE STRUCTURE:
 * =======================
 *
 * Products (in Contentful):
 *   - medusaId (Symbol, required): Medusa product ID
 *   - title (Symbol, localized, required): Product title
 *   - description (Text, localized): Product description
 *   - handle (Symbol, required): URL-friendly identifier
 *   - seoTitle (Symbol, localized): SEO title tag
 *   - seoDescription (Text, localized): SEO meta description
 *
 * ProductVariants (optional):
 *   - medusaVariantId (Symbol, required): Medusa variant ID
 *   - productMedusaId (Symbol, required): Reference to product
 *   - title (Symbol, localized, required): Variant title
 *   - sku (Symbol): Product SKU
 *
 * TESTING THE INTEGRATION:
 * =========================
 *
 * Using curl:
 *
 *   # Single product sync
 *   curl -X POST http://localhost:7901/admin/contentful/sync \
 *     -H "Content-Type: application/json" \
 *     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
 *     -d '{
 *       "product_id": "prod_123",
 *       "locales": {
 *         "en-US": {
 *           "title": "Coffee Blend",
 *           "description": "Premium coffee blend"
 *         },
 *         "vi": {
 *           "title": "Hỗn Hợp Cà Phê",
 *           "description": "Hỗn hợp cà phê cao cấp"
 *         }
 *       }
 *     }'
 *
 *   # List products for sync
 *   curl http://localhost:7901/admin/contentful/sync/products \
 *     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
 *
 *   # Check sync status
 *   curl http://localhost:7901/admin/contentful/sync/status/prod_123 \
 *     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
 */

export {};
