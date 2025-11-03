
import { Alert } from "@app/components/common/alert";
import { useCheckout } from "@app/hooks/useCheckout";
import { expressCheckoutClient } from "@libs/util/checkout/express-checkout-client";
import { StoreCart } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { CheckoutStep } from "@app/providers/checkout-provider";
import clsx from "clsx";
export default function PaypalExpressCheckout({ cart }: { cart: StoreCart }) {
  const navigate = useNavigate();
  const { paymentProviders, step } = useCheckout();
  const [errorState, setErrorState] = useState<{ title: string; description: string } | null>(null);
  const [currentCart, setCurrentCart] = useState<StoreCart>(cart);
  const isActiveStep = step === CheckoutStep.PAYMENT;

  const isPaypalAvailable = useMemo(() => {
    return paymentProviders?.some((p) => p.id?.includes("paypal"));
  }, [paymentProviders]);

  const initialOptions: ReactPayPalScriptOptions = useMemo(
    () => ({
      clientId: "AUvtGlVenK_bQoUrek0Nl43oRCDETrBjP2ZlhRQcdBuJp1Pt16gSaitZV3aXAhUFIIQBGY29PqKhncLq",
      components: "buttons",
      intent: "capture",
      currency: (currentCart.currency_code || "USD").toUpperCase(),
    }),
    [currentCart.currency_code]
  );

  useEffect(() => {
    setCurrentCart(cart);
  }, [cart]);

  if (!currentCart || !isPaypalAvailable) return null;

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