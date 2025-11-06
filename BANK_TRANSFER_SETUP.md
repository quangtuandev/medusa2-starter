# Bank Transfer Payment Provider Setup

Hướng dẫn thiết lập payment provider cho chuyển khoản ngân hàng trong Medusa v2.

## 📋 Tổng quan

Provider này cho phép khách hàng thanh toán bằng cách chuyển khoản ngân hàng. Quy trình:

1. **Khách hàng chọn "Chuyển khoản ngân hàng"** ở bước thanh toán
2. **Hiển thị thông tin tài khoản + QR code** (nếu có)
3. **Khách hàng thực hiện chuyển khoản** vào tài khoản được cung cấp
4. **Admin vào order, xác nhận đã nhận tiền** thông qua API
5. **Order chuyển sang trạng thái paid** khi xác nhận thành công

## 🔧 Cài đặt Environment Variables

Thêm các biến sau vào `.env` trong thư mục `apps/medusa/`:

```env
# Bank Transfer Configuration
BANK_NAME=VietComBank
BANK_ACCOUNT_HOLDER=Your Company Name
BANK_ACCOUNT_NUMBER=1234567890
BANK_CODE=VCB
BANK_SWIFT_CODE=BFTVVNVX
BANK_QR_CODE_URL=https://example.com/qr-code.png
```

### Chi tiết các biến:

- **BANK_NAME**: Tên ngân hàng (ví dụ: VietComBank, Techcombank)
- **BANK_ACCOUNT_HOLDER**: Tên chủ tài khoản
- **BANK_ACCOUNT_NUMBER**: Số tài khoản ngân hàng
- **BANK_CODE**: Mã ngân hàng (ví dụ: VCB, TCB, ACB)
- **BANK_SWIFT_CODE**: (Tùy chọn) Mã SWIFT code cho chuyển khoản quốc tế
- **BANK_QR_CODE_URL**: (Tùy chọn) URL của QR code để thanh toán nhanh

## 📁 Cấu trúc Files

```
apps/medusa/
├── src/
│   ├── modules/payment/providers/
│   │   └── bank-transfer.ts          # Payment provider service
│   ├── api/admin/orders/[id]/
│   │   └── confirm-payment/
│   │       └── route.ts               # Admin API để xác nhận thanh toán
│   └── workflows/
│       └── confirm-bank-transfer-payment.ts  # Workflow xác nhận thanh toán
└── medusa-config.ts                   # (Đã cập nhật) Đăng ký provider

apps/storefront/
└── app/components/checkout/
    ├── BankTransferPayment/
    │   └── BankTransferPayment.tsx   # Component UI cho khách hàng
    └── CheckoutPayment.tsx            # (Đã cập nhật) Thêm bank transfer option
```

## 🎯 API Endpoints

### 1. Xác nhận Thanh toán (Admin)

**POST** `/admin/orders/{orderId}/confirm-payment`

**Request Body:**
```json
{
  "payment_id": "payment_xxxxx",
  "confirmed_by": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "order_id": "order_xxxxx",
    "payment_id": "payment_xxxxx",
    "order_status": "confirmed",
    "all_payments_confirmed": true,
    "payment_data": {
      "order_id": "order_xxxxx",
      "payment_id": "payment_xxxxx",
      "status": "confirmed"
    }
  }
}
```

**Error Responses:**
- `400`: Validation error hoặc missing parameters
- `404`: Order hoặc Payment không tìm thấy
- `500`: Lỗi server

### 2. Kiểm tra Trạng thái Thanh toán

**GET** `/admin/orders/{orderId}/confirm-payment?payment_id={paymentId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "order_xxxxx",
    "payment_id": "payment_xxxxx",
    "status": "confirmed",
    "confirmed_at": "2024-01-15T10:30:00Z",
    "confirmed_by": "admin@example.com"
  }
}
```

## 🔄 Payment Provider Methods

Provider `BankTransferProviderService` implements các methods:

- **`initiatePayment()`**: Khởi tạo payment session với thông tin ngân hàng
- **`authorizePayment()`**: Authorize payment (chờ confirmation)
- **`capturePayment()`**: Capture payment (yêu cầu payment đã confirmed)
- **`refundPayment()`**: Xử lý hoàn tiền
- **`cancelPayment()`**: Hủy thanh toán
- **`getPaymentStatus()`**: Lấy trạng thái thanh toán
- **`updatePayment()`**: Cập nhật thông tin thanh toán
- **`retrievePayment()`**: Lấy chi tiết thanh toán

## 🎨 Storefront UI

### BankTransferPayment Component

Component này hiển thị:

1. **Nút "Select Bank Transfer"** để khách hàng chọn method
2. **Thông tin tài khoản ngân hàng**:
   - Tên ngân hàng
   - Chủ tài khoản
   - Số tài khoản
   - Mã ngân hàng
   - SWIFT Code (nếu có)
   - Tổng tiền cần chuyển

3. **QR Code** (nếu đã cấu hình):
   - Có thể ẩn/hiện QR code
   - Khách hàng quét để thanh toán nhanh

4. **Hướng dẫn thanh toán**:
   - Các bước từng bước để khách hàng thực hiện chuyển khoản

5. **Nút "Complete Order"** để hoàn thành đơn hàng

## 💻 Usage Examples

### Frontend (Storefront)

