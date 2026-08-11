# Medusa 2.18 Product Translations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the monorepo's Medusa packages to 2.18 and serve English/Vietnamese translations for native product fields and four custom product-content fields through Admin, Store API, and storefront.

**Architecture:** Medusa's native Translation Module localizes core product resources. A custom translatable ProductContent module stores four rich-text fields keyed by product ID; Admin and Store routes expose it, while locale-aware storefront server utilities request localized Medusa responses and isolate caches by locale.

**Tech Stack:** Medusa 2.18, TypeScript, React Router 7, React 19, Jest, Yarn 4, MikroORM/PostgreSQL

## Global Constraints

- Do not create Git commits.
- Do not migrate or delete legacy Contentful data or metadata translations.
- Support only `en-US` and `vi-VN`; map storefront `en`/`vi` values explicitly.
- Preserve unrelated staged and unstaged user changes.
- Original English content is the fallback when a translation is absent.

---

### Task 1: Align Medusa Dependencies and Enable Translation

**Files:**
- Modify: `apps/medusa/package.json`
- Modify: `apps/medusa-paypal/package.json`
- Modify: `apps/storefront/package.json`
- Modify: `apps/medusa/medusa-config.ts`
- Modify: `yarn.lock`

**Interfaces:**
- Produces: a unified Medusa `2.18.x` dependency graph and registered `Modules.TRANSLATION` service.

- [ ] Update every version-coupled `@medusajs/*` dependency in the three manifests to `2.18.0`, leaving independently versioned UI packages unchanged.
- [ ] Run `yarn install` and inspect `yarn why @medusajs/framework` for version skew.
- [ ] Add `{ resolve: "@medusajs/medusa/translation" }` to `modules` and `translation: true` to `featureFlags` while preserving the customer-review flag.
- [ ] Run backend typecheck/build to reveal 2.18 compatibility changes before adding feature code.

### Task 2: Locale Mapping and Cookie Persistence (TDD)

**Files:**
- Create: `apps/storefront/libs/util/locale.ts`
- Create: `apps/storefront/libs/util/locale.test.ts`
- Modify: `apps/storefront/libs/util/server/cookies.server.ts`
- Modify: `apps/storefront/app/routes/api.region.ts`
- Modify: `apps/storefront/app/components/common/LanguageSwitcher/LanguageSwitcher.tsx`

**Interfaces:**
- Produces: `toMedusaLocale(language: string | undefined): "en-US" | "vi-VN"`, `getLanguage(headers): Promise<"en" | "vi">`, and `setLanguage(headers, language)`.

- [ ] Write failing tests asserting `en -> en-US`, `vi -> vi-VN`, and unknown/undefined -> `en-US`.
- [ ] Run the focused Jest test and confirm failure because `locale.ts` is absent.
- [ ] Implement the pure mapping and rerun until green.
- [ ] Add `lng` cookie helpers; extend region validation to accept `language`, persist it, and update an existing cart with both `region_id` and `locale`.
- [ ] Change the switcher submission to send `language` alongside `regionId` and trigger route revalidation through the existing fetcher navigation lifecycle.

### Task 3: Translatable ProductContent Module and APIs (TDD)

**Files:**
- Create: `apps/medusa/src/modules/product-content/models/product-content.ts`
- Create: `apps/medusa/src/modules/product-content/models/index.ts`
- Create: `apps/medusa/src/modules/product-content/service.ts`
- Create: `apps/medusa/src/modules/product-content/index.ts`
- Create: `apps/medusa/src/links/product-product-content.ts`
- Create: `apps/medusa/src/api/admin/product-content/route.ts`
- Create: `apps/medusa/src/api/store/products/[id]/content/route.ts`
- Create: `apps/medusa/src/modules/product-content/__tests__/product-content-input.unit.spec.ts`
- Create: `apps/medusa/src/modules/product-content/input.ts`
- Modify: `apps/medusa/medusa-config.ts`

