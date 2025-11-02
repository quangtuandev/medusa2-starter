# PayPal Integration - Testing Checklist

## Pre-Testing Setup

### Environment Configuration
- [ ] `apps/medusa/.env` contains `PAYPAL_CLIENT_ID`
- [ ] `apps/medusa/.env` contains `PAYPAL_CLIENT_SECRET`
- [ ] PayPal credentials are from sandbox environment
- [ ] `.env` file not committed to git (security)

### Backend Setup
- [ ] Medusa running: `cd apps/medusa && yarn dev`
- [ ] Backend accessible at `http://localhost:7901`
- [ ] Admin panel accessible at `http://localhost:9000`
- [ ] No errors in backend terminal

### Frontend Setup
- [ ] Storefront running: `cd apps/storefront && yarn dev`
- [ ] Storefront accessible at `http://localhost:3000`
- [ ] No TypeScript errors
- [ ] No console errors

---

## Unit Tests

### Helper Functions
- [ ] `validatePayPalCaptureResponse()` validates correctly
- [ ] `parsePayPalPayerInfo()` extracts email and name
- [ ] `extractPayPalOrderDetails()` finds PayPal order ID
- [ ] `buildPayPalOrderPayload()` creates valid payload
- [ ] `formatPayPalAmount()` handles currencies correctly

**Run**:
```bash
cd apps/storefront
npm test -- paypal-helpers.test.ts
```

---

## Integration Tests

### Component Tests
- [ ] PaypalExpressCheckout renders without errors
- [ ] PayPal SDK loads asynchronously
- [ ] PayPal buttons component renders
- [ ] Processing state shows loading spinner
- [ ] Error messages display correctly

### Address Parsing (PRIMARY FIX)
- [ ] `parsePayPalAddress()` extracts address_line_1 correctly ✅
- [ ] `parsePayPalAddress()` extracts address_line_2 correctly ✅
- [ ] `parsePayPalAddress()` extracts city (admin_area_2) correctly ✅
- [ ] `parsePayPalAddress()` extracts province (admin_area_1) correctly ✅
- [ ] `parsePayPalAddress()` extracts postal_code correctly ✅
- [ ] Phone number extracts with fallback ✅

---

## E2E Testing (Sandbox)

### Step 1: Product Selection
- [ ] Browse products at `http://localhost:3000`
- [ ] Add product to cart
- [ ] Verify cart total updates
- [ ] Proceed to checkout

### Step 2: Checkout Flow
- [ ] Account details form visible
- [ ] Enter email or login as customer
- [ ] Delivery method selection visible
- [ ] Select shipping method
- [ ] Shipping cost calculated correctly

### Step 3: Payment Method Selection
- [ ] Payment tab becomes active
- [ ] PayPal tab visible (PRIMARY FIX)
- [ ] PayPal tab selectable
- [ ] Credit Card tab also visible
- [ ] Can switch between tabs

### Step 4: PayPal Payment (MAIN TEST)
- [ ] Click PayPal tab
- [ ] PayPal buttons render
- [ ] Click "Pay with PayPal" button
- [ ] PayPal popup opens
- [ ] Can login to PayPal sandbox account

### Step 5: PayPal Sandbox Login
- [ ] Login successful with sandbox account
- [ ] Shipping address displays
- [ ] Amount shows correctly
- [ ] Currency is correct

### Step 6: Payment Approval
- [ ] Click "Continue" or "Approve" in PayPal
- [ ] Redirects back to storefront
- [ ] Processing spinner shows
- [ ] No errors in console

### Step 7: Address Verification (CRITICAL TEST)
- [ ] Order confirmation page shows address
- [ ] **Address line 1 populated** ✅ (Was empty before fix)
- [ ] **Address line 2 populated** ✅ (Was empty before fix)
- [ ] **City populated** ✅ (Was empty before fix)
- [ ] **Province populated** ✅ (Was empty before fix)
- [ ] **Postal code populated** ✅ (Was empty before fix)
- [ ] **Phone number populated** ✅ (Was empty before fix)

### Step 8: Order Verification
- [ ] Order created in Medusa
- [ ] Order visible in admin: `http://localhost:9000/app/orders`
- [ ] Order shows PayPal as payment method
- [ ] Order total matches cart total
- [ ] Payment status shows as completed

