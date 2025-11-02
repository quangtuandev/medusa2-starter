# PayPal Express Checkout Flow - Chi Tiết Xử Lý

## Luồng Thanh Toán PayPal

### 1. **User Click PayPal Button**
```
User clicks PayPal Buttons component
    ↓
PayPalScriptProvider renders PayPal UI
```

### 2. **Step 1: `handleCreateOrder` - Tạo Order trong PayPal**

Khi user click button "Pay with PayPal":

```typescript
const handleCreateOrder = (_data: any, actions: any) => {
  // Gọi PayPal SDK để tạo order
  return actions.order.create({
    intent: "CAPTURE",
    application_context: {
      shipping_preference: "NO_SHIPPING",
    },
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: "23.00"
      }
    }]
  });
}
```

**Kết quả:** PayPal trả về `orderId` (VD: `8UV76047UF1767050`)

**Điều gì xảy ra:**
- PayPal popup mở lên
- User nhập thông tin đăng nhập PayPal
- User review và approve payment

---

### 3. **Step 2: `handleOnShippingAddressChange` - Cập nhật Địa Chỉ (Optional)**

Nếu user thay đổi địa chỉ trong PayPal popup:

```typescript
const handleOnShippingAddressChange = async (data: any, actions: any) => {
  // Lấy địa chỉ mới từ PayPal
  const shippingAddress = parsePayPalAddress(data.shipping, data.payer);

  // Cập nhật cart trong Medusa backend
  const [updatedCartRes, updateError] = await expressCheckoutClient.update({
    cartId: currentCart.id,
    shippingAddress,
    complete: false,
  });

  return actions.resolve(); // Cho phép tiếp tục
}
```

---

### 4. **Step 3: `handleApprove` - User Approve Payment**

Sau khi user click "Complete Purchase" trong PayPal popup:

```typescript
const handleApprove = async (data: any, actions: any) => {
  setIsProcessing(true);

  // Step 3.1: Capture payment qua PayPal SDK
  const captureDetails = await actions.order.capture();
  // Response: {
  //   "id": "8UV76047UF1767050",
  //   "status": "COMPLETED",
  //   "payer": { "email_address": "user@example.com", ... }
  // }

  // Step 3.2: Parse thông tin từ PayPal
  const payer = captureDetails?.payer;
  const shippingAddress = parsePayPalAddress(shipping, payer);

  // Step 3.3: Cập nhật cart với info PayPal
  const [updatedCartRes, updateError] =
    await expressCheckoutClient.update({
      cartId: currentCart.id,
      email: payer?.email_address,
      shippingAddress,
      billingAddress,
      complete: false, // Chưa hoàn thành
    });

  // Response từ Medusa backend:
  // {
  //   "cart": { ... },
  //   "payment_collection": {
  //     "id": "pay_col_01K92F8ZKAFNGZ9SWGX3WY4F73",
  //     "status": "not_paid",
  //     "payment_sessions": [{
  //       "id": "payses_01K92F8ZKX9GB1NWKXYXASTX41",
  //       "provider_id": "pp_paypal_paypal",
  //       "data": { "id": "8UV76047UF1767050", ... }
  //     }]
  //   }
  // }

  // Step 3.4: Complete checkout tạo order trong Medusa
  const [checkoutRes, checkoutError] =
    await expressCheckoutClient.update({
      cartId: updatedCart.id,
      complete: true, // Hoàn thành = create order
    });

  // Response: { "order": { "id": "order_01K92...", ... } }
  const createdOrder = checkoutRes?.order;

  // Step 3.5: Redirect đến success page
  navigate(`/checkout/success?order_id=${createdOrder.id}`);
}
```

---

### 5. **Step 4: `handleError` - Xử Lý Lỗi**

Nếu có lỗi từ PayPal hoặc Medusa backend:

```typescript
const handleError = (err: any) => {
  console.error("PayPal error:", err);
  setErrorState({
    title: "PayPal Payment Error",
    description: err.message
  });
}
```

---

### 6. **Step 5: `handleCancel` - User Hủy**

Nếu user click cancel trong PayPal popup:

```typescript
const handleCancel = (_data: any) => {
  setErrorState({
    title: "Payment Cancelled",
    description: "Bạn đã hủy thanh toán"
  });
}
```

---

## Sơ Đồ Chi Tiết

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│              PayPal Buttons Component                        │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─► [1] handleCreateOrder()
           │   └─► actions.order.create()
           │       └─► PayPal API creates order
           │           └─► PayPal Popup Opens
           │
           ├─► [2] User logs into PayPal
           │       └─► User reviews amount
           │           └─► handleOnShippingAddressChange() [optional]
           │               └─► Update cart in Medusa
           │
           ├─► [3] User clicks "Complete Purchase"
           │       └─► handleApprove()
           │           │
           │           ├─► actions.order.capture()
           │           │   └─► PayPal captures payment
           │           │       └─► Returns payer info
           │           │
           │           ├─► expressCheckoutClient.update()
           │           │   └─► Update cart with PayPal info
           │           │       └─► Medusa updates payment_collection
           │           │
           │           ├─► expressCheckoutClient.update(complete: true)
           │           │   └─► Medusa creates order
           │           │       └─► Returns created order
           │           │
           │           └─► navigate() to success page
           │
           ├─► [4] Error occurs
           │   └─► handleError()
           │       └─► Show error message
           │
           └─► [5] User clicks cancel
               └─► handleCancel()
                   └─► Show cancel message
```

---

## API Responses

### Response từ `expressCheckoutClient.update()` (Step 3.3)

```json
{
  "cart": {
    "id": "cart_01K92F8ZKX9GB1NWKXYXASTX41",
    "total": 2300,
    "email": "customer@example.com"
  },
  "payment_collection": {
    "id": "pay_col_01K92F8ZKAFNGZ9SWGX3WY4F73",
    "currency_code": "usd",
    "status": "not_paid",
    "amount": 23,
    "payment_sessions": [
      {
        "id": "payses_01K92F8ZKX9GB1NWKXYXASTX41",
        "provider_id": "pp_paypal_paypal",
        "data": {
          "id": "8UV76047UF1767050",
          "status": "CREATED",
          "links": [
            {
              "rel": "approve",
              "href": "https://www.sandbox.paypal.com/checkoutnow?token=8UV76047UF1767050"
            },
            {
              "rel": "capture",
              "href": "https://api.sandbox.paypal.com/v2/checkout/orders/8UV76047UF1767050/capture"
            }
          ]
        },
        "status": "pending"
      }
    ]
  }
}
```

### Response từ `actions.order.capture()` (Step 3.1)

```json
{
  "id": "8UV76047UF1767050",
  "status": "COMPLETED",
  "payer": {
    "email_address": "customer@paypal.com",
    "name": {
      "given_name": "John",
      "surname": "Doe"
    }
  },
  "purchase_units": [
    {
      "amount": {
        "currency_code": "USD",
        "value": "23.00"
      }
    }
  ]
}
```

### Response từ `expressCheckoutClient.update(complete: true)` (Step 3.4)

```json
{
  "order": {
    "id": "order_01K92F8ZKAFNGZ9SWGX3WY4F73",
    "display_id": 1001,
    "status": "pending",
    "total": 2300,
    "email": "customer@example.com"
  }
}
```

---

## Key Points

1. **`handleCreateOrder`** - Tạo order trong PayPal (không phải Medusa)
2. **`handleApprove`** - Xử lý sau khi user approve trong PayPal popup
3. **`actions.order.capture()`** - Capture payment qua PayPal SDK
4. **`expressCheckoutClient.update()`** - Sync data với Medusa backend
5. **`complete: true`** - Signal Medusa để tạo order từ cart
6. **`getPayPalOrderIdFromResponse()`** - Extract PayPal order ID từ response

---

## Debugging Tips

```typescript
// Log PayPal order ID từ response
const getPayPalOrderIdFromResponse = (response: any): string | null => {
  const paymentSession = response?.payment_collection
    ?.payment_sessions?.[0];
  return paymentSession?.data?.id || null;
};

// Có thể sử dụng như sau:
const paypalOrderId = getPayPalOrderIdFromResponse(updatedCartRes);
console.log("PayPal Order ID:", paypalOrderId);
```