```typescript
// BankTransferPayment component tự động:
// 1. Hiển thị thông tin ngân hàng
// 2. Cho phép khách hàng chọn bank transfer payment
// 3. Hoàn thành order với trạng thái payment pending

// Khách hàng điều hướng qua:
// 1. Chọn tab "Bank Transfer" ở checkout
// 2. Xem thông tin và QR code
// 3. Thực hiện chuyển khoản theo hướng dẫn
// 4. Click "Complete Order" để hoàn thành
```

### Backend (Admin API)

```bash
# Xác nhận thanh toán khi nhận được tiền
curl -X POST http://localhost:9000/admin/orders/order_xxxxx/confirm-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "payment_id": "payment_xxxxx",
    "confirmed_by": "admin@example.com"
  }'

# Kiểm tra trạng thái thanh toán
curl -X GET "http://localhost:9000/admin/orders/order_xxxxx/confirm-payment?payment_id=payment_xxxxx" \
  -H "Authorization: Bearer <admin-token>"
```

## 🔄 Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER CHECKOUT                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Select "Bank Transfer" Payment   │
        │                                  │
        │ - View Bank Account Info         │
        │ - View/Scan QR Code              │
        │ - See Payment Instructions       │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Complete Order                   │
        │ Status: awaiting_confirmation    │
        └──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   CUSTOMER TRANSFERS                         │
│              (Outside Medusa system)                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │   ADMIN RECEIVES PAYMENT         │
        │                                  │
        │ Admin verifies transfer received │
        │ via bank or other method         │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Admin Confirms Payment via API   │
        │ POST /admin/orders/[id]/         │
        │      confirm-payment             │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Workflow Updates Payment         │
        │ Status: confirmed                │
        │                                  │
        │ Order Status: paid/completed     │
        └──────────────────────────────────┘
```

## ⚙️ Workflow Configuration

Bank transfer provider được đăng ký trong `medusa-config.ts`:

```typescript
{
  resolve: './src/modules/payment/providers/bank-transfer',
  id: 'bank_transfer',
  options: {
    bankName: BANK_NAME,
    accountHolder: BANK_ACCOUNT_HOLDER,
    accountNumber: BANK_ACCOUNT_NUMBER,
    bankCode: BANK_CODE,
    swiftCode: BANK_SWIFT_CODE,
    qrCodeUrl: BANK_QR_CODE_URL,
  },
}
```

## 🧪 Testing

### 1. Local Development

```bash
# Start Medusa backend
cd apps/medusa
yarn dev

# Start storefront
cd apps/storefront
yarn dev

# Verify bank transfer provider is registered
curl http://localhost:9000/store/payment-methods
```

### 2. Storefront Flow

1. Truy cập checkout page
2. Chọn "Bank Transfer" tab
3. Xem thông tin tài khoản và QR code
4. Click "Complete Order"
5. Order sẽ có status "awaiting_confirmation"

### 3. Admin Confirmation

1. Truy cập Medusa Admin panel
2. Tìm order vừa tạo
3. Gọi API để xác nhận thanh toán:

```bash
curl -X POST http://localhost:9000/admin/orders/{orderId}/confirm-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "payment_id": "<paymentId>",
    "confirmed_by": "admin@medusa-test.com"
  }'
```

4. Kiểm tra order status - nên là "paid" hoặc "completed"

## 📝 Customize Bank Transfer Info

Chỉnh sửa `.env` để thay đổi thông tin ngân hàng:

```env
BANK_NAME=Techcombank
BANK_ACCOUNT_HOLDER=Tên Công Ty của Bạn
BANK_ACCOUNT_NUMBER=1920123456789
BANK_CODE=TCB
BANK_QR_CODE_URL=https://vietqr.io/api/generate?accountNo=1920123456789&bankCode=TCB&amount=1000000
```

## 🚀 Production Deployment

Khi deploy lên production:

1. **Cập nhật environment variables** trong production environment
2. **Đảm bảo bank account details chính xác**
3. **Cấu hình QR code URL** (nếu sử dụng)
4. **Cấu hình CORS** cho storefront và admin panel
5. **Test full flow** trước khi release

## 🔐 Security Notes

- **Bank account details** được lưu trong environment variables, không hardcode
- **Confirming payment** yêu cầu admin authentication
- **Payment data** được lưu trong database, có thể audit
- **Sensitive info** không được lưu trong session data

## 📞 Support & Troubleshooting

### Bank transfer option không hiển thị

1. Kiểm tra provider đã được register trong `medusa-config.ts`
2. Kiểm tra environment variables đã set
3. Restart Medusa backend
4. Kiểm tra storefront component import

### Payment confirmation thất bại

1. Kiểm tra order ID và payment ID
2. Kiểm tra user có quyền admin
3. Kiểm tra payment status hiện tại
4. Xem logs của Medusa backend

### QR Code không hiển thị

1. Kiểm tra `BANK_QR_CODE_URL` environment variable
2. Đảm bảo URL có thể truy cập
3. Kiểm tra format của QR code URL

## 📚 Related Files

- [Bank Transfer Provider](/apps/medusa/src/modules/payment/providers/bank-transfer.ts)
- [Confirm Payment Workflow](/apps/medusa/src/workflows/confirm-bank-transfer-payment.ts)
- [Admin API Endpoint](/apps/medusa/src/api/admin/orders/[id]/confirm-payment/route.ts)
- [Frontend Component](/apps/storefront/app/components/checkout/BankTransferPayment/BankTransferPayment.tsx)
- [Medusa Config](/apps/medusa/medusa-config.ts)
