import { Button } from '@app/components/common/buttons/Button';
import { useCheckout } from '@app/hooks/useCheckout';
import { CustomPaymentSession } from '@libs/types';
import { FC, useEffect, useState } from 'react';


interface BankTransferPaymentProps {
  isActiveStep: boolean;
  paymentMethods: CustomPaymentSession[];
}

export const BankTransferPayment: FC<BankTransferPaymentProps> = ({
  isActiveStep,
  paymentMethods,
}) => {
  const { cart, selectPaymentMethod, completeCheckout } = useCheckout();
  const [bankInfo, setBankInfo] = useState<{
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
    swiftCode?: string;
    qrCodeUrl?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Get bank transfer payment method from cart
    if (cart?.payment_sessions) {
      const bankTransferSession = cart.payment_sessions.find(
        (session) => session.provider_id === 'pp_bank_transfer'
      );

      if (bankTransferSession && bankTransferSession.data) {
        const data = bankTransferSession.data as any;
        setBankInfo({
          bankName: data.bankName,
          accountHolder: data.accountHolder,
          accountNumber: data.accountNumber,
          bankCode: data.bankCode,
          swiftCode: data.swiftCode,
          qrCodeUrl: data.qrCodeUrl,
        });
      }
    }
  }, [cart?.payment_sessions]);

  const handleSelectBankTransfer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Select bank transfer payment provider
      await selectPaymentMethod('pp_bank_transfer');

      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Failed to select bank transfer payment');
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Complete checkout with bank transfer
      await completeCheckout();

      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Failed to complete order');
      setIsLoading(false);
    }
  };

  const generateBankTransferQRString = (): string => {
    if (!bankInfo) return '';

    // Format: VietQR standard or simple format
    // VietQR: 00|0|accountNumber|bankCode|amount|purpose|recipientName
    const amount = cart?.totals?.raw?.total || 0;
    const purpose = `Order ${cart?.id}`;

    // Simple format: bank-transfer data as string
    return `BANK_TRANSFER:${bankInfo.accountNumber}:${bankInfo.bankName}:${amount}`;
  };

  return (
    <div className="bank-transfer-payment space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!bankInfo ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Select Bank Transfer to pay via bank wire. You'll receive payment instructions after placing the order.
          </p>

          <Button
            isLoading={isLoading}
            onClick={handleSelectBankTransfer}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Select Bank Transfer
          </Button>
        </div>
      ) : (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Bank Transfer Details</h3>

            <div className="space-y-3 bg-white p-4 rounded border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Bank:</span>
                <span className="text-gray-800">{bankInfo.bankName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Account Holder:</span>
                <span className="text-gray-800">{bankInfo.accountHolder}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Account Number:</span>
                <span className="text-gray-800 font-mono">{bankInfo.accountNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Bank Code:</span>
                <span className="text-gray-800 font-mono">{bankInfo.bankCode}</span>
              </div>

              {bankInfo.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">SWIFT Code:</span>
                  <span className="text-gray-800 font-mono">{bankInfo.swiftCode}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600 font-medium">Amount to Pay:</span>
                <span className="text-lg font-bold text-green-600">
                  {cart?.totals?.formatted_total}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {bankInfo.qrCodeUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Payment QR Code</h3>
                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showQR ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* {showQR && (
                <div className="flex justify-center bg-white p-4 rounded border border-gray-200">
                  <QRCode
                    value={bankInfo.qrCodeUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )} */}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded space-y-2">
            <h4 className="font-semibold text-blue-900">Payment Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Log into your bank account</li>
              <li>Create a transfer to the account details shown above</li>
              <li>Use your Order ID as the reference/memo</li>
              <li>Transfer the exact amount shown</li>
              <li>The admin will verify your payment and update your order status</li>
            </ol>
          </div>

          {/* Complete Order Button */}
          <Button
            isLoading={isLoading}
            onClick={handleCompleteOrder}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Complete Order
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your order will be marked as pending payment until verified by admin.
          </p>
        </div>
      )}
    </div>
  );
};
