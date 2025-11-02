# PayPal Express Checkout Flow Documentation

## Overview

The PayPal Express Checkout component implements a complete payment flow that integrates with the Medusa v2 backend and the alphabite PayPal plugin.

## Payment Flow Diagram

```
┌─────────────────┐
│  User clicks    │
│  "Pay with      │
│   PayPal"       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 1. createOrder()                    │
│    - Create PayPal Order            │
│    - Return OrderID                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. PayPal Login Popup               │
│    (User logs in to PayPal)         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. onShippingAddressChange()        │
│    (Optional: User changes address) │
│    - Update Cart with new address   │
│    - Validate address               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. User clicks "Pay Now"            │
│    in PayPal popup                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 5. onApprove()                      │
│    - Capture Payment                │
│    - Extract PayPal Data            │
│    - Update Cart                    │
│    - Create Medusa Order            │
│    - Redirect to Success            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Success Page    │
│ Order Created   │
└─────────────────┘
```

## Detailed Handler Functions

### 1. `handleCreateOrder()` - Initialize Payment

**Purpose:** Create PayPal order before user approval

**Flow:**
```typescript
- Generate PayPal Order with:
  - intent: "CAPTURE" (immediate payment)
  - currency_code: USD, EUR, JPY, etc.
  - amount: Properly formatted for currency
- Return PayPal Order ID
```

**Input Data:**
- `currentCart.total` - Total in smallest currency unit (cents)
- `currencyCode` - ISO 4217 currency code

**Output:**
- PayPal Order ID for approval

---

### 2. `handleOnShippingAddressChange()` - Handle Address Changes

**Purpose:** Update cart when user changes shipping address in PayPal popup

**When it's called:**
- User edits shipping address in PayPal popup
- Before final approval

**Flow:**
```typescript
1. Extract shipping address from PayPal data
2. Parse address into Address object
3. Validate required fields (postal code, address)
4. Update cart via expressCheckoutClient.update()
5. Resolve or reject PayPal action
```

**Validation:**
- Must have postal code
- Must have address line 1
- Country code converted to lowercase

**Actions:**
- `actions.resolve()` - Address is valid, continue
- `actions.reject()` - Address is invalid, show error in PayPal popup

---

### 3. `handleApprove()` - Complete Payment & Create Order

**Purpose:** Process approved payment and create Medusa order

**Execution Steps:**

#### Step 1: Capture Payment
```typescript
const captureDetails = await actions.order.capture();
// Verify status === "COMPLETED"
```

#### Step 2: Extract PayPal Data
```typescript
const payer = captureDetails?.payer;
const purchaseUnit = captureDetails?.purchase_units?.[0];
const shipping = purchaseUnit?.shipping;
```

#### Step 3: Parse Address
- Extract from `shipping.address` or `payer` info
- Parse full name into first/last
- Validate postal code (required)
- Create standardized Address object

#### Step 4: Update Cart with PayPal Data
```typescript
expressCheckoutClient.update({
  cartId: currentCart.id,
  email: payer.email_address,
  shippingAddress: parsedAddress,
  billingAddress: parsedAddress,
  complete: false  // Don't complete yet
});
```

#### Step 5: Complete Checkout (Create Order)
```typescript
expressCheckoutClient.update({
  cartId: updatedCart.id,
  complete: true  // Now complete and create order
});
```

#### Step 6: Navigate to Success
```typescript
navigate(`/checkout/success?order_id=${createdOrder.id}`);
```

---

### 4. `handleError()` - Error Handling

**Purpose:** Handle PayPal errors and display to user

**Triggered by:**
- PayPal script loading errors
- Network errors
- User cancellation
- Invalid configuration

**Error Display:**
- Shows error alert with title and description
- Logs error to console for debugging
- Allows user to retry payment

---

## Address Parsing Logic

PayPal returns address in this format:
```javascript
{
  "address_line_1": "123 Main St",
  "address_line_2": "Apt 4",
  "admin_area_2": "Los Angeles",
  "admin_area_1": "CA",
  "postal_code": "90001",
  "country_code": "US"
}
```

Converts to Medusa Address:
```typescript
{
  firstName: "John",
  lastName: "Doe",
  address1: "123 Main St",
  address2: "Apt 4",
  city: "Los Angeles",
  province: "CA",
  postalCode: "90001",
  countryCode: "us"  // Lowercase
}
```

### Special Cases:
- **Name Parsing**: Takes from `shipping.name.full_name` if available, otherwise uses `payer.name.given_name + surname`
- **Country Code**: Converted to lowercase for consistency
- **Default Country**: Falls back to "us" if missing
- **Fallback Names**: "Unknown" + "Payer" if names unavailable

---

## Currency Handling

### Decimal Places by Currency:
```typescript
- 0 decimals: JPY, KRW, VND
- 2 decimals: USD, EUR, GBP, CAD, etc. (default)
```

### Amount Formatting:
```typescript
// Input: 5099 (cents) for USD
// Output: "50.99"

// Input: 5000 (JPY units) for JPY
// Output: "5000" (no decimals)
```

---

## Environment Configuration

### Required Variables (in `.env`)
```bash
PAYPAL_CLIENT_ID=your_sandbox_or_live_client_id
```

