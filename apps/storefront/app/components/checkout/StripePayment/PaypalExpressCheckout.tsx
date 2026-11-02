
import { Alert } from "@app/components/common/alert";
import { useCheckout } from "@app/hooks/useCheckout";
import { useI18n } from "@app/hooks/useI18n";
import { expressCheckoutClient } from "@libs/util/checkout/express-checkout-client";
import { formatPrice } from "@libs/util/prices";
import { StoreCart } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { CheckoutStep } from "@app/providers/checkout-provider";
import clsx from "clsx";
export default function PaypalExpressCheckout() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const { paymentProviders, step, cart, activePaymentSession } = useCheckout();
  if (!cart) return null;
  const [errorState, setErrorState] = useState<{ title: string; description: string } | null>(null);
  const [currentCart, setCurrentCart] = useState<StoreCart>(cart);
  const isActiveStep = step === CheckoutStep.PAYMENT;

  const isPaypalAvailable = useMemo(() => {
    return paymentProviders?.some((p) => p.id?.includes("paypal"));
  }, [paymentProviders]);

  const initialOptions: ReactPayPalScriptOptions = useMemo(
    () => ({
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || "",
      components: "buttons",
      intent: "capture",
      currency: 'USD',
      // currency: (currentCart.currency_code || "USD").toUpperCase(),
    }),
    [currentCart.currency_code]
  );

  useEffect(() => {
    setCurrentCart(cart);
  }, [cart]);

  if (!currentCart || !isPaypalAvailable) return null;

  const cartCurrency = (currentCart.currency_code || currentCart.region?.currency_code || "").toLowerCase();
  const isVndCart = cartCurrency === "vnd";
  const sessionData = (activePaymentSession?.data ||
    currentCart.payment_collection?.payment_sessions?.[0]?.data) as Record<string, any> | undefined;
  const convertedUsdValue =
    sessionData?.purchase_units?.[0]?.amount?.value ||
    (typeof sessionData?.amount === "number" ? sessionData.amount.toFixed(2) : null);
  const formattedVndTotal = formatPrice(currentCart.total || 0, { currency: "vnd" });

  const styles = {
    borderRadius: 10,
  };

  const handleCreateOrder = async (): Promise<string> => {
    const [updatedCartRes, updateError] = await expressCheckoutClient.update({
      cartId: currentCart.id,
      complete: false,
    });
    if (updateError) {
      setErrorState({ title: "Error updating account details", description: updateError.message });
      return '';
    }
    const updatedCart = updatedCartRes.cart;
    const paymentSession = updatedCart.payment_collection?.payment_sessions?.[0];
    return paymentSession?.data?.id as string || '';
  }

  const handleApprove = async (_data: any, actions: any) => {
    try {
      if (!actions?.order) return;
      const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
        cartId: currentCart.id,
        complete: true,
      });

      if (checkoutError) {
        setErrorState({ title: "Payment failed", description: checkoutError.message });
        return;
      }

      const { order } = checkoutRes;
      if (!order) {
        setErrorState({ title: "Payment failed", description: "Error trying to complete checkout." });
        return;
      }

      navigate(`/checkout/success?order_id=${order.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error trying to submit payment.";
      setErrorState({ title: "Payment failed", description: message });
    }
  };

  return (
    <div className={clsx("App", !isActiveStep && "hidden")}>
      {errorState ? (
        <Alert type="error" title={errorState.title} className="mt-4">
          {errorState.description}
        </Alert>
      ) : null}
      {isVndCart && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs sm:text-sm text-amber-900 leading-relaxed">
          {language === "vi" ? (
            <p>
              <strong>Lưu ý quy đổi tiền tệ:</strong> Cổng thanh toán quốc tế PayPal / Thẻ tín dụng không hỗ trợ trực tiếp VNĐ nên tổng đơn hàng{" "}
              <strong>{formattedVndTotal}</strong> sẽ được tự động quy đổi sang{" "}
              <strong>{convertedUsdValue ? `$${convertedUsdValue} USD` : "USD"}</strong> theo tỷ giá Vietcombank khi thanh toán.
            </p>
          ) : (
            <p>
              <strong>Currency conversion notice:</strong> Because PayPal / international card checkout does not directly support VND, your order total of{" "}
              <strong>{formattedVndTotal}</strong> is automatically converted to{" "}
              <strong>{convertedUsdValue ? `$${convertedUsdValue} USD` : "USD"}</strong> at the current Vietcombank exchange rate.
            </p>
          )}
        </div>
      )}
      <div className="py-4 relative z-0">
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={styles}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={(err) => {
              const message = err instanceof Error ? err.message : "PayPal error";
              setErrorState({ title: "Payment failed", description: message });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}