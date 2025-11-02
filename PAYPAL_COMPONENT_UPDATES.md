# PayPal Component Updates - Chi Tiết Các Thay Đổi

## File: `apps/storefront/app/components/checkout/StripePayment/PaypalExpressCheckout.tsx`

---

## 1. Thêm Imports

### Trước:
```typescript
import { Alert } from "@app/components/common/alert";
import { useCheckout } from "@app/hooks/useCheckout";
// ... other imports
```

### Sau:
```typescript
import { Alert } from "@app/components/common/alert";
import { useCheckout } from "@app/hooks/useCheckout";
import { useCustomer } from "@app/hooks/useCustomer";
import { useEnv } from "@app/hooks/useEnv";
import { Address } from "@libs/types";
import { expressCheckoutClient } from "@libs/util/checkout/express-checkout-client";
import {
  buildPayPalOrderPayload,
  extractPayPalOrderDetails,
  validatePayPalCaptureResponse,
  PAYPAL_ERROR_MESSAGES,
  parsePayPalPayerInfo,
} from "@app/lib/paypal-helpers";
import { StoreCart } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { selectInitialShippingAddress } from "../checkout-form-helpers";
```

**Lý do:**
- Import các helper functions từ `paypal-helpers.ts`
- Giúp code cleaner, dễ maintain

---

## 2. Xóa Hàm `getPayPalOrderIdFromResponse()`

### Trước:
```typescript
const getPayPalOrderIdFromResponse = (response: any): string | null => {
  try {
    const paymentCollection = response?.payment_collection;
    if (!paymentCollection) {
      console.error("No payment_collection in response");
      return null;
    }

    const paymentSessions = paymentCollection.payment_sessions || [];
    const paypalSession = paymentSessions.find(
      (session: any) => session.provider_id?.includes("paypal")
    );

    if (!paypalSession) {
      console.error("No PayPal payment session found");
      return null;
    }

    const orderId = paypalSession.data?.id;
    if (!orderId) {
      console.error("No PayPal order ID in session data");
      return null;
    }

    console.log("Extracted PayPal Order ID:", orderId);
    return orderId;
  } catch (error) {
    console.error("Error extracting PayPal order ID:", error);
    return null;
  }
};
```

### Sau:
```typescript
// Hàm này đã được di chuyển sang paypal-helpers.ts
// và được replace bằng extractPayPalOrderDetails()
```

**Lý do:**
- Tách logic vào utility file
- Dễ reuse trong các component khác
- Tập trung utilities vào một chỗ

---

## 3. Cập Nhật `handleApprove()` Handler

### Trước (Một số đoạn):
```typescript
const handleApprove = async (_data: any, actions: any) => {
  try {
    setIsProcessing(true);
    setErrorState(null);

    if (!actions?.order) {
      throw new Error("PayPal order actions not available");
    }

    // Step 1: Capture the payment
    console.log("Capturing PayPal payment...");
    const captureDetails = await actions.order.capture();

    if (captureDetails?.status !== "COMPLETED") {
      throw new Error(
        `Payment capture failed with status: ${captureDetails?.status}`
      );
    }
    console.log(captureDetails, 'data');

    const payer = captureDetails?.payer;
    // ...
  }
}
```

