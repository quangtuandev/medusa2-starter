# Medusa 2.18 Product Translations Design

## Goal

Upgrade the Medusa backend, Medusa-dependent workspace packages, and storefront SDK/types to Medusa 2.18, then provide first-class English and Vietnamese product localization across Medusa Admin, Store API, and storefront.

This implementation starts with new translation records. It does not migrate or delete legacy Contentful entries or product metadata translations.

## Supported Locales and Fallback

- Supported locales are `en-US` and `vi-VN`.
- Existing storefront language values map `en` to `en-US` and `vi` to `vi-VN`.
- The original value stored on a Medusa resource is the fallback when a requested translation is missing.
- Newly created products should use English as their original content so the fallback is deterministic.

## Dependency Upgrade

All version-coupled Medusa packages must use the same 2.18 release line:

- Backend: `@medusajs/admin-sdk`, `@medusajs/cli`, `@medusajs/framework`, `@medusajs/js-sdk`, `@medusajs/medusa`, `@medusajs/types`, and `@medusajs/test-utils`.
- PayPal workspace: its Medusa framework, admin, CLI, icons, core, types/test dependencies must be aligned where those packages follow Medusa's unified versioning. Medusa UI remains on its independently versioned compatible release.
- Storefront: `@medusajs/js-sdk` and `@medusajs/types`.

The package manager lockfile is regenerated once after all manifests are updated. Builds and type checks determine whether custom PayPal integration APIs require compatibility changes.

## Native Translation Module

The Medusa configuration enables the `translation` feature flag and registers `@medusajs/medusa/translation`. Database migrations create the Translation Module tables and links.

Native translations cover Medusa's supported product resources and fields, including:

- Product: `title`, `subtitle`, `description`, and `material`.
- Product variants: `title` and `material`.
- Product options and values.
- Product collections, categories, tags, and types where supported by Medusa 2.18.

Administrators configure `en-US` and `vi-VN` as supported store locales and manage these translations through Medusa Admin's built-in translation screens.

## Custom Product Content Module

A new `product-content` module owns the four storefront-specific fields:

- `notes`
- `ingredients`
- `precautions_of_use`
- `application_tips`

The `ProductContent` model contains an ID, a unique product reference, and those four text fields. Each content field is marked `.translatable()`. A module link associates one Product record with at most one ProductContent record.

The custom model is the only new source of truth for these fields. The implementation does not read localized versions from product metadata.

## Admin Flow

A product detail widget provides the original English values for the four custom fields and creates or updates the product's ProductContent record through dedicated Admin API routes. The model's translatable declarations make it available in Medusa Admin's native translation management interface, where Vietnamese values can be entered.

Validation rules:

- The product ID must reference an existing product.
- At most one ProductContent record may exist per product.
- All four fields accept empty text so content can be added incrementally.
- API errors surface in the widget without losing unsaved form state.

## Store API

Core `/store` product, collection, and category routes use Medusa 2.18 localization automatically. The storefront passes either the `locale` query parameter or `x-medusa-locale`; server-side loaders use the query parameter to avoid shared mutable SDK locale state.

A localized Store API route retrieves ProductContent through Query with `req.locale`, returning the four custom fields in the requested locale. It requires the normal publishable API key and returns:

- `404` when the product or its ProductContent record does not exist.
- `200` with localized fields when content exists.
- Original field values when a requested translation is missing, matching Medusa fallback behavior.

The old Contentful-backed `/store/products/:id/localized` path is no longer consumed by the storefront. Legacy code and data may remain in place if other features still depend on Contentful; it is outside this change's migration scope.

## Storefront Data Flow

The storefront derives the Medusa locale from its existing i18n language and passes it through every product-related server fetch:

1. The language switcher submits both region and language to the existing region action. The action validates `en`/`vi`, persists the existing `lng` cookie, and updates the cart with the mapped Medusa locale. Route loaders read the same `lng` cookie, defaulting to `en`.
2. `fetchProducts`, individual product retrieval, collections, and categories include `locale` in Store API requests.
3. Cache keys include the locale so English and Vietnamese responses never share cached content.
4. Product list and detail components render the localized core fields returned by Medusa without client-side metadata switching.
5. Product detail loaders retrieve localized ProductContent and pass it into `ProductTemplate`.
6. Cart creation uses the locale mapped from the `lng` cookie, and language changes update the existing cart locale so line-item titles remain localized through checkout and order creation.

The storefront language switch triggers navigation/revalidation as needed so server-loaded product content changes immediately.

## Legacy Behavior Removed from Product Rendering

Product rendering stops reading these metadata keys:

- `description_vi`
- `notes`, `notes_vi`
- `ingredients`, `ingredients_vi`
- `precautions_of_use`, `precautions_of_use_vi`
- `application_tips`, `application_tips_vi`

The old Contentful localized-product hook is not used by the new product flow. No legacy values are copied, transformed, or deleted.

## Error Handling

- Missing translations fall back to original content.
- Missing custom ProductContent hides the optional custom-content sections without breaking the product page.
- Unsupported storefront language values fall back to `en-US`.
- Admin API validation errors return structured 4xx responses.
- Backend/storefront fetch errors follow existing route error handling and must not silently mix locales in cache.

## Testing and Verification

- Dependency install completes with a consistent lockfile and no Medusa version skew.
- Backend unit/integration tests cover ProductContent creation, uniqueness, update, and localized Store API responses.
- Admin build verifies custom widget compatibility with Medusa 2.18.
- Storefront tests cover language-to-locale mapping, locale-aware cache keys, fallback behavior, and product-content rendering.
- Backend, PayPal workspace, and storefront type checks/builds are run; unrelated pre-existing failures are recorded separately.
- Manual acceptance checks verify:
  - `en-US` and `vi-VN` appear in Medusa Admin.
  - Native product and custom ProductContent translations can be edited.
  - Product lists, collections, product details, variants/options, cart line items, and orders use the selected locale.
  - Switching languages does not display content cached for the other locale.

## Non-Goals

- Migrating or deleting Contentful content.
- Migrating or deleting existing product metadata translations.
- Translating non-product CMS content such as blog posts or pages.
- Adding locales other than `en-US` and `vi-VN`.