### Step 9: Email Confirmation
- [ ] Confirmation email sent (check logs)
- [ ] Email contains order number
- [ ] Email contains order total
- [ ] Email contains shipping address

---

## Error Handling Tests

### Test: Cancel Payment
- [ ] Start PayPal payment
- [ ] Click "Cancel" in PayPal popup
- [ ] Error message displays
- [ ] User can try again
- [ ] Order not created

**Expected Error**: "Payment Cancelled"

### Test: Insufficient Funds
- [ ] Use PayPal account with low balance
- [ ] Start payment
- [ ] Payment fails in PayPal
- [ ] Error message displays
- [ ] Order not created

**Expected Error**: "Payment capture failed"

### Test: Expired Session
- [ ] Start PayPal payment
- [ ] Wait 15+ minutes before approving
- [ ] Session may expire
- [ ] Error message if applicable

**Expected**: Either auto-refresh or error

### Test: Network Error
- [ ] Start payment
- [ ] Disconnect internet during processing
- [ ] Error handling activated
- [ ] Graceful error message
- [ ] Can retry

**Expected Error**: Network or connection error

---

## Multi-Currency Tests

### USD (Default)
- [ ] Amount formatted as "100.00"
- [ ] Currency code: USD
- [ ] Decimal places: 2

### JPY (Zero Decimals)
- [ ] Amount formatted as "100" (no decimals)
- [ ] Currency code: JPY
- [ ] Decimal places: 0

### EUR (Two Decimals)
- [ ] Amount formatted as "100.00"
- [ ] Currency code: EUR
- [ ] Decimal places: 2

**Test**: Change currency in Medusa admin and verify formatting

---

## UI/UX Tests

### Layout
- [ ] PayPal button fully visible
- [ ] No overlapping elements
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Styling
- [ ] PayPal button has blue color
- [ ] Button text reads "Pay with PayPal"
- [ ] Button has rounded corners
- [ ] Hover state shows feedback
- [ ] Disabled state shows correctly during processing

### Accessibility
- [ ] Button has accessible label
- [ ] Error messages readable
- [ ] Tab order logical
- [ ] Keyboard navigation works

---

## Performance Tests

### Page Load
- [ ] Checkout page loads quickly
- [ ] PayPal SDK loads asynchronously
- [ ] No layout shift when SDK loads
- [ ] No console errors during load

### Processing
- [ ] Payment processing completes in <30 seconds
- [ ] Spinner shows during processing
- [ ] No duplicate requests
- [ ] No memory leaks

**Test**: Use browser DevTools → Performance tab

---

## Integration with Other Features

### Stripe Payment
- [ ] Stripe tab still works
- [ ] Can switch between PayPal and Stripe
- [ ] Only selected payment method is charged

### Manual Payment (Dev)
- [ ] Manual payment tab still works
- [ ] All three payment methods functional

### Different Shipping Methods
- [ ] PayPal works with standard shipping
- [ ] PayPal works with express shipping
- [ ] PayPal works with free shipping
- [ ] Costs calculate correctly

---

## Production Checklist

### Before Going Live
- [ ] All tests above pass
- [ ] Production PayPal credentials obtained
- [ ] PayPal environment set to 'production'
- [ ] CORS configured for production domain
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Webhook configured in PayPal
- [ ] SSL certificate valid
- [ ] Database backups configured

### First Week in Production
- [ ] Monitor payment success rate
- [ ] Check for errors in logs
- [ ] Monitor customer support requests
- [ ] Verify emails sending correctly
- [ ] Check analytics

---

## Sign-Off

**Tester Name**: _______________
**Date**: _______________
**Result**: PASS / FAIL

**Issues Found** (if any):
```
1. 
2. 
3. 
```

**Notes**:
```


```

---

## Quick Test (5 minutes)

For quick validation:

1. Open http://localhost:3000
2. Add product to cart
3. Checkout → Select PayPal
4. Approve payment in sandbox
5. Verify address populated (was empty before fix) ✅
6. Check order created in admin

**Pass Criteria**: Order created with populated address fields

---

Last Updated: 2025-11-02