### Sau:
```typescript
const handleApprove = async (data: any, actions: any) => {
  try {
    setIsProcessing(true);
    setErrorState(null);

    if (!actions?.order) {
      throw new Error(PAYPAL_ERROR_MESSAGES.ORDER_NOT_AVAILABLE);
    }

    console.log("User approved payment in PayPal, capturing order...");

    // Step 1: Capture the payment via PayPal SDK
    const captureDetails = await actions.order.capture();

    // Validate capture response
    const validationResult = validatePayPalCaptureResponse(captureDetails);
    if (!validationResult.valid) {
      throw new Error(validationResult.error || PAYPAL_ERROR_MESSAGES.CAPTURE_FAILED);
    }

    console.log("PayPal payment captured successfully:", captureDetails);

    const payer = captureDetails?.payer;
    const shipping = initialShippingAddress;

    // Step 2: Parse and validate address
    const shippingAddress = parsePayPalAddress(shipping, payer);
    if (!shippingAddress.postalCode) {
      throw new Error("Postal code is required but not provided by PayPal");
    }

    const payerInfo = parsePayPalPayerInfo(payer);

    const billingAddress: Address = {
      ...shippingAddress,
      company: shippingAddress.firstName,
    };

    // Step 3: Update cart with PayPal data
    console.log("Updating cart with PayPal payment details...");
    const [updatedCartRes, updateError] = await expressCheckoutClient.update(
      {
        cartId: currentCart.id,
        email: payerInfo.email || currentCart.email || undefined,
        shippingAddress,
        billingAddress,
        complete: false,
      }
    );

    if (updateError) {
      throw new Error(PAYPAL_ERROR_MESSAGES.CART_UPDATE_FAILED);
    }

    const updatedCart = updatedCartRes?.cart;
    if (!updatedCart) {
      throw new Error("Cart update returned no cart data");
    }

    // Extract and log PayPal order details from response
    const paypalDetails = extractPayPalOrderDetails(updatedCartRes);
    if (paypalDetails) {
      console.log("PayPal Order Details:", paypalDetails);
    }

    setCurrentCart(updatedCart);

    // Step 4: Complete checkout and create order in Medusa
    console.log("Completing checkout and creating order...");
    const [checkoutRes, checkoutError] = await expressCheckoutClient.update(
      {
        cartId: updatedCart.id,
        complete: true,
      }
    );

    if (checkoutError) {
      throw new Error(PAYPAL_ERROR_MESSAGES.CHECKOUT_FAILED);
    }

    const createdOrder = checkoutRes?.order;
    if (!createdOrder?.id) {
      throw new Error(PAYPAL_ERROR_MESSAGES.ORDER_CREATION_FAILED);
    }

    console.log("Order created successfully in Medusa:", createdOrder.id);

    // Step 5: Redirect to success page
    setIsProcessing(false);
    navigate(`/checkout/success?order_id=${createdOrder.id}`);
  } catch (error: unknown) {
    // Error handling...
  }
}
```

**Các Thay Đổi Chính:**
1. ✅ Sử dụng `PAYPAL_ERROR_MESSAGES.ORDER_NOT_AVAILABLE` thay vì hardcoded string
2. ✅ Sử dụng `validatePayPalCaptureResponse()` để validate response
3. ✅ Sử dụng `parsePayPalPayerInfo()` để parse payer info
4. ✅ Sử dụng `extractPayPalOrderDetails()` để extract PayPal order details
5. ✅ Sử dụng error messages từ `PAYPAL_ERROR_MESSAGES` object
6. ✅ Better comments & logging

---

## 4. Cập Nhật `handleCreateOrder()` Handler

### Trước:
```typescript
const handleCreateOrder = (_data: any, actions: any) => {
  try {
    return actions.order.create({
      intent: "CAPTURE",
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
      purchase_units: [
        {
          amount: {
            currency_code: currencyCode,
            value: amountValue,
          }
        },
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create PayPal order";
    setErrorState({ title: "Order Creation Error", description: message });
    throw error;
  }
};
```

### Sau:
```typescript
const handleCreateOrder = (_data: any, actions: any) => {
  try {
    console.log("Creating PayPal order with amount:", amountValue, currencyCode);

    // Create order in PayPal - NOT in Medusa backend yet
    // Backend order will be created AFTER user approves and completes checkout
    const payload = buildPayPalOrderPayload({
      amount: amountValue,
      currencyCode,
      cartTotal: amountValue,
    });

    return actions.order.create(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create PayPal order";
    console.error("Create order error:", error);
    setErrorState({ title: "Order Creation Error", description: message });
    throw error;
  }
};
```

**Các Thay Đổi:**
1. ✅ Sử dụng `buildPayPalOrderPayload()` helper để build request
2. ✅ Code cleaner & reusable
3. ✅ Better comments

---

## 5. Thêm `handleCancel()` Handler (NEW)