**Interfaces:**
- Produces: ProductContent CRUD service, one-to-one read-only product link, Admin upsert API, localized Store content API.

- [ ] Write failing unit tests for `normalizeProductContentInput`, asserting trimming, empty-string defaults, and rejection of a missing `product_id`.
- [ ] Implement the input normalizer and verify the focused unit test passes.
- [ ] Define `ProductContent` with unique `product_id` and `.translatable()` text fields: `notes`, `ingredients`, `precautions_of_use`, `application_tips`.
- [ ] Register the module and define the read-only link from ProductContent's `product_id` to Product.
- [ ] Implement Admin GET/POST: verify the product exists, retrieve by `product_id`, create or update one record, and return structured 400/404 errors.
- [ ] Implement Store GET using `query.graph(..., { locale: req.locale })`; return 404 when no content exists and localized fields otherwise.
- [ ] Generate the module migration and sync link definitions without applying destructive database operations.

### Task 4: Medusa Admin Product Widget

**Files:**
- Modify: `apps/medusa/src/admin/widgets/product-widget.tsx`
- Modify: `apps/medusa/src/admin/lib/sdk.ts` only if the generated SDK client cannot call custom routes.

**Interfaces:**
- Consumes: `/admin/product-content?product_id=<id>` and POST `/admin/product-content`.
- Produces: original English ProductContent editor; translations remain in native Settings → Translations UI.

- [ ] Replace metadata-backed English/Vietnamese pairs with four ProductContent fields.
- [ ] Load current ProductContent on product detail mount, preserve local unsaved state, and show loading/error states.
- [ ] POST an upsert payload with the product ID and four fields; await completion before success toast.
- [ ] Keep the Contentful sync button only if it is used independently; do not use it for ProductContent.
- [ ] Verify the Medusa Admin build succeeds under 2.18.

### Task 5: Locale-Aware Storefront Product Fetches (TDD)

**Files:**
- Modify: `apps/storefront/libs/util/server/products.server.ts`
- Modify: `apps/storefront/libs/util/server/data/collections.server.ts`
- Modify: product detail route that retrieves `StoreProduct`
- Create: `apps/storefront/libs/util/server/data/product-content.server.ts`
- Modify: `apps/storefront/app/templates/ProductTemplate.tsx`
- Modify: `apps/storefront/app/routes/collections.$collectionHandle.tsx`

**Interfaces:**
- Consumes: `getLanguage`, `toMedusaLocale`, core Store product APIs, `/store/products/:id/content`.
- Produces: localized StoreProduct and ProductContent loader data.

- [ ] Add a focused cache-key test proving `en-US` and `vi-VN` produce different product cache keys.
- [ ] Pass `locale` to all core product/collection requests and include it in cache keys.
- [ ] Retrieve ProductContent in the product detail loader; treat 404 as four empty optional fields and propagate other failures.
- [ ] Pass ProductContent to `ProductTemplate`; remove metadata language switching and render the loader-provided localized values.
- [ ] Render localized collection title/description directly from the Store API result instead of `description_vi` metadata.

### Task 6: Cart Locale and End-to-End Verification

**Files:**
- Modify: storefront cart creation/update utilities identified by `getCartId` and SDK cart calls.
- Verify: backend, PayPal workspace, storefront, lockfile, generated migrations.

**Interfaces:**
- Consumes: request `lng` cookie and `toMedusaLocale`.
- Produces: localized cart and order line-item content.

- [ ] Set `locale` during cart creation and update locale when language changes.
- [ ] Run focused locale and ProductContent tests.
- [ ] Run backend module/integration tests, backend build/typecheck, PayPal build/typecheck, and storefront build/typecheck.
- [ ] Run `git diff --check`, inspect changed files, and confirm no unrelated working-tree changes were overwritten.
- [ ] Record any pre-existing failures separately; do not claim a green full suite when it is not green.
