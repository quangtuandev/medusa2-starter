# PayPal Helper Functions - Ví Dụ Sử Dụng

## 1. Extract PayPal Order Details

### Ví dụ 1: Lấy PayPal Order ID từ Response
```typescript
import { extractPayPalOrderDetails } from "@app/lib/paypal-helpers";

// Khi update cart với PayPal data
const [updatedCartRes, updateError] = await expressCheckoutClient.update({
  cartId: currentCart.id,
  email: payer?.email_address,
  shippingAddress,
  billingAddress,
  complete: false,
});

// Extract PayPal order details
const paypalDetails = extractPayPalOrderDetails(updatedCartRes);

if (paypalDetails) {
  console.log("PayPal Order ID:", paypalDetails.orderId);
  // Output: 8UV76047UF1767050

  console.log("Amount:", paypalDetails.amount);
  // Output: 23

  console.log("Currency:", paypalDetails.currencyCode);
  // Output: usd

  console.log("Payment Session ID:", paypalDetails.paymentSessionId);
  // Output: payses_01K92F8ZKX9GB1NWKXYXASTX41

  console.log("Status:", paypalDetails.status);
  // Output: CREATED
}
```

### Ví dụ 2: Sử dụng PayPal Order ID
```typescript
// Lưu trữ PayPal order ID để tracking
const paypalDetails = extractPayPalOrderDetails(response);
if (paypalDetails) {
  // Lưu vào state
  setPayPalOrderId(paypalDetails.orderId);

  // Gửi lên server
  await savePayPalOrderId(createdOrderId, paypalDetails.orderId);

  // Log cho monitoring
  logger.info(`PayPal payment processed for order ${createdOrderId}`, {
    paypalOrderId: paypalDetails.orderId,
    amount: paypalDetails.amount,
    currency: paypalDetails.currencyCode,
  });
}
```

---

## 2. Validate PayPal Capture Response

### Ví dụ 1: Kiểm tra Capture Status
```typescript
import { validatePayPalCaptureResponse } from "@app/lib/paypal-helpers";

const captureDetails = await actions.order.capture();

const validationResult = validatePayPalCaptureResponse(captureDetails);

if (!validationResult.valid) {
  // Capture failed
  throw new Error(validationResult.error);
  // Error: "Payment capture failed with status: DECLINED"
} else {
  // Capture successful
  console.log("Payment captured successfully");
  const payer = captureDetails.payer;
  // Continue with payment processing
}
```

### Ví dụ 2: Chi Tiết Validation
```typescript
const validationResult = validatePayPalCaptureResponse(captureDetails);

if (!validationResult.valid) {
  // Show user-friendly error
  setErrorState({
    title: "Payment Processing Error",
    description: validationResult.error || "An error occurred",
  });

  // Log for debugging
  console.error("Validation failed:", validationResult.error);

  // Send to monitoring service
  analytics.trackPaymentError({
    type: "capture_validation_failed",
    error: validationResult.error,
    captureDetails: captureDetails,
  });
}
```

---

## 3. Parse PayPal Payer Info

### Ví dụ 1: Extract Customer Info
```typescript
import { parsePayPalPayerInfo } from "@app/lib/paypal-helpers";

const payer = captureDetails?.payer;
const payerInfo = parsePayPalPayerInfo(payer);

console.log("Email:", payerInfo.email);
// Output: customer@paypal.com

console.log("First Name:", payerInfo.firstName);
// Output: John

console.log("Last Name:", payerInfo.lastName);
// Output: Doe

console.log("Full Name:", payerInfo.fullName);
// Output: John Doe

console.log("Phone:", payerInfo.phone);
// Output: 5551234567
```

### Ví dụ 2: Sử dụng Payer Info cho Update Cart
```typescript
const payerInfo = parsePayPalPayerInfo(payer);

// Update cart với payer email
const [updatedCartRes, error] = await expressCheckoutClient.update({
  cartId: currentCart.id,
  email: payerInfo.email, // Sử dụng email từ PayPal
  shippingAddress,
  billingAddress,
  complete: false,
});
```

---

## 4. Build PayPal Order Payload

### Ví dụ 1: Tạo Đơn Hàng Cơ Bản
```typescript
import { buildPayPalOrderPayload } from "@app/lib/paypal-helpers";

const payload = buildPayPalOrderPayload({
  amount: "23.00",
  currencyCode: "USD",
});

console.log(payload);
// Output:
// {
//   intent: "CAPTURE",
//   application_context: { ... },
//   purchase_units: [{
//     amount: {
//       currency_code: "USD",
//       value: "23.00",
//       breakdown: { ... }
//     },
//     items: [...]
//   }]
// }

return actions.order.create(payload);
```

### Ví dụ 2: Tạo Payload với Cart Total
```typescript
const payload = buildPayPalOrderPayload({
  amount: amountValue, // "23.00"
  currencyCode: currencyCode, // "USD"
  cartTotal: cartTotalValue, // "23.00"
});

const orderId = await actions.order.create(payload);
console.log("PayPal Order Created:", orderId);
```

### Ví dụ 3: Dynamic Amounts
```typescript
const calculateOrderAmount = (cart: StoreCart): string => {
  const total = cart.total || 0;
  const decimalPlaces = 2;
  return (total / 100).toFixed(decimalPlaces);
};

const amount = calculateOrderAmount(currentCart);
const payload = buildPayPalOrderPayload({
  amount,
  currencyCode: currentCart.currency_code?.toUpperCase() || "USD",
});

return actions.order.create(payload);
```

---

## 5. Format PayPal Amount

### Ví dụ 1: Format Với Different Currencies
```typescript
import { formatPayPalAmount } from "@app/lib/paypal-helpers";

// USD - 2 decimal places
console.log(formatPayPalAmount(2300, "USD"));
// Output: "23.00"

// JPY - 0 decimal places
console.log(formatPayPalAmount(2300, "JPY"));
// Output: "23"

// GBP - 2 decimal places
console.log(formatPayPalAmount(1050, "GBP"));
// Output: "10.50"
```

### Ví dụ 2: Display Amount
```typescript
const currencySymbol = getCurrencySymbol(currencyCode);
const formattedAmount = formatPayPalAmount(total, currencyCode);

console.log(`Order Total: ${currencySymbol} ${formattedAmount}`);
// Output: Order Total: $ 23.00
```

---

## 6. Check Payment Session Type

### Ví dụ 1: Filter PayPal Sessions
```typescript
import { isPayPalPaymentSession } from "@app/lib/paypal-helpers";

const paymentSessions = paymentCollection.payment_sessions || [];
const paypalSessions = paymentSessions.filter(isPayPalPaymentSession);

console.log("PayPal Sessions:", paypalSessions);
// Only PayPal sessions are returned
```

### Ví dụ 2: Get PayPal Order ID
```typescript
import { getPayPalOrderIdFromSession } from "@app/lib/paypal-helpers";

const paymentSession = paymentCollection.payment_sessions?.[0];
const orderId = getPayPalOrderIdFromSession(paymentSession);

if (orderId) {
  console.log("PayPal Order ID:", orderId);
  // Output: 8UV76047UF1767050
}
```

---

## 7. Error Messages

### Ví dụ 1: Sử dụng Centralized Error Messages
```typescript
import { PAYPAL_ERROR_MESSAGES } from "@app/lib/paypal-helpers";

if (!actions?.order) {
  throw new Error(PAYPAL_ERROR_MESSAGES.ORDER_NOT_AVAILABLE);
}

if (captureDetails?.status !== "COMPLETED") {
  throw new Error(PAYPAL_ERROR_MESSAGES.CAPTURE_FAILED);
}

if (!payer) {
  throw new Error(PAYPAL_ERROR_MESSAGES.PAYER_INFO_MISSING);
}
```

### Ví dụ 2: Display User-Friendly Messages
```typescript
catch (error: unknown) {
  const message = error instanceof Error
    ? error.message
    : PAYPAL_ERROR_MESSAGES.PAYMENT_ERROR;

  setErrorState({
    title: "Payment Processing Error",
    description: message,
  });
}
```

### Ví dụ 3: Log All Error Types
```typescript
const errorMessages = Object.entries(PAYPAL_ERROR_MESSAGES);

errorMessages.forEach(([key, message]) => {
  logger.info(`${key}: ${message}`);
});
```

---

## 8. Logging & Debugging

### Ví dụ 1: Log Payment Flow
```typescript
import { logPayPalFlow } from "@app/lib/paypal-helpers";

logPayPalFlow("ORDER_CREATED", { orderId: "8UV76047UF1767050" });
logPayPalFlow("PAYMENT_CAPTURED", captureDetails);
logPayPalFlow("CART_UPDATED", updatedCartRes);
```

### Ví dụ 2: Debug Response Structure
```typescript
const paypalDetails = extractPayPalOrderDetails(response);

if (!paypalDetails) {
  console.error("Failed to extract PayPal details from response:");
  console.log("Response structure:", {
    hasPaymentCollection: !!response?.payment_collection,
    sessions: response?.payment_collection?.payment_sessions?.length || 0,
    sessionIds: response?.payment_collection?.payment_sessions?.map(
      (s: any) => s.id
    ),
  });
}
```

---

## 9. Complete Flow Example

### Full Payment Processing
```typescript
import {
  buildPayPalOrderPayload,
  extractPayPalOrderDetails,
  validatePayPalCaptureResponse,
  parsePayPalPayerInfo,
  PAYPAL_ERROR_MESSAGES,
} from "@app/lib/paypal-helpers";

// Step 1: Create PayPal Order
const handleCreateOrder = async (_data: any, actions: any) => {
  const payload = buildPayPalOrderPayload({
    amount: amountValue,
    currencyCode: currencyCode,
  });

  return actions.order.create(payload);
};

// Step 2: Approve Payment
const handleApprove = async (_data: any, actions: any) => {
  try {
    // Capture payment
    const captureDetails = await actions.order.capture();

    // Validate response
    const validation = validatePayPalCaptureResponse(captureDetails);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Parse payer info
    const payerInfo = parsePayPalPayerInfo(captureDetails.payer);

    // Update cart
    const [response, error] = await expressCheckoutClient.update({
      cartId: currentCart.id,
      email: payerInfo.email,
      shippingAddress,
      billingAddress,
      complete: false,
    });

    // Extract PayPal details
    const paypalDetails = extractPayPalOrderDetails(response);
    console.log("PayPal Order Processed:", paypalDetails);

    // Complete checkout
    const [checkoutRes] = await expressCheckoutClient.update({
      cartId: response.cart.id,
      complete: true,
    });

    // Redirect to success
    navigate(`/checkout/success?order_id=${checkoutRes.order.id}`);
  } catch (error) {
    console.error(error);
    setErrorState({
      title: "Payment Error",
      description: error instanceof Error
        ? error.message
        : PAYPAL_ERROR_MESSAGES.PAYMENT_ERROR,
    });
  }
};
```

---

## 10. Type Safety Example

### Using TypeScript with Helpers
```typescript
import { extractPayPalOrderDetails, PayPalOrderDetails } from "@app/lib/paypal-helpers";

// Function with type safety
const trackPaymentProcessing = (response: any): void => {
  const paypalDetails: PayPalOrderDetails | null =
    extractPayPalOrderDetails(response);

  if (!paypalDetails) {
    return;
  }

  // Now TypeScript knows the properties
  const { orderId, amount, currencyCode, status } = paypalDetails;

  analytics.track("payment_processed", {
    paypalOrderId: orderId,
    amount: amount,
    currency: currencyCode,
    status: status,
  });
};
```

---

## Summary

Các helper functions giúp:
1. ✅ Giảm code duplication
2. ✅ Tăng type safety
3. ✅ Dễ maintain & test
4. ✅ Consistent error handling
5. ✅ Better debugging
6. ✅ Reusable across components
