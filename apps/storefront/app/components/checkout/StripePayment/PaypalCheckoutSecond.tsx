
import { Alert } from "@app/components/common/alert";
import { Button } from "@app/components/common/buttons";
import { useCheckout } from "@app/hooks/useCheckout";
import { Address } from "@libs/types";
import { expressCheckoutClient } from "@libs/util/checkout/express-checkout-client";
import { StoreCart } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { loadScript } from "@paypal/paypal-js";

export default function PaypalCheckoutSecond({ cart }: { cart: StoreCart }) {
  const navigate = useNavigate();
  const { paymentProviders } = useCheckout();
  const [errorState, setErrorState] = useState<{ title: string; description: string } | null>(null);
  const [currentCart, setCurrentCart] = useState<StoreCart>(cart);

  const isPaypalAvailable = useMemo(() => {
    return paymentProviders?.some((p) => p.id?.includes("paypal"));
  }, [paymentProviders]);

  useEffect(() => {
    setCurrentCart(cart);
  }, [cart]);

  if (!currentCart || !isPaypalAvailable) return null;

  const handlePaypalCheckout = async () => {
    try {
      const [updatedCartRes, updateError] = await expressCheckoutClient.update({
        cartId: currentCart.id,
        complete: false,
      });

      if (updateError) {
        setErrorState({ title: "Error updating account details", description: updateError.message });
        return;
      }

      const updatedCart = updatedCartRes.cart;


      const captureLink = updatedCart.payment_collection?.payment_sessions?.[0]?.data?.links?.find((link: any) => link.rel === 'approve');
      if (captureLink) {

        await window.open(captureLink.href, '_blank') as Window;
      }

      // const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
      //   cartId: updatedCart.id,
      //   complete: true,
      // });

      // if (checkoutError) {
      //   setErrorState({ title: "Payment failed", description: checkoutError.message });
      //   return;
      // }

      // const { order } = checkoutRes;
      // if (!order) {
      //   setErrorState({ title: "Payment failed", description: "Error trying to complete checkout." });
      //   return;
      // }

      // navigate(`/checkout/success?order_id=${order.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error trying to submit payment.";
      setErrorState({ title: "Payment failed", description: message });
    }
  };

  const paypalRef = useRef();

  useEffect(() => {
    const initPayPal = async () => {
      const paypal = await loadScript({
        "client-id": "AUvtGlVenK_bQoUrek0Nl43oRCDETrBjP2ZlhRQcdBuJp1Pt16gSaitZV3aXAhUFIIQBGY29PqKhncLq",
        currency: "USD",
        intent: "capture",
      });

      if (!paypal) {
        console.error("Không thể tải PayPal SDK");
        return;
      }

      await paypal.Buttons?.({
        userAction: 'PAY_NOW',
        createOrder: async () => {
          const [updatedCartRes, updateError] = await expressCheckoutClient.update({
            cartId: currentCart.id,
            complete: false,
          });
          if (updateError) {
            setErrorState({ title: "Error updating account details", description: updateError.message });
            return;
          }
          const updatedCart = updatedCartRes.cart;
          const paymentSession = updatedCart.payment_collection?.payment_sessions?.[0];
          return paymentSession?.data?.id as string;
        },
        onApprove: async (data) => {
          const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
            cartId: currentCart.id as string,
            complete: true,
          });
          if (checkoutError) {
            setErrorState({ title: "Payment failed", description: checkoutError.message });
            return;
          }
          alert("Thanh toán thành công!");
          navigate(`/checkout/success?order_id=${checkoutRes?.order?.id}`);
        },
        onCancel: () => alert("Bạn đã hủy thanh toán."),
        onError: (err) => console.error("PayPal error:", err),
      })?.render(paypalRef.current);
    };

    initPayPal();
  }, []);
  return <div ref={paypalRef} />;

  // return (
  //   <>
  //     <h2 className="text-2xl font-bold text-gray-900">Express Checkout</h2>
  //     {errorState ? (
  //       <Alert type="error" title={errorState.title} className="mt-4">
  //         {errorState.description}
  //       </Alert>
  //     ) : null}
  //     <div className="py-4 relative z-0">
  //       <Button variant="primary" onClick={handlePaypalCheckout}>
  //         Pay with Paypal
  //       </Button>
  //     </div>
  //   </>
  // );
}