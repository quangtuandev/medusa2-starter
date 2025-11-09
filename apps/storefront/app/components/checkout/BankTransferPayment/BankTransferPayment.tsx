import { Button } from '@app/components/common/buttons/Button';
import { useCheckout } from '@app/hooks/useCheckout';
import { CompleteCheckoutForm } from '../CompleteCheckoutForm';
import { CustomPaymentSession } from '@libs/types';
import { formatPrice } from '@libs/util/prices';
import { FC, useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

interface BankAccount {
  id: string;
  name: string;
  account_holder: string;
  account_number: string;
  bank_code: string;
  swift_code?: string | null;
  qr_code_url?: string | null;
  display_order: number;
}

interface BankTransferPaymentProps {
  isActiveStep: boolean;
  paymentMethods: CustomPaymentSession[];
}

export const BankTransferPayment: FC<BankTransferPaymentProps> = ({
  isActiveStep,
  paymentMethods,
}) => {
  const { cart } = useCheckout();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');
  const [bankInfo, setBankInfo] = useState<{
    id: string;
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
  const bankAccountsFetcher = useFetcher<{ bank_accounts: BankAccount[]; count: number }>();

  // Fetch bank accounts
  useEffect(() => {
    if (bankAccountsFetcher.state === 'idle' && !bankAccountsFetcher.data) {
      bankAccountsFetcher.load('/api/bank-accounts');
    }
  }, []);

  useEffect(() => {
    if (bankAccountsFetcher.data?.bank_accounts) {
      setBankAccounts(bankAccountsFetcher.data.bank_accounts);
      // Auto-select first bank account if available
      if (bankAccountsFetcher.data.bank_accounts.length > 0 && !selectedBankAccountId) {
        setSelectedBankAccountId(bankAccountsFetcher.data.bank_accounts[0].id);
      }
    }
  }, [bankAccountsFetcher.data]);

  // Get bank info from payment session
  // Only show bank info if payment session exists (user has selected bank transfer)
  useEffect(() => {
    if (cart?.payment_collection?.payment_sessions) {
      const bankTransferSession = cart.payment_collection.payment_sessions.find(
        (session) => session.provider_id === 'pp_bank_transfer_bank_transfer'
      );

      if (bankTransferSession && bankTransferSession.data) {
        const sessionData = bankTransferSession.data as any;

        // If bank_account_id is stored in session data, use it
        if (sessionData.bank_account_id) {
          const accountId = sessionData.bank_account_id;
          setSelectedBankAccountId(accountId);

          // Find bank account from fetched list
          if (bankAccounts.length > 0) {
            const bankAccount = bankAccounts.find((bank) => bank.id === accountId);
            if (bankAccount) {
              setBankInfo({
                id: bankAccount.id,
                bankName: bankAccount.name,
                accountHolder: bankAccount.account_holder,
                accountNumber: bankAccount.account_number,
                bankCode: bankAccount.bank_code,
                swiftCode: bankAccount.swift_code || undefined,
                qrCodeUrl: bankAccount.qr_code_url || undefined,
              });
              return;
            }
          }
        }
      }
    }

    // If no payment session exists, clear bank info
    // This ensures CompleteCheckoutForm only shows after payment session is created
    setBankInfo(null);
  }, [cart?.payment_collection?.payment_sessions, bankAccounts]);

  const handleSelectBankTransfer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!cart) {
        throw new Error('Cart not found');
      }

      if (!selectedBankAccountId) {
        throw new Error('Please select a bank account');
      }

      // Create a form data to submit payment session
      const formData = new FormData();
      formData.append('provider_id', 'pp_bank_transfer_bank_transfer');
      formData.append('bank_account_id', selectedBankAccountId);

      // Call API to initiate payment session
      const response = await fetch('/api/checkout/payment-session', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to select bank transfer payment');
      }

      // Reload the page to refresh cart data
      window.location.reload();
    } catch (err) {
      setError((err as Error).message || 'Failed to select bank transfer payment');
      setIsLoading(false);
    }
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
            Select a bank account and then choose Bank Transfer to pay via bank wire. You'll receive payment instructions after placing the order.
          </p>

          {bankAccounts.length > 0 ? (
            <>
              <div className="space-y-2">
                <label htmlFor="bank-account" className="block text-sm font-medium text-gray-700">
                  Select Bank Account
                </label>
                <select
                  id="bank-account"
                  value={selectedBankAccountId}
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {bankAccounts.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name} - {bank.account_number}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleSelectBankTransfer}
                disabled={!selectedBankAccountId || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Select Bank Transfer'}
              </Button>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              No bank accounts available. Please contact support.
            </div>
          )}
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
                  {formatPrice(cart?.total || 0, {
                    currency: cart?.region?.currency_code,
                  })}
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

          <p className="text-xs text-gray-500 text-center">
            Your order will be marked as pending payment until verified by admin.
          </p>
        </div>
      )}

      {/* Complete Checkout Form - Only show when bank info is selected */}
      {bankInfo && (
        <CompleteCheckoutForm
          providerId="pp_bank_transfer_bank_transfer"
          id="BankTransferCheckoutForm"
          submitMessage="Complete Order"
          className="mt-4"
          paymentMethods={paymentMethods}
        />
      )}
    </div>
  );
};