### Sau:
```typescript
/**
 * Handle when user cancels PayPal payment
 */
const handleCancel = (_data: any) => {
  console.log("User cancelled PayPal payment");
  setErrorState({
    title: "Payment Cancelled",
    description: "You cancelled the PayPal payment. Please try again if you wish to proceed.",
  });
};
```

**Lý do:**
- Xử lý khi user click cancel trong PayPal popup
- User thấy clear message về cancel
- Better UX

---

## 6. Cập Nhật `handleError()` Handler

### Trước:
```typescript
const handleError = (err: any) => {
  console.error("PayPal error:", err);
  const message = err instanceof Error ? err.message : "An error occurred with PayPal. Please try again.";
  setErrorState({ title: "PayPal Payment Error", description: message });
};
```

### Sau:
```typescript
/**
 * Handle PayPal errors
 */
const handleError = (err: any) => {
  console.error("PayPal error:", err);
  const message = err instanceof Error ? err.message : "An error occurred with PayPal. Please try again.";
  setErrorState({ title: "PayPal Payment Error", description: message });
};
```

**Thay Đổi:**
- Thêm JSDoc comment
- Cấu trúc code rõ ràng hơn

---

## 7. Cập Nhật `PayPalButtons` Component Props

### Trước:
```typescript
<PayPalButtons
  style={{
    layout: "vertical",
    color: "blue",
    shape: "rect",
    label: "pay",
    ...styles,
  }}
  createOrder={handleCreateOrder}
  onApprove={handleApprove}
  onError={handleError}
  disabled={isProcessing}
/>
```

### Sau:
```typescript
<PayPalButtons
  style={{
    layout: "vertical",
    color: "blue",
    shape: "rect",
    label: "pay",
    ...styles,
  }}
  createOrder={handleCreateOrder}
  onApprove={handleApprove}
  onError={handleError}
  onCancel={handleCancel}
  disabled={isProcessing}
/>
```

**Thay Đổi:**
- Thêm `onCancel={handleCancel}` prop
- Xử lý trường hợp user hủy payment

---

## Summary of Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Error Handling** | Hardcoded strings | `PAYPAL_ERROR_MESSAGES` constant |
| **Code Duplication** | Logic in component | Moved to `paypal-helpers.ts` |
| **Response Validation** | Manual checks | `validatePayPalCaptureResponse()` |
| **Payer Info Parsing** | Manual parsing | `parsePayPalPayerInfo()` |
| **PayPal Details Extraction** | Inline function | `extractPayPalOrderDetails()` |
| **Order Payload Building** | Inline object | `buildPayPalOrderPayload()` |
| **Cancel Handling** | ❌ Missing | ✅ `handleCancel()` |
| **Documentation** | Minimal | Comprehensive JSDoc |
| **Type Safety** | Limited | Better with helpers |
| **Maintainability** | Harder | Easier (centralized logic) |
| **Reusability** | Not possible | Helper functions reusable |
| **Testing** | Harder to test | Easier (testable helpers) |

---

## Testing Checklist

- [ ] PayPal button renders
- [ ] `handleCreateOrder()` called when clicking button
- [ ] PayPal popup opens
- [ ] User can login & approve
- [ ] `handleApprove()` triggered after approval
- [ ] `validatePayPalCaptureResponse()` works correctly
- [ ] `parsePayPalPayerInfo()` extracts all fields
- [ ] `extractPayPalOrderDetails()` gets correct order ID
- [ ] Cart updated with PayPal data
- [ ] Order created in Medusa
- [ ] Redirect to success page works
- [ ] `handleCancel()` shows cancel message
- [ ] `handleError()` shows error message
- [ ] Error messages are user-friendly

---

## Next Steps

1. **Deploy Changes**
   - Test in development environment
   - Verify all handlers work
   - Check error cases

2. **Add Monitoring**
   - Log payment events
   - Track PayPal order IDs
   - Monitor failures

3. **Add Webhook Handling**
   - Handle PayPal webhooks
   - Update order status
   - Sync with Medusa

4. **Add Refund Support**
   - Implement refund flow
   - Handle partial refunds
   - Track refund history

5. **Optimize**
   - Cache PayPal config
   - Reduce API calls
   - Improve performance
