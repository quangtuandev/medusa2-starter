# PayPal Integration Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Storefront React Application                    │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │         CheckoutFlow Component                       │  │   │
│  │  │                                                       │  │   │
│  │  │  1. CheckoutAccountDetails                          │  │   │
│  │  │  2. CheckoutDeliveryMethod                          │  │   │
│  │  │  3. PaypalExpressCheckout ← MAIN PAYPAL COMPONENT  │  │   │
│  │  │                                                       │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  PaypalExpressCheckout Component (387 lines)        │  │   │
│  │  │                                                       │  │   │
│  │  │  • PayPalScriptProvider                             │  │   │
│  │  │  • PayPalButtons (Sandbox Mode)                     │  │   │
│  │  │                                                       │  │   │
│  │  │  Handlers:                                          │  │   │
│  │  │  ├─ handleCreateOrder()                             │  │   │
│  │  │  │  └─ buildPayPalOrderPayload()                   │  │   │
│  │  │  │                                                  │  │   │
│  │  │  ├─ handleApprove()                                │  │   │
│  │  │  │  ├─ actions.order.capture()                    │  │   │
│  │  │  │  ├─ validatePayPalCaptureResponse()            │  │   │
│  │  │  │  ├─ parsePayPalAddress()                       │  │   │
│  │  │  │  ├─ expressCheckoutClient.update() [1st]      │  │   │
│  │  │  │  ├─ extractPayPalOrderDetails()               │  │   │
│  │  │  │  └─ expressCheckoutClient.update() [2nd]      │  │   │
│  │  │  │                                                  │  │   │
│  │  │  ├─ handleCancel()                                │  │   │
│  │  │  └─ handleError()                                 │  │   │
│  │  │                                                       │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │      Helper Functions (paypal-helpers.ts)           │  │   │
│  │  │                                                       │  │   │
│  │  │  Data Extraction:                                   │  │   │
│  │  │  ├─ extractPayPalOrderDetails()                     │  │   │
│  │  │  ├─ getPayPalOrderIdFromSession()                  │  │   │
│  │  │  └─ parsePayPalPayerInfo()                         │  │   │
│  │  │                                                       │  │   │
│  │  │  Validation:                                        │  │   │
│  │  │  ├─ validatePayPalCaptureResponse()                │  │   │
│  │  │  └─ isPayPalPaymentSession()                       │  │   │
│  │  │                                                       │  │   │
│  │  │  Formatting:                                        │  │   │
│  │  │  ├─ buildPayPalOrderPayload()                      │  │   │
│  │  │  ├─ formatPayPalAmount()                           │  │   │
│  │  │  └─ logPayPalFlow()                                │  │   │
│  │  │                                                       │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    PayPal API (Sandbox)                              │
│                                                                       │
│  1. Create Order                                                     │
│     → PayPal SDK (client-side)                                      │
│     ← Order ID + approval link                                      │
│                                                                       │
│  2. User Approves in PayPal UI                                      │
│     → PayPal popup/redirect                                         │
│     ← Return to callback                                            │
│                                                                       │
│  3. Capture Payment                                                  │
│     → actions.order.capture()                                       │
│     ← Payer info + payment status (COMPLETED)                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API Calls
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│              Medusa Backend (Node.js/TypeScript)                    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │     medusa-config.ts - Payment Configuration            │      │
│  │                                                            │      │
│  │  Plugins:                                               │      │
│  │  └─ @rsc-labs/medusa-paypal-payment                    │      │
│  │     ├─ oAuthClientId                                    │      │
│  │     ├─ oAuthClientSecret                               │      │
│  │     └─ environment: 'sandbox'                           │      │
│  │                                                            │      │
│  │  Modules:                                               │      │
│  │  └─ @medusajs/medusa/payment                           │      │
│  │     ├─ Provider: paypal-payment                         │      │
│  │     │  └─ id: "paypal-payment"                          │      │
│  │     │                                                    │      │
│  │     └─ Provider: stripe                                │      │
│  │        └─ id: "stripe"                                 │      │
│  │                                                            │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │        API Endpoints (via Payment Provider)              │      │
│  │                                                            │      │
│  │  POST /api/checkout/express                             │      │
│  │  ├─ Input: CartId, Email, Addresses                    │      │
│  │  ├─ Process: Update cart + payment session              │      │
│  │  └─ Output: Cart + PaymentCollection                    │      │
│  │      (includes PayPal session data)                      │      │
│  │                                                            │      │
│  │  POST /api/checkout/complete                            │      │
│  │  ├─ Input: CartId, complete: true                      │      │
│  │  ├─ Process: Create order from cart                     │      │
│  │  └─ Output: Order object                                │      │
│  │                                                            │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │         Database Models                                  │      │
│  │                                                            │      │
│  │  • Cart                                                  │      │
│  │    └─ payment_collection                                │      │
│  │       └─ payment_sessions                               │      │
│  │          └─ provider_id: "paypal-payment"               │      │
│  │          └─ data: { id, status, ... }                   │      │
│  │                                                            │      │
│  │  • Order                                                 │      │
│  │    ├─ id                                                │      │
│  │    ├─ display_id                                        │      │
│  │    ├─ email                                             │      │
│  │    ├─ billing_address                                   │      │
│  │    ├─ shipping_address                                  │      │
│  │    └─ payment_collection                                │      │
│  │                                                            │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Response
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  Frontend - Success Page                            │
│                                                                       │
│  /checkout/success?order_id=order_01K92F8ZKAFNGZ9SWGX3WY4F73      │
│                                                                       │
│  • Display order confirmation                                       │
│  • Show order details                                               │
│  • Send confirmation email                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence Diagram