### Backend Configuration (medusa-config.ts)
```typescript
{
  resolve: "@alphabite/medusa-paypal",
  options: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    isSandbox: true,  // or false for production
    webhookId: process.env.PAYPAL_WEBHOOK_ID,
    includeShippingData: false,
    includeCustomerData: false,
  }
}
```

### Storefront Config Files Modified:
1. **config.server.ts** - Exposes PAYPAL_CLIENT_ID from env
2. **root.server.ts** - Adds PAYPAL_CLIENT_ID to loader data
3. **PaypalExpressCheckout.tsx** - Uses env.PAYPAL_CLIENT_ID

---

## State Management

### Component State:
```typescript
const [errorState, setErrorState] = useState(null);
const [isProcessing, setIsProcessing] = useState(false);
const [currentCart, setCurrentCart] = useState(cart);
```

### Loading States:
- `isProcessing = true` during payment capture and order creation
- Shows spinner overlay to prevent double-submit
- Disables PayPal buttons while processing

---

## Error Handling Strategy

### Error Types:

| Error | Cause | Handling |
|-------|-------|----------|
| PayPal order actions not available | Script not loaded | Show error, allow retry |
| Payment capture failed | Payment declined | Show specific error message |
| Unable to retrieve payer info | PayPal data missing | Show error, allow retry |
| Postal code required | Incomplete address | Reject in PayPal popup |
| Cart update failed | Backend error | Show error, allow retry |
| Order creation failed | Backend error | Show error, allow retry |

### User Feedback:
- Error alerts show title and detailed message
- Console logs technical details for debugging
- User can retry or use alternate payment method

---

## Testing Checklist

### Happy Path:
- [ ] User clicks "Pay with PayPal"
- [ ] PayPal popup appears
- [ ] User logs in to PayPal
- [ ] Address is pre-filled
- [ ] User clicks "Pay Now"
- [ ] Payment is captured
- [ ] Order is created
- [ ] Redirected to success page with order_id

### Address Changes:
- [ ] User changes address in PayPal popup
- [ ] Cart updates with new address
- [ ] Shipping costs recalculate
- [ ] Payment continues with new address

### Error Scenarios:
- [ ] Missing PayPal Client ID - component doesn't render
- [ ] Payment declined - error shown to user
- [ ] Network error - error shown with retry option
- [ ] Invalid postal code - rejected by PayPal
- [ ] Cart update fails - error shown to user

### Multi-Currency:
- [ ] USD amounts format with 2 decimals
- [ ] JPY amounts format with 0 decimals
- [ ] EUR amounts format with 2 decimals

---

## Debugging Tips

### Enable Logging:
The component logs important steps:
```
[createOrder] Creating PayPal order...
[handleApprove] Capturing PayPal payment...
[handleApprove] Updating cart with PayPal data...
[handleApprove] Completing checkout...
[handleApprove] Order created successfully: order-12345
```

### Check Browser Console:
- PayPal script loading errors
- Network request failures
- Address parsing issues
- Order creation errors

### PayPal Sandbox:
Use these test accounts:
- **Buyer**: personal@example.com
- **Seller**: business@example.com
- See: https://developer.paypal.com/

### Medusa Logs:
Check backend logs for:
- Payment session creation
- Cart update responses
- Order creation confirmations
- Webhook processing

---

## Common Issues & Solutions

### Issue: PayPal button doesn't appear
**Cause**: Missing/invalid PAYPAL_CLIENT_ID
**Solution**: Verify `.env` file contains correct client ID, restart server

### Issue: Address not saving to cart
**Cause**: expressCheckoutClient failing
**Solution**: Check backend cart.server.ts endpoint, verify cart exists

### Issue: Payment captures but order not created
**Cause**: Checkout completion fails
**Solution**: Check backend logs, verify payment provider configuration

### Issue: Currency amounts incorrect
**Cause**: Decimal places not formatted for currency
**Solution**: Verify currency code and amount formatting logic

---

## Related Files

- [PaypalExpressCheckout.tsx](apps/storefront/app/components/checkout/StripePayment/PaypalExpressCheckout.tsx) - Main component
- [express-checkout-client.ts](apps/storefront/libs/util/checkout/express-checkout-client.ts) - API client
- [api.checkout.express.ts](apps/storefront/app/routes/api.checkout.express.ts) - Backend route
- [cart.server.ts](apps/storefront/libs/util/server/data/cart.server.ts) - Cart operations

---

## Security Considerations

1. **Client ID in Environment**: Stored in `.env`, loaded server-side, exposed to browser (PayPal requires this)
2. **Payment Capture**: Happens after user approval, verified with PayPal API
3. **Address Validation**: Both client-side and server-side validation
4. **Order Creation**: Verified on backend before returning to user
5. **No Secret Keys**: Secret keys stored only on backend, never exposed to frontend

---

## Future Enhancements

- [ ] Support PayPal subscription payments
- [ ] Add PayPal wallet for faster repeat purchases
- [ ] Implement PayPal Credit option
- [ ] Support multiple payment methods (cards, etc.)
- [ ] Add order details in PayPal popup
- [ ] Implement shipping method selection in popup
- [ ] Add discount code handling in popup
