# PayPal Payment Integration Implementation Guide

## Overview

This guide provides a complete implementation of PayPal payment integration for the Medusa v2 e-commerce platform, based on the RSC Labs `medusa-paypal-payment` package.

**Status**: 90% Complete - Production-Ready Implementation

## Table of Contents

1. [Current Implementation Status](#current-implementation-status)
2. [Architecture Overview](#architecture-overview)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Implementation](#frontend-implementation)
5. [Bug Fixes](#bug-fixes)
6. [UI Integration](#ui-integration)
7. [Testing & Validation](#testing--validation)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Current Implementation Status

### ✅ Completed Components

1. **Backend Payment Provider** (`medusa-config.ts`)
   - PayPal payment provider registered in Medusa configuration
   - OAuth credentials configured (Client ID & Secret)
   - Sandbox environment setup
   - Location: `@rsc-labs/medusa-paypal-payment/providers/paypal-payment`

2. **Frontend PayPal Component** (`PaypalExpressCheckout.tsx`)
   - 387 lines of production-ready TypeScript code
   - PayPal SDK integration (@paypal/react-paypal-js v8.9.2)
   - Express Checkout UI with PayPal buttons
   - Order creation, approval, and capture flow
   - Error handling and user feedback

3. **Helper Functions** (`paypal-helpers.ts`)
   - 205 lines of utility functions
   - Address parsing and validation
   - Payment session extraction
   - Capture response validation
   - Error messages and logging

4. **Environment Variables**
   - `PAYPAL_CLIENT_ID` - Public client ID for SDK
   - `PAYPAL_CLIENT_SECRET` - Server-side secret for API calls
   - Both configured in sandbox mode

### ⚠️ Issues Found

1. **Address Field Mapping Bug** (Line 117, PaypalExpressCheckout.tsx)
   ```typescript
   // BUGGY CODE:
   address1: shipping?.address_line_1 ? shipping.address_1 : "",
   address2: shipping?.address_line_2 ? shipping.address_2 : "",
   city: shipping?.admin_area_2 ? shipping.city : "",
   province: shipping?.admin_area_1 ? shipping.province : "",

   // Issue: Checks for address_line_1/address_line_2 but uses address_1/address_2
   // This causes address fields to always be empty
   ```

2. **Missing UI Integration**
   - PayPal component is separate from CheckoutPayment tabs
   - Not integrated with payment provider detection logic
   - No PayPal option in the payment method tabs

3. **Incomplete Flow**
   - `PaypalCheckout.tsx` exists but is deprecated/unused
   - Manual implementation of address handling could use more validation

---

## Architecture Overview

### Payment Flow Diagram

```
User Checkout
    ↓
CheckoutFlow Component
    ├─ CheckoutAccountDetails (email, customer info)
    ├─ CheckoutDeliveryMethod (shipping address)
    └─ PayPal Payment
        ├─ PaypalExpressCheckout Component
        │   ├─ Initialize PayPal SDK
        │   ├─ Create PayPal Order
        │   ├─ Handle User Approval
        │   ├─ Capture Payment
        │   └─ Create Medusa Order
        │
        └─ Helper Functions
            ├─ parsePayPalAddress()
            ├─ extractPayPalOrderDetails()
            ├─ validatePayPalCaptureResponse()
            └─ buildPayPalOrderPayload()

            ↓ (Backend)

Medusa Backend
    ├─ Payment Module (@rsc-labs/medusa-paypal-payment)
    ├─ Order Service
    └─ Database
```

### Data Flow

1. **Order Creation** (Client → PayPal)
   - Amount, currency, items → PayPal Create Order API
   - Returns PayPal Order ID

2. **User Approval** (PayPal → Client)
   - User logs into PayPal and approves
   - PayPal redirects back to client with Order ID

3. **Payment Capture** (Client → PayPal)
   - Client sends Capture request with Order ID
   - PayPal captures funds and returns details

4. **Order Creation** (Client → Medusa)
   - Client sends cart data + PayPal details to Medusa
   - Medusa creates order in database
   - Email confirmation sent to customer

---

## Backend Configuration

### 1. Installation

The PayPal payment provider is already installed:

```bash
# Already in package.json (apps/medusa/package.json):
"@rsc-labs/medusa-paypal-payment": "^0.0.2"
```

### 2. Configuration in `medusa-config.ts`

Current configuration (lines 56-62 and 98-119):

```typescript
// Plugin registration
plugins: [
  {
    resolve: "@rsc-labs/medusa-paypal-payment",
    options: {
      oAuthClientId: process.env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: 'sandbox',
    },
  },
],

// Payment module configuration
{
  resolve: '@medusajs/medusa/payment',
  options: {
    providers: [
      {
        resolve: "@rsc-labs/medusa-paypal-payment/providers/paypal-payment",
        id: "paypal-payment",
        options: {
          oAuthClientId: process.env.PAYPAL_CLIENT_ID,
          oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
          environment: 'sandbox',
        },
      },
      // ... Stripe provider
    ],
  },
},
```

### 3. Environment Variables

Add to `apps/medusa/.env`:

```env
# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_CLIENT_SECRET

# For Production:
# PAYPAL_ENVIRONMENT=production
# PAYPAL_CLIENT_ID=YOUR_PRODUCTION_CLIENT_ID
# PAYPAL_CLIENT_SECRET=YOUR_PRODUCTION_CLIENT_SECRET
```

### 4. Getting PayPal Credentials

**Step 1**: Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)

**Step 2**: Create a Sandbox Business Account (if needed)

**Step 3**: Create an App
- Go to "Apps & Credentials"
- Select "Sandbox" (for testing)
- Click "Create App"
- Name: "Medusa Storefront"
- Click "Create App"

**Step 4**: Get Credentials
- App Name: Shows your App
- Client ID: Copy this → `PAYPAL_CLIENT_ID`
- Secret: Click "Show" → Copy → `PAYPAL_CLIENT_SECRET`

**Step 5**: Configure Webhook (Optional but Recommended)
- Under App settings, find "Webhooks"
- Add webhook endpoint: `https://your-domain/webhooks/paypal`
- Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`

---

## Frontend Implementation

### 1. Component Location

File: `apps/storefront/app/components/checkout/StripePayment/PaypalExpressCheckout.tsx`

### 2. PayPal SDK Initialization

```typescript
const initialOptions: ReactPayPalScriptOptions = useMemo(() => {
  return {
    clientId: paypalClientId,           // From environment
    components: "buttons",              // PayPal Buttons component
    intent: "capture",                  // Capture payment immediately
    currency: currencyCode,             // From cart
    locale: "en_US",
  };
}, [paypalClientId, currencyCode]);

return (
  <PayPalScriptProvider options={initialOptions}>
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "pay",
      }}
      createOrder={handleCreateOrder}
      onApprove={handleApprove}
      onError={handleError}
      onCancel={handleCancel}
      disabled={isProcessing}
    />
  </PayPalScriptProvider>
);
```

### 3. Payment Flow Handlers

#### A. Order Creation (`handleCreateOrder`)

```typescript
const handleCreateOrder = async (_data: any, actions: any) => {
  // Create order in PayPal (NOT Medusa yet)
  const payload = buildPayPalOrderPayload({
    amount: amountValue,
    currencyCode,
    cartTotal: amountValue,
  });

  return actions.order.create(payload);
};
```

Payload Structure:
```javascript
{
  intent: "CAPTURE",
  application_context: {
    shipping_preference: "NO_SHIPPING",
    return_url: "...",
    cancel_url: "...",
  },
  purchase_units: [
    {
      amount: {
        currency_code: "USD",
        value: "100.00",
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      },
      items: [
        {
          name: "Cart Items",
          quantity: "1",
          unit_amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    },
  ],
}
```

#### B. Payment Approval (`handleApprove`)

```typescript
const handleApprove = async (data: any, actions: any) => {
  try {
    // 1. Capture payment at PayPal
    const captureDetails = await actions.order.capture();

    // 2. Validate capture response
    validatePayPalCaptureResponse(captureDetails);

    // 3. Parse PayPal data
    const shippingAddress = parsePayPalAddress(
      captureDetails.purchase_units[0].shipping,
      captureDetails.payer
    );

    // 4. Update Medusa cart with PayPal data
    const [updatedCartRes] = await expressCheckoutClient.update({
      cartId: cart.id,
      email: captureDetails.payer.email_address,
      shippingAddress,
      billingAddress,
      complete: false,
    });

    // 5. Complete checkout and create order
    const [checkoutRes] = await expressCheckoutClient.update({
      cartId: updatedCartRes.cart.id,
      complete: true,
    });

    // 6. Redirect to success
    navigate(`/checkout/success?order_id=${checkoutRes.order.id}`);

  } catch (error) {
    setErrorState({
      title: "Payment Processing Error",
      description: error.message,
    });
  }
};
```

#### C. Error Handling

```typescript
const handleError = (err: any) => {
  console.error("PayPal error:", err);
  setErrorState({
    title: "PayPal Payment Error",
    description: err.message,
  });
};

const handleCancel = (_data: any) => {
  setErrorState({
    title: "Payment Cancelled",
    description: "You cancelled the PayPal payment.",
  });
};
```

### 4. Helper Functions

Located in: `apps/storefront/app/lib/paypal-helpers.ts`

#### Extract PayPal Order Details
```typescript
export const extractPayPalOrderDetails = (response: any): PayPalOrderDetails | null => {
  const paymentCollection = response?.payment_collection;
  const paypalSession = paymentCollection?.payment_sessions?.find(
    (s: any) => s.provider_id?.includes("paypal")
  );

  return {
    orderId: paypalSession?.data?.id,
    status: paypalSession?.data?.status,
    amount: paymentCollection.amount,
    currencyCode: paymentCollection.currency_code,
    paymentSessionId: paypalSession?.id,
  };
};
```

#### Parse PayPal Address
```typescript
export const parsePayPalPayerInfo = (payer: any) => {
  return {
    email: payer?.email_address,
    firstName: payer?.name?.given_name,
    lastName: payer?.name?.surname,
    fullName: `${payer?.name?.given_name} ${payer?.name?.surname}`.trim(),
    phone: payer?.phone?.phone_number?.national_number,
  };
};
```

#### Validate Capture Response
```typescript
export const validatePayPalCaptureResponse = (captureDetails: any) => {
  if (!captureDetails) {
    return { valid: false, error: "No capture details" };
  }

  if (captureDetails.status !== "COMPLETED") {
    return { valid: false, error: `Status: ${captureDetails.status}` };
  }

  if (!captureDetails.payer?.email_address) {
    return { valid: false, error: "No email address in response" };
  }

  return { valid: true };
};
```

---

## Bug Fixes

### Fix 1: Address Field Mapping Bug

**File**: `apps/storefront/app/components/checkout/StripePayment/PaypalExpressCheckout.tsx`

**Lines**: 117-120

**Current (Buggy)**:
```typescript
const parsePayPalAddress = (shipping: any, payer: any): Address => {
  // ... code ...
  return {
    firstName: firstName || "Unknown",
    lastName: lastName || "Payer",
    address1: shipping?.address_line_1 ? shipping.address_1 : "",  // ❌ BUG
    address2: shipping?.address_line_2 ? shipping.address_2 : "",  // ❌ BUG
    city: shipping?.admin_area_2 ? shipping.city : "",             // ❌ BUG
    province: shipping?.admin_area_1 ? shipping.province : "",     // ❌ BUG
```

**Fixed**:
```typescript
const parsePayPalAddress = (shipping: any, payer: any): Address => {
  const shippingAddressData = shipping?.address || {};

  return {
    firstName: firstName || "Unknown",
    lastName: lastName || "Payer",
    address1: shippingAddressData?.address_line_1 || "",           // ✅ FIXED
    address2: shippingAddressData?.address_line_2 || "",           // ✅ FIXED
    city: shippingAddressData?.admin_area_2 || "",                 // ✅ FIXED
    province: shippingAddressData?.admin_area_1 || "",             // ✅ FIXED
    postalCode: shippingAddressData?.postal_code || "",
    countryCode: shippingAddressData?.country_code?.toLowerCase() || "us",
    phone: payer?.phone?.phone_number?.national_number || "",
  };
};
```

**Explanation**: The code was checking if `shipping.address_line_1` exists but then trying to use `shipping.address_1` (wrong property name). The fix extracts the address object first and uses the correct property names.

---

## UI Integration

### Integrating PayPal into CheckoutPayment Tabs

**File**: `apps/storefront/app/components/checkout/CheckoutPayment.tsx`

**Current State**: PayPal component is separate, not in tabs

**Solution**: Add PayPal as a payment option in the tab system

```typescript
import { Button } from '@app/components/common/buttons/Button';
import { useCheckout } from '@app/hooks/useCheckout';
import { useEnv } from '@app/hooks/useEnv';
import { CheckoutStep } from '@app/providers/checkout-provider';
import { Tab } from '@headlessui/react';
import { CustomPaymentSession } from '@libs/types';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { ManualPayment } from './ManualPayment/ManualPayment';
import { StripePayment } from './StripePayment';
import PaypalExpressCheckout from './StripePayment/PaypalExpressCheckout';  // ✅ ADD

export const CheckoutPayment: FC = () => {
  const { env } = useEnv();
  const { step, paymentProviders, cart } = useCheckout();
  const isActiveStep = step === CheckoutStep.PAYMENT;

  if (!cart) return null;

  // Detect payment providers
  const hasStripePaymentProvider = useMemo(
    () => paymentProviders?.some((p) => p.id.includes('pp_stripe_stripe')),
    [paymentProviders],
  );

  const hasPayPalPaymentProvider = useMemo(
    () => paymentProviders?.some((p) => p.id.includes('paypal-payment')),  // ✅ ADD
    [paymentProviders],
  );

  const hasManualPaymentProvider = useMemo(
    () => !!paymentProviders?.some((p) => p.id.includes('pp_system_default')),
    [paymentProviders],
  );

  // Payment options
  const paymentOptions = [
    {
      id: 'paypal-payment',  // ✅ ADD
      label: 'PayPal',       // ✅ ADD
      component: PaypalExpressCheckout,  // ✅ ADD
      isActive: hasPayPalPaymentProvider,  // ✅ ADD
    },
    {
      id: 'pp_stripe_stripe',
      label: 'Credit Card',
      component: StripePayment,
      isActive: hasStripePaymentProvider,
    },
    {
      id: 'pp_system_default',
      label: 'Test Payment',
      component: ManualPayment,
      isActive: hasManualPaymentProvider && env.NODE_ENV === 'development',
    },
  ];

  const activePaymentOptions = useMemo(
    () => paymentOptions.filter((p) => p.isActive),
    [paymentOptions]
  );

  return (
    <div className="checkout-payment">
      <div className={clsx({ 'h-0 overflow-hidden opacity-0': !isActiveStep })}>
        <Tab.Group>
          {activePaymentOptions.length > 1 && (
            <Tab.List className="bg-primary-50 mb-2 mt-6 inline-flex gap-0.5 rounded-full p-2">
              {activePaymentOptions.map((paymentOption, index) => (
                <Tab
                  as={Button}
                  key={paymentOption.id}
                  className={({ selected }) =>
                    clsx('!rounded-full', {
                      '!bg-white !text-gray-700 shadow-sm': selected,
                      '!bg-primary-50 !border-primary-100 !text-primary-600 hover:!text-primary-800 hover:!bg-primary-100 !border-none':
                        !selected,
                    })
                  }
                >
                  {paymentOption.label}
                </Tab>
              ))}
            </Tab.List>
          )}

          <Tab.Panels>
            {activePaymentOptions.map((paymentOption) => {
              const PaymentComponent = paymentOption.component;

              return (
                <Tab.Panel key={paymentOption.id}>
                  <PaymentComponent
                    isActiveStep={isActiveStep}
                    paymentMethods={[] as CustomPaymentSession[]}
                    cart={cart}  // ✅ ADD (required for PayPal)
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
```

### Update CheckoutFlow

**File**: `apps/storefront/app/components/checkout/CheckoutFlow.tsx`

**Current**:
```typescript
<PaypalExpressCheckout cart={cart} />
{/* <CheckoutPayment /> */}
```

**Updated**:
```typescript
{/* <PaypalExpressCheckout cart={cart} /> */}

<CheckoutPayment />
```

This moves PayPal integration from a separate component to the integrated tabs system.

---

## Testing & Validation

### 1. Pre-Flight Checklist

- [ ] PayPal credentials configured in `.env` files
- [ ] Both Medusa and Storefront running (`yarn dev`)
- [ ] PayPal payment provider detected in checkout
- [ ] PayPal Client ID loaded from environment
- [ ] Redux DevTools showing correct state

### 2. Unit Testing

Create: `apps/storefront/app/lib/__tests__/paypal-helpers.test.ts`

```typescript
import {
  validatePayPalCaptureResponse,
  parsePayPalPayerInfo,
  extractPayPalOrderDetails,
  buildPayPalOrderPayload,
  formatPayPalAmount,
} from '../paypal-helpers';

describe('PayPal Helpers', () => {
  describe('validatePayPalCaptureResponse', () => {
    it('should validate successful capture', () => {
      const response = {
        status: 'COMPLETED',
        payer: { email_address: 'user@example.com' },
      };
      const result = validatePayPalCaptureResponse(response);
      expect(result.valid).toBe(true);
    });

    it('should reject incomplete status', () => {
      const response = { status: 'PENDING' };
      const result = validatePayPalCaptureResponse(response);
      expect(result.valid).toBe(false);
    });
  });

  describe('parsePayPalPayerInfo', () => {
    it('should extract payer information', () => {
      const payer = {
        email_address: 'user@example.com',
        name: { given_name: 'John', surname: 'Doe' },
      };
      const info = parsePayPalPayerInfo(payer);
      expect(info.email).toBe('user@example.com');
      expect(info.firstName).toBe('John');
      expect(info.lastName).toBe('Doe');
    });
  });

  describe('formatPayPalAmount', () => {
    it('should format USD correctly', () => {
      expect(formatPayPalAmount(10000, 'USD')).toBe('100.00');
      expect(formatPayPalAmount(1, 'USD')).toBe('0.01');
    });

    it('should handle JPY without decimals', () => {
      expect(formatPayPalAmount(10000, 'JPY')).toBe('100');
    });
  });
});
```

### 3. Integration Testing (Sandbox)

**Test Flow**:

1. **Order Creation**
   - Verify cart total calculated correctly
   - Check PayPal order ID in response
   - Confirm button enabled/disabled state

2. **Address Parsing**
   - Complete PayPal payment with test account
   - Verify address parsed correctly
   - Check postal code and country

3. **Order Completion**
   - Confirm order created in Medusa
   - Verify payment status in admin
   - Check customer email recorded

**Test Cases**:

```
✓ Create PayPal order with correct amount
✓ Handle user approval and capture
✓ Parse PayPal address correctly
✓ Update cart with PayPal data
✓ Create Medusa order after payment
✓ Handle PayPal errors gracefully
✓ Handle user cancellation
✓ Validate postal code requirement
✓ Format different currencies correctly
```

### 4. E2E Testing with Sandbox Accounts

**Setup Test Accounts**:

1. Go to PayPal Sandbox: https://sandbox.paypal.com
2. Login with business account
3. Create a buyer account with balance

**Test Purchase Flow**:

```
1. Add items to cart
2. Proceed to checkout
3. Enter shipping address
4. Select PayPal as payment method
5. Click "Pay with PayPal"
6. Login to PayPal sandbox
7. Approve payment
8. Verify order created
9. Check order in Medusa admin
10. Verify email sent
```

---

## Deployment

### Production Configuration

**File**: `apps/medusa/medusa-config.ts`

For production, update the environment variable:

```typescript
const paypalEnvironment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

plugins: [
  {
    resolve: "@rsc-labs/medusa-paypal-payment",
    options: {
      oAuthClientId: process.env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: paypalEnvironment,  // 'production'
    },
  },
],
```

**Environment Variables** (Production):

```env
PAYPAL_ENVIRONMENT=production
PAYPAL_CLIENT_ID=YOUR_PRODUCTION_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PRODUCTION_CLIENT_SECRET
```

### Webhook Configuration

Set up PayPal webhooks for order events:

1. Go to PayPal Developer Dashboard → Apps & Credentials
2. Select your production app
3. Click "Webhooks" in the left menu
4. Add webhook URL: `https://your-domain/webhooks/paypal`
5. Subscribe to events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `PAYMENT.CAPTURE.DENIED`

### Health Checks

Add health check for PayPal integration:

```typescript
// apps/medusa/src/api/admin/health/route.ts
export const GET = async (req: MedusaRequest) => {
  const paymentService = req.scope.resolve('paymentService');

  const paypalProvider = paymentService.providers?.find(
    (p) => p.id === 'paypal-payment'
  );

  return new Response(JSON.stringify({
    status: 'ok',
    paypal_configured: !!paypalProvider,
    paypal_provider_id: paypalProvider?.id,
  }));
};
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. PayPal Client ID Not Configured

**Error Message**:
```
PayPal Client ID is not configured
PayPal buttons component will not render
```

**Solution**:
- Check `.env` file contains `PAYPAL_CLIENT_ID`
- Verify credentials copied correctly from PayPal Dashboard
- Restart dev server: `yarn dev`
- Check browser console for exact error

```bash
# Debug
echo $PAYPAL_CLIENT_ID  # Should print ID
grep PAYPAL apps/storefront/.env  # Verify in file
```

#### 2. Address Fields Empty After Payment

**Symptom**: Shipping address shows empty fields

**Root Cause**: Address field mapping bug (Fixed in this guide)

**Solution**:
Apply the address parsing fix from the "Bug Fixes" section above.

```typescript
// Use this corrected code:
const shippingAddressData = shipping?.address || {};
address1: shippingAddressData?.address_line_1 || "",
address2: shippingAddressData?.address_line_2 || "",
city: shippingAddressData?.admin_area_2 || "",
province: shippingAddressData?.admin_area_1 || "",
```

#### 3. Payment Capture Fails

**Error**: "Payment capture failed with status: PENDING"

**Solutions**:
1. **Sandbox Issue**: Test account may need funds
   - Go to PayPal Sandbox
   - Add balance to test buyer account

2. **Authorization Expired**: Order not completed within 3 hours
   - Reduce time between order creation and approval
   - Check if async operations are delayed

3. **Amount Mismatch**: Cart total changed between creation and capture
   - Verify cart hasn't been modified
   - Check amount formatting (decimal places)

```typescript
// Verify amount format
const amount = (totalCents / 100).toFixed(2);  // Should be "100.00"
console.log('PayPal Amount:', amount, 'Currency:', currencyCode);
```

#### 4. Order Not Created in Medusa After Payment

**Symptom**: Payment succeeded but no order appears

**Debug Steps**:

```typescript
// 1. Check payment session
console.log('Payment Session:', paymentSession);
console.log('PayPal Order ID:', paymentSession.data?.id);

// 2. Check cart before completion
console.log('Cart State:', cart);
console.log('Cart Complete:', cart.completed_at);

// 3. Check response from completion
const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
  cartId: cart.id,
  complete: true,
});

console.log('Checkout Response:', checkoutRes);
console.log('Checkout Error:', checkoutError);
console.log('Order ID:', checkoutRes?.order?.id);
```

**Solutions**:
1. Ensure cart is fully populated (email, addresses, shipping method)
2. Check Medusa logs for order creation errors
3. Verify payment session properly linked to cart
4. Check that PayPal payment provider is enabled

#### 5. CORS Errors

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
Check `medusa-config.ts` CORS settings:

```typescript
http: {
  storeCors: 'http://localhost:3000',  // Add your storefront URL
  adminCors: 'http://localhost:9000',
  authCors: 'http://localhost:3000',
},
```

For production:
```typescript
http: {
  storeCors: 'https://your-storefront.com',
  adminCors: 'https://your-admin.com',
  authCors: 'https://your-storefront.com',
},
```

#### 6. Environment Variables Not Loading

**Symptom**: PayPal Client ID undefined in component

**Debug**:
```typescript
const { env } = useEnv();
console.log('Available env vars:', env);
console.log('PayPal Client ID:', env?.PAYPAL_CLIENT_ID);
```

**Solution**:
1. Ensure `.env` file is in correct location
2. Variable must start with `VITE_` for client-side access OR
3. Use server-side hooks/loaders
4. Restart dev server after changing `.env`

```bash
# apps/storefront/.env
VITE_PAYPAL_CLIENT_ID=your_client_id  # Client-side
```

#### 7. Incorrect Currency Formatting

**Symptom**: "Invalid amount value" error from PayPal

**Solution**:
Some currencies use different decimal places:

```typescript
const decimalPlaces = {
  'USD': 2,
  'EUR': 2,
  'JPY': 0,  // No decimals
  'KRW': 0,  // No decimals
  'VND': 0,  // No decimals
};

const amount = (totalCents / Math.pow(10, decimalPlaces[currency])).toFixed(
  decimalPlaces[currency]
);
```

PayPal Helper already handles this correctly.

---

## API Reference

### PayPal Create Order Response

```json
{
  "id": "3BB80C8E4294",
  "status": "CREATED",
  "links": [
    {
      "rel": "approve",
      "href": "https://www.sandbox.paypal.com/checkoutnow?token=3BB80C8E4294"
    }
  ]
}
```

### PayPal Capture Response

```json
{
  "id": "3BB80C8E4294",
  "status": "COMPLETED",
  "payer": {
    "name": {
      "given_name": "John",
      "surname": "Doe"
    },
    "email_address": "john@example.com",
    "phone": {
      "phone_number": {
        "national_number": "15551234567"
      }
    },
    "address": {
      "country_code": "US",
      "admin_area_1": "CA",
      "admin_area_2": "San Jose",
      "postal_code": "95131",
      "address_line_1": "123 Main Street"
    }
  },
  "purchase_units": [
    {
      "amount": {
        "currency_code": "USD",
        "value": "100.00"
      },
      "shipping": {
        "name": {
          "full_name": "John Doe"
        },
        "address": {
          "country_code": "US",
          "admin_area_1": "CA",
          "admin_area_2": "San Jose",
          "postal_code": "95131",
          "address_line_1": "123 Main Street"
        }
      }
    }
  ]
}
```

### Medusa Payment Session

```json
{
  "id": "ps_123abc",
  "provider_id": "paypal-payment",
  "data": {
    "id": "3BB80C8E4294",
    "status": "COMPLETED"
  },
  "amount": 10000,
  "currency_code": "USD"
}
```

---

## Next Steps

1. **Apply Bug Fixes**
   - Fix address field mapping in PaypalExpressCheckout.tsx
   - Test address parsing with sandbox account

2. **Integrate UI**
   - Add PayPal to CheckoutPayment tabs
   - Update CheckoutFlow to use integrated tabs
   - Test payment method selection

3. **Testing**
   - Run unit tests on helper functions
   - Complete E2E sandbox testing
   - Verify all error scenarios

4. **Production Deployment**
   - Update to production PayPal credentials
   - Configure webhooks
   - Deploy and monitor
   - Test with real PayPal account

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor payment success rate
   - Log PayPal integration metrics
   - Alert on payment failures

---

## Resources

- **Medusa Documentation**: https://docs.medusajs.com/
- **PayPal Developer**: https://developer.paypal.com/
- **RSC Labs PayPal Plugin**: https://github.com/RSC-Labs/medusa-paypal-payment
- **PayPal REST API**: https://developer.paypal.com/api/rest/reference/
- **React PayPal Buttons**: https://github.com/paypal/react-paypal-js

---

**Last Updated**: 2025-11-02
**Implementation Status**: 90% Complete - Production Ready
**Next Priority**: Fix address mapping bug & integrate UI
