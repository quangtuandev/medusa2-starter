/**
 * CONTENTFUL SYNC BUTTON USAGE GUIDE
 * ==================================
 *
 * File: apps/medusa/src/admin/widgets/contentful-sync-button.tsx
 *
 * This component provides a user-friendly button to sync Medusa products
 * to Contentful CMS directly from the admin panel.
 *
 * BASIC USAGE:
 * ============
 *
 * import { ContentfulSyncButton } from './contentful-sync-button'
 *
 * export default function ProductDetailPage({ product }) {
 *   return (
 *     <div>
 *       <h1>{product.title}</h1>
 *       <ContentfulSyncButton productId={product.id} />
 *     </div>
 *   )
 * }
 *
 * WITH CUSTOM LOCALES:
 * ====================
 *
 * const locales = {
 *   'en-US': {
 *     title: 'Premium Coffee Blend',
 *     description: 'High-quality coffee blend for espresso',
 *     seoTitle: 'Premium Coffee Blend | Coffee Shop',
 *     seoDescription: 'Buy our premium coffee blend online',
 *   },
 *   'vi': {
 *     title: 'Hỗn Hợp Cà Phê Cao Cấp',
 *     description: 'Hỗn hợp cà phê chất lượng cao cho espresso',
 *     seoTitle: 'Hỗn Hợp Cà Phê Cao Cấp | Cửa Hàng Cà Phê',
 *     seoDescription: 'Mua hỗn hợp cà phê cao cấp của chúng tôi trực tuyến',
 *   },
 * }
 *
 * <ContentfulSyncButton
 *   productId={product.id}
 *   productTitle={product.title}
 *   locales={locales}
 *   onSyncComplete={(result) => {
 *     console.log('Product synced:', result)
 *     // Refresh product data or show notification
 *   }}
 * />
 *
 * INTEGRATION WITH MEDUSA ADMIN:
 * ================================
 *
 * To add the button to the product detail page:
 *
 * 1. Create a new widget in your admin customization
 *
 * 2. Example widget file (if using custom admin extensions):
 *    apps/medusa/src/admin/extensions/product-detail-contentful.tsx
 *
 *    import { AdminPages } from '@medusajs/admin-sdk'
 *    import { ContentfulSyncButton } from '../widgets/contentful-sync-button'
 *
 *    const productDetailExtension = {
 *      name: 'contentful-sync-widget',
 *      zone: AdminPages.Products.ProductDetail.Sidebar.After,
 *      component: ContentfulSyncButton,
 *    }
 *
 *    export default productDetailExtension
 *
 * 3. Or add directly to your admin panel page:
 *
 *    In your product detail admin page component:
 *
 *    import ContentfulSyncButton from './widgets/contentful-sync-button'
 *
 *    export default function ProductDetail() {
 *      const { product } = useProduct()
 *
 *      return (
 *        <div>
 *          {/* Existing product details */}
 *          <ContentfulSyncButton
 *            productId={product.id}
 *            productTitle={product.title}
 *          />
 *        </div>
 *      )
 *    }
 *
 * COMPONENT PROPS:
 * =================
 *
 * productId (required)
 *   Type: string
 *   Description: The Medusa product ID to sync
 *   Example: "prod_123456"
 *
 * productTitle (optional)
 *   Type: string
 *   Description: Product title (used as default title if no locales provided)
 *   Default: "Product"
 *   Example: "Premium Coffee Blend"
 *
 * locales (optional)
 *   Type: { [key: string]: { title?, description?, seoTitle?, seoDescription? } }
 *   Description: Multi-locale content to sync to Contentful
 *   Example:
 *   {
 *     "en-US": { title: "...", description: "..." },
 *     "vi": { title: "...", description: "..." }
 *   }
 *
 * onSyncComplete (optional)
 *   Type: (result: any) => void
 *   Description: Callback function called when sync completes successfully
 *   Example: (result) => showNotification("Product synced!")
 *
 * COMPONENT FEATURES:
 * ====================
 *
 * 1. Sync Button
 *    - Syncs product to Contentful
 *    - Shows loading state while syncing
 *    - Displays success/error messages
 *
 * 2. Check Status Button
 *    - Verifies if product is synced to Contentful
 *    - Shows confirmation badge if synced
 *
 * 3. Remove Button
 *    - Removes product from Contentful
 *    - Requires confirmation to prevent accidents
 *    - Shows success/error feedback
 *
 * 4. Status Indicators
 *    - Badge showing sync status (Synced/Error)
 *    - Success notification (green)
 *    - Error notification (red)
 *    - Auto-dismiss after 5 seconds
 *
 * 5. Responsive Design
 *    - Styled with inline styles for compatibility
 *    - Works with Medusa UI components
 *    - Mobile-friendly button layout
 *
 * AUTHENTICATION:
 * ================
 *
 * The button automatically retrieves the admin token from:
 * 1. localStorage.getItem('admin_token')
 * 2. Falls back to empty string if not found
 *
 * Make sure your admin panel stores the auth token in localStorage
 * with the key 'admin_token' after login.
 *
 * If using different auth mechanism, modify the token retrieval:
 *
 *   const token = useAuthToken() // Or your custom hook
 *
 * ERROR HANDLING:
 * ================
 *
 * The button handles various error scenarios:
 *
 * - Network errors: "An error occurred"
 * - API validation errors: Shows API error message
 * - Missing product: "Product not found"
 * - Contentful service down: "Contentful service not available"
 *
 * Errors are displayed in red box below buttons and logged to console.
 *
 * STYLING CUSTOMIZATION:
 * =======================
 *
 * The component uses inline styles for maximum compatibility.
 * To customize styling:
 *
 * Option 1: Extend the component
 *
 *   export const CustomContentfulButton = (props) => {
 *     return (
 *       <div style={{ ...customStyles }}>
 *         <ContentfulSyncButton {...props} />
 *       </div>
 *     )
 *   }
 *
 * Option 2: Modify the component directly
 *
 *   Change backgroundColor, borderRadius, padding values in the main div
 *
 * TESTING:
 * =========
 *
 * Test scenarios:
 *
 * 1. Successful sync
 *    - Click "Sync to Contentful"
 *    - Should show loading state
 *    - Should display success message
 *    - Verify product appears in Contentful
 *
 * 2. Failed sync
 *    - Disable Contentful service
 *    - Click "Sync to Contentful"
 *    - Should display error message
 *
 * 3. Check status
 *    - After syncing, click "Check Status"
 *    - Should show "Synced" badge
 *
 * 4. Remove product
 *    - Click "Remove from Contentful"
 *    - Confirm deletion
 *    - Should show success message
 *    - Verify product removed from Contentful
 *
 * TROUBLESHOOTING:
 * =================
 *
 * Issue: Button not visible
 * Solution: Ensure component is imported and rendered in the correct page
 *
 * Issue: Sync fails with 401 error
 * Solution: Check that admin token is stored in localStorage['admin_token']
 *
 * Issue: Sync fails with 503 error
 * Solution: Verify Contentful credentials in .env:
 *           - CONTENTFUL_SPACE_ID
 *           - CONTENTFUL_ACCESS_TOKEN
 *           - CONTENTFUL_ENVIRONMENT
 *
 * Issue: Synced data not showing locales
 * Solution: Make sure to pass locales prop with all desired language versions
 *
 * ADVANCED USAGE:
 * ================
 *
 * Bulk sync multiple products:
 *
 *   const handleBulkSync = async () => {
 *     const response = await fetch('/admin/contentful/sync/bulk', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': `Bearer ${token}`,
 *       },
 *       body: JSON.stringify({
 *         product_ids: ['prod_1', 'prod_2', 'prod_3'],
 *         locales: { 'en-US': { ... }, 'vi': { ... } }
 *       })
 *     })
 *     const result = await response.json()
 *     console.log(`Synced: ${result.summary.successful}, Failed: ${result.summary.failed}`)
 *   }
 *
 * Get locales from Contentful:
 *
 *   const response = await fetch('/store/contentful/locales')
 *   const { locales } = await response.json()
 *   // Use locales to populate locale selector
 */

export {};
