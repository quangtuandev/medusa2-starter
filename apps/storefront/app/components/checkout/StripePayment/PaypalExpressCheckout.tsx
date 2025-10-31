
import { Alert } from "@app/components/common/alert";
import { useCheckout } from "@app/hooks/useCheckout";
import { Address } from "@libs/types";
import { expressCheckoutClient } from "@libs/util/checkout/express-checkout-client";
import { StoreCart } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export default function PaypalExpressCheckout({ cart }: { cart: StoreCart }) {
  const navigate = useNavigate();
  const { paymentProviders } = useCheckout();
  const [errorState, setErrorState] = useState<{ title: string; description: string } | null>(null);
  const [currentCart, setCurrentCart] = useState<StoreCart>(cart);

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

  const amountValue = ((currentCart.total || 0)).toFixed(2);

  const styles = {
    borderRadius: 10,
  };

  const handleApprove = async (_data: any, actions: any) => {
    try {
      if (!actions?.order) return;
      const capture = await actions.order.capture();

      const payer = capture?.payer;
      const purchaseUnit = capture?.purchase_units?.[0];
      const shipping = purchaseUnit?.shipping;

      const fullName = shipping?.name?.full_name || `${payer?.name?.given_name ?? ""} ${payer?.name?.surname ?? ""}`;
      const nameSplit = fullName.trim().split(" ");

      const shippingAddress: Address = {
        firstName: nameSplit[0] ?? "",
        lastName: nameSplit.slice(1).join(" ") ?? "",
        address1: shipping?.address?.address_line_1 ?? "",
        address2: shipping?.address?.address_line_2 ?? "",
        city: shipping?.address?.admin_area_2.toLowerCase() ?? "",
        province: shipping?.address?.admin_area_1.toLowerCase() ?? "",
        postalCode: shipping?.address?.postal_code ?? "",
        countryCode: (shipping?.address?.country_code ?? "").toLowerCase(),
        phone: payer?.phone?.phone_number?.national_number ?? "",
      };

      const billingAddress: Address = {
        firstName: payer?.name?.given_name ?? nameSplit[0] ?? "",
        lastName: payer?.name?.surname ?? nameSplit.slice(1).join(" ") ?? "",
        address1: shipping?.address?.address_line_1 ?? "",
        address2: shipping?.address?.address_line_2 ?? "",
        city: shipping?.address?.admin_area_2.toLowerCase() ?? "",
        province: shipping?.address?.admin_area_1.toLowerCase() ?? "",
        postalCode: shipping?.address?.postal_code ?? "",
        countryCode: (shipping?.address?.country_code ?? "").toLowerCase(),
        phone: payer?.phone?.phone_number?.national_number ?? "",
        company: fullName,
      };

      const [updatedCartRes, updateError] = await expressCheckoutClient.update({
        cartId: currentCart.id,
        email: payer?.email_address ?? currentCart.email ?? undefined,
        shippingAddress,
        billingAddress,
        complete: false,
      });

      if (updateError) {
        setErrorState({ title: "Error updating account details", description: updateError.message });
        return;
      }

      const updatedCart = updatedCartRes.cart;

      const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
        cartId: updatedCart.id,
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
    <div className="App">
      <h2 className="text-2xl font-bold text-gray-900">Express Checkout</h2>
      {errorState ? (
        <Alert type="error" title={errorState.title} className="mt-4">
          {errorState.description}
        </Alert>
      ) : null}
      <div className="py-4 relative z-0">
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={styles}
            createOrder={(_, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: (currentCart.currency_code || "USD").toUpperCase(),
                      value: amountValue,
                    },
                  },
                ],
              });
            }}
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