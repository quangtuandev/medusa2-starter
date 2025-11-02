# PayPal Express Checkout - Bắt Đầu Nhanh

## Các File Đã Thay Đổi/Tạo

### 1. Component (Cập Nhật)
- `apps/storefront/app/components/checkout/StripePayment/PaypalExpressCheckout.tsx`

### 2. Helper Functions (Tạo Mới)
- `apps/storefront/app/lib/paypal-helpers.ts`

### 3. Tài Liệu (Tạo Mới)
- `PAYPAL_FLOW_EXPLANATION.md` - Chi tiết luồng thanh toán
- `PAYPAL_IMPLEMENTATION_SUMMARY.md` - Tóm tắt thay đổi
- `PAYPAL_COMPONENT_UPDATES.md` - Thay đổi component
- `PAYPAL_USAGE_EXAMPLES.md` - Ví dụ sử dụng

---

## Luồng Thanh Toán PayPal (Tóm Tắt)

```
1. User Click Button
   ↓
2. handleCreateOrder()
   - Tạo order trong PayPal SDK
   - PayPal popup opens
   ↓
3. User Approve Trong PayPal
   ↓
4. handleApprove()
   - actions.order.capture() → Capture payment
   - Update cart với PayPal data
   - Complete checkout → Create order trong Medusa
   - Redirect to success page
   ↓
5. Success!
```

---

## Key Functions

### 1. `handleCreateOrder()`
**Khi:** User click PayPal button
**Làm gì:** Tạo order trong PayPal SDK
**Response:** PayPal order ID

```typescript
const handleCreateOrder = (_data: any, actions: any) => {
  const payload = buildPayPalOrderPayload({
    amount: amountValue,
    currencyCode,
  });
  return actions.order.create(payload);
};
```

### 2. `handleApprove()`
**Khi:** User approve trong PayPal popup
**Làm gì:** Xử lý payment, update cart, tạo order
**Response:** Redirect to success

```typescript
const handleApprove = async (data: any, actions: any) => {
  // Step 1: Capture payment
  const captureDetails = await actions.order.capture();

  // Step 2: Validate & parse
  const validationResult = validatePayPalCaptureResponse(captureDetails);
  const payerInfo = parsePayPalPayerInfo(captureDetails.payer);

  // Step 3: Update cart
  const [updatedCartRes] = await expressCheckoutClient.update({...});

  // Step 4: Extract PayPal order details
  const paypalDetails = extractPayPalOrderDetails(updatedCartRes);

  // Step 5: Complete checkout
  const [checkoutRes] = await expressCheckoutClient.update({
    complete: true,
  });

  // Step 6: Redirect
  navigate(`/checkout/success?order_id=${checkoutRes.order.id}`);
};
```

### 3. `handleCancel()`
**Khi:** User hủy payment
**Làm gì:** Show cancel message

### 4. `handleError()`
**Khi:** Có lỗi
**Làm gì:** Show error message

---

## Helper Functions

### `buildPayPalOrderPayload()`
Build request payload cho PayPal order creation

```typescript
const payload = buildPayPalOrderPayload({
  amount: "23.00",
  currencyCode: "USD",
});
```

### `validatePayPalCaptureResponse()`
Validate capture response status

```typescript
const result = validatePayPalCaptureResponse(captureDetails);
if (!result.valid) {
  throw new Error(result.error);
}
```

### `parsePayPalPayerInfo()`
Extract payer information

```typescript
const payerInfo = parsePayPalPayerInfo(payer);
console.log(payerInfo.email); // customer@paypal.com
console.log(payerInfo.fullName); // John Doe
```

### `extractPayPalOrderDetails()`
Extract PayPal order ID từ response

```typescript
const details = extractPayPalOrderDetails(response);
console.log(details.orderId); // 8UV76047UF1767050
console.log(details.amount); // 23
console.log(details.currencyCode); // usd
```

### `formatPayPalAmount()`
Format amount với correct decimal places

```typescript
formatPayPalAmount(2300, "USD"); // "23.00"
formatPayPalAmount(2300, "JPY"); // "23"
```

### `PAYPAL_ERROR_MESSAGES`
Centralized error messages

```typescript
PAYPAL_ERROR_MESSAGES.ORDER_NOT_AVAILABLE
PAYPAL_ERROR_MESSAGES.CAPTURE_FAILED
PAYPAL_ERROR_MESSAGES.CART_UPDATE_FAILED
PAYPAL_ERROR_MESSAGES.CHECKOUT_FAILED
PAYPAL_ERROR_MESSAGES.ORDER_CREATION_FAILED
PAYPAL_ERROR_MESSAGES.PAYMENT_CANCELLED
```

---

## API Response Examples

### 1. Create Order Response
```json
{
  "id": "8UV76047UF1767050",
  "status": "CREATED",
  "links": [...]
}
```

### 2. Capture Response
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
  }
}
```

### 3. Cart Update Response
```json
{
  "cart": { ... },
  "payment_collection": {
    "payment_sessions": [{
      "provider_id": "pp_paypal_paypal",
      "data": {
        "id": "8UV76047UF1767050"
      }
    }]
  }
}
```

### 4. Checkout Complete Response
```json
{
  "order": {
    "id": "order_01K92F8ZKAFNGZ9SWGX3WY4F73",
    "display_id": 1001,
    "status": "pending"
  }
}
```

---

## Debugging

### Check Logs
```
[Log] Creating PayPal order with amount: 23.00 USD
[Log] User approved payment in PayPal, capturing order...
[Log] PayPal payment captured successfully: {...}
[Log] PayPal Order Details: { orderId: "...", ... }
[Log] Order created successfully in Medusa: order_...
```

### Common Errors
| Error | Cause | Solution |
|-------|-------|----------|
| `ORDER_NOT_AVAILABLE` | `actions.order` not provided | Check PayPal SDK initialization |
| `CAPTURE_FAILED` | Payment capture failed | Check PayPal sandbox settings |
| `CART_UPDATE_FAILED` | Backend error | Check Medusa API response |
| `ORDER_CREATION_FAILED` | Order not created | Check cart completion |

---

## Testing

```typescript
// 1. Test create order
await handleCreateOrder(null, actions);
// → Verify PayPal popup opens

// 2. Test approve
await handleApprove(null, actions);
// → Verify capture, cart update, order creation

// 3. Test cancel
handleCancel(null);
// → Verify error message shows

// 4. Test error
handleError(new Error("Test error"));
// → Verify error message shows
```

---

## Next Steps

1. **Run the application**
   ```bash
   yarn dev
   ```

2. **Test PayPal flow**
   - Go to checkout page
   - Click PayPal button
   - Complete payment in sandbox
   - Verify order created

3. **Monitor payment events**
   - Check browser console logs
   - Check Medusa admin for order
   - Verify payment_collection in cart

4. **Implement additional features** (optional)
   - Webhook handling
   - Refund support
   - Payment reconciliation

---

## Support

See detailed documentation:
- `PAYPAL_FLOW_EXPLANATION.md` - Full flow details
- `PAYPAL_USAGE_EXAMPLES.md` - Code examples
- `PAYPAL_COMPONENT_UPDATES.md` - Component changes