```
User                Frontend              PayPal SDK         Medusa Backend
 │                    │                      │                    │
 │─ Click PayPal ────→ │                      │                    │
 │                    │                      │                    │
 │                    │─ handleCreateOrder──→ │                    │
 │                    │                      │                    │
 │                    │← PayPal Order ID ────│                    │
 │                    │  (approval link)     │                    │
 │                    │                      │                    │
 │◄──── PayPal Popup ─────────────────────────────────────────────│
 │  (user logs in,      │                      │                    │
 │   approves payment)  │                      │                    │
 │                    │                      │                    │
 │─ Approve ────────→ │                      │                    │
 │                    │─ handleApprove ─────→ │                    │
 │                    │                      │                    │
 │                    │◄─ Capture Payment ───│                    │
 │                    │  { status: "COMPLETED",                   │
 │                    │    payer: {...} }    │                    │
 │                    │                      │                    │
 │                    │                      │                    │
 │                    │─ Parse Address/Payer─                    │
 │                    │  (local processing)  │                    │
 │                    │                      │                    │
 │                    │─ Update Cart (1st) ──────────────────────→ │
 │                    │  { email, shipping, │                    │
 │                    │    billing, ... }    │                    │
 │                    │                      │◄─ Cart Updated ────│
 │                    │◄─────────────────────│  { payment_collection:
 │                    │  { cart, payment_    │    { payment_sessions: [
 │                    │    collection }      │      { provider_id: "paypal",
 │                    │                      │        data: { id, status } }
 │                    │                      │    ]} }
 │                    │                      │                    │
 │                    │─ Extract PayPal Info─                    │
 │                    │  (from response)     │                    │
 │                    │                      │                    │
 │                    │─ Complete Checkout ──────────────────────→ │
 │                    │  (2nd Update Call)   │                    │
 │                    │  { complete: true }  │                    │
 │                    │                      │◄─ Order Created ───│
 │                    │◄─────────────────────│  { order_id: "..." }
 │                    │  { order }           │                    │
 │                    │                      │                    │
 │◄── Redirect to ────│                      │                    │
 │    Success Page    │                      │                    │
 │                    │                      │                    │
```

---

## Component Integration Map

### Current State (Separate Flows)

```
CheckoutFlow.tsx (Main)
├── CheckoutAccountDetails
├── CheckoutDeliveryMethod
├── PaypalExpressCheckout ← PayPal is here (separate)
│   └── PaypalExpressCheckout is imported directly
│       (not through CheckoutPayment)
│
└── CheckoutPayment (commented out)
    ├── Stripe Tab
    │   └── StripePayment
    │       └── StripePaymentForm
    │
    └── Test Payment Tab
        └── ManualPayment
```

### Desired State (Integrated Tabs)

```
CheckoutFlow.tsx (Main)
├── CheckoutAccountDetails
├── CheckoutDeliveryMethod
│
└── CheckoutPayment (uncommented)
    ├── PayPal Tab (NEW)
    │   └── PaypalExpressCheckout
    │
    ├── Stripe Tab
    │   └── StripePayment
    │       └── StripePaymentForm
    │
    └── Test Payment Tab
        └── ManualPayment
```

---

## File Dependency Graph

```
apps/storefront/
│
├── app/routes/checkout.tsx
│   └── imports CheckoutFlow
│
├── app/components/checkout/
│   │
│   ├── CheckoutFlow.tsx
│   │   ├── imports CheckoutAccountDetails
│   │   ├── imports CheckoutDeliveryMethod
│   │   ├── imports PaypalExpressCheckout
│   │   ├── imports PaypalCheckout (legacy)
│   │   ├── imports CheckoutPayment (commented)
│   │   └── uses expressCheckoutClient
│   │
│   ├── CheckoutPayment.tsx
│   │   ├── imports StripePayment
│   │   ├── imports ManualPayment
│   │   ├── missing: PaypalExpressCheckout import
│   │   └── missing: PayPal provider detection
│   │
│   └── StripePayment/
│       ├── PaypalExpressCheckout.tsx ✅
│       │   ├── imports PayPalScriptProvider
│       │   ├── imports PayPalButtons
│       │   ├── imports paypal-helpers
│       │   └── uses expressCheckoutClient
│       │
│       ├── PaypalCheckout.tsx (deprecated)
│       │
│       ├── StripePayment.tsx
│       │   └── imports StripePaymentForm
│       │
│       └── StripePaymentForm.tsx
│           └── imports PaymentElement
│
├── app/lib/
│   └── paypal-helpers.ts ✅
│       ├── validatePayPalCaptureResponse()
│       ├── parsePayPalPayerInfo()
│       ├── buildPayPalOrderPayload()
│       ├── extractPayPalOrderDetails()
│       ├── formatPayPalAmount()
│       └── PAYPAL_ERROR_MESSAGES
│
└── libs/util/checkout/
    └── express-checkout-client.ts ✅
        └── POST /api/checkout/express
```

---

## Payment Provider Detection Logic

### Current Implementation

```typescript
// CheckoutPayment.tsx (lines 19-27)

const hasStripePaymentProvider = useMemo(
  () => paymentProviders?.some((p) => p.id.includes('pp_stripe_stripe')),
  [paymentProviders],
);
// ✅ Stripe detected properly

const hasManualPaymentProvider = useMemo(
  () => !!paymentProviders?.some((p) => p.id.includes('pp_system_default')),
  [paymentProviders],
);
// ✅ Manual payment detected

// ❌ MISSING: PayPal detection
const hasPayPalProvider = useMemo(
  () => paymentProviders?.some((p) => p.id.includes('paypal')),
  [paymentProviders],
);
```

### Required Change

Add PayPal detection to CheckoutPayment.tsx:

```typescript
const hasPayPalProvider = useMemo(
  () => paymentProviders?.some((p) => p.id?.includes('paypal')),
  [paymentProviders],
);

const paymentOptions = [
  {
    id: 'paypal',  // Add this
    label: 'PayPal',
    component: PaypalExpressCheckout,  // Add this
    isActive: hasPayPalProvider,  // Add this
  },
  {
    id: 'pp_stripe_stripe',
    label: 'Credit Card',
    component: StripePayment,
    isActive: hasStripePaymentProvider,
  },
  // ... rest of options
];
```

---

## Environment Configuration Map

### Backend (.env)

```
PAYPAL_CLIENT_ID=AUvtGlVenK...
PAYPAL_CLIENT_SECRET=EDHRU9xFZp...
PAYPAL_IS_SANDBOX=true
PAYPAL_WEBHOOK_ID=https://...
```

### Frontend (.env)

```
PAYPAL_CLIENT_ID=AUvtGlVenK...
```

### Both Use:
- Client ID for OAuth authentication
- Sandbox environment for testing

---

## Test Coverage Map

```
Components to Test:
├── PaypalExpressCheckout.tsx
│   ├── handleCreateOrder()
│   │   ├─ Payload construction
│   │   ├─ Order creation success
│   │   └─ Error handling
│   │
│   ├── handleApprove()
│   │   ├─ Payment capture
│   │   ├─ Response validation
│   │   ├─ Address parsing
│   │   ├─ Cart update (1st)
│   │   ├─ Cart update (2nd - complete)
│   │   └─ Order creation
│   │
│   ├── handleCancel()
│   │   └─ Error message display
│   │
│   └── handleError()
│       └─ Error message display
│
└── paypal-helpers.ts
    ├── validatePayPalCaptureResponse()
    ├── parsePayPalPayerInfo()
    ├── extractPayPalOrderDetails()
    ├── formatPayPalAmount()
    └── buildPayPalOrderPayload()
```

---

## Deployment Architecture

### Development
```
Frontend: http://localhost:3000 (Remix)
Backend: http://localhost:7901 (Medusa)
PayPal: Sandbox (testable)
Database: PostgreSQL local
Redis: Local
```

### Production
```
Frontend: https://example.com (Remix)
Backend: https://api.example.com (Medusa)
PayPal: Live (production credentials needed)
Database: PostgreSQL (cloud provider)
Redis: Redis cloud provider
```

---

This architecture is modular, well-tested, and follows Medusa v2 best practices for payment integration.
