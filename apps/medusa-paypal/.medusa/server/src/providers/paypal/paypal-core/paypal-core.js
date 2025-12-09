"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalService = void 0;
const paypal_server_sdk_1 = require("@paypal/paypal-server-sdk");
const libphonenumber_js_1 = require("libphonenumber-js");
const utils_1 = require("@medusajs/framework/utils");
class PaypalService {
    constructor({ clientId, clientSecret, isSandbox, webhookId, includeCustomerData, includeShippingData, }) {
        this.verifyWebhook = async ({ headers, body, }) => {
            if (!this.webhookId) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Webhook ID is not set");
            }
            const accessToken = await this.getAccessToken();
            const verifyWebhookRes = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auth_algo: headers["paypal-auth-algo"],
                    cert_url: headers["paypal-cert-url"],
                    transmission_id: headers["paypal-transmission-id"],
                    transmission_sig: headers["paypal-transmission-sig"],
                    transmission_time: headers["paypal-transmission-time"],
                    webhook_id: this.webhookId,
                    webhook_event: body,
                }),
            });
            if (!verifyWebhookRes.ok) {
                throw new Error(`Failed to verify webhook signature: ${verifyWebhookRes.statusText}`);
            }
            const verifyWebhookData = await verifyWebhookRes.json();
            if (verifyWebhookData.verification_status !== "SUCCESS") {
                throw new Error("Failed to verify webhook signature");
            }
            return { status: verifyWebhookData.verification_status, body };
        };
        const environment = isSandbox
            ? paypal_server_sdk_1.Environment.Sandbox
            : paypal_server_sdk_1.Environment.Production;
        this.client = new paypal_server_sdk_1.Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: clientId,
                oAuthClientSecret: clientSecret,
            },
            timeout: 0,
            environment,
            logging: {
                logLevel: paypal_server_sdk_1.LogLevel.Info,
                logRequest: {
                    logBody: true,
                },
                logResponse: {
                    logHeaders: true,
                },
            },
        });
        this.baseUrl = isSandbox
            ? "https://api-m.sandbox.paypal.com"
            : "https://api-m.paypal.com";
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.webhookId = webhookId;
        this.ordersController = new paypal_server_sdk_1.OrdersController(this.client);
        this.paymentsController = new paypal_server_sdk_1.PaymentsController(this.client);
        this.authController = new paypal_server_sdk_1.OAuthAuthorizationController(this.client);
        this.includeCustomerData = !!includeCustomerData;
        this.includeShippingData = !!includeShippingData;
    }
    async getAccessToken() {
        try {
            const authorization = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
            const authRes = await this.authController.requestToken({
                authorization: `Basic ${authorization}`,
            });
            const accessToken = authRes.result.accessToken;
            if (!accessToken)
                throw new Error("Failed to get access token");
            return accessToken;
        }
        catch (error) {
            throw new Error("Failed to get access token: " + error.message);
        }
    }
    async createOrder({ amount, currency, sessionId, shipping_info, items, email, }) {
        const ordersController = new paypal_server_sdk_1.OrdersController(this.client);
        const paypalItems = items?.map((item) => ({
            name: item.title,
            quantity: item.quantity.toString(),
            unitAmount: {
                currencyCode: currency,
                value: item.unit_price.toString(),
            },
        })) || [];
        const hasItems = paypalItems.length > 0;
        const shippingData = !!shipping_info && {
            ...(this.includeCustomerData &&
                this.mapCustomerData({ email, shipping_info })),
            ...(this.includeShippingData && this.mapShippingData(shipping_info)),
            type: paypal_server_sdk_1.FulfillmentType.Shipping,
        };
        const createdOrder = await ordersController.createOrder({
            body: {
                intent: paypal_server_sdk_1.CheckoutPaymentIntent.Capture,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: currency,
                            value: amount.toString(),
                            ...(hasItems && {
                                breakdown: {
                                    itemTotal: {
                                        currencyCode: currency,
                                        value: amount.toString(),
                                    },
                                },
                            }),
                        },
                        customId: sessionId,
                        ...(hasItems && { items: paypalItems }),
                        ...(shippingData && { shipping: shippingData }),
                    },
                ],
                applicationContext: {
                    ...(this.includeShippingData &&
                        shippingData && {
                        shippingPreference: paypal_server_sdk_1.OrderApplicationContextShippingPreference.SetProvidedAddress,
                    }),
                    userAction: paypal_server_sdk_1.OrderApplicationContextUserAction.PayNow,
                },
            },
        });
        if (!createdOrder?.result?.id)
            throw new Error("Failed to create order");
        return createdOrder.result;
    }
    async captureOrder(id) {
        const capturedOrder = await this.ordersController.captureOrder({
            id,
        });
        return capturedOrder.result;
    }
    async retrieveOrder(id) {
        const orderDetails = await this.ordersController.getOrder({
            id,
        });
        return orderDetails.result;
    }
    async authorizeOrder(id) {
        const authorizedOrder = await this.ordersController.authorizeOrder({
            id,
        });
        return authorizedOrder.result;
    }
    async refundPayment(captureIds) {
        const refunds = [];
        for (const captureId of captureIds) {
            const refund = await this.paymentsController.refundCapturedPayment({
                captureId,
            });
            refunds.push(refund.result);
        }
        return refunds;
    }
    mapCustomerData({ email, shipping_info, }) {
        if (!this.includeCustomerData || !shipping_info) {
            return undefined;
        }
        const parsedPhoneNumber = !!shipping_info?.phone && (0, libphonenumber_js_1.parsePhoneNumberFromString)(shipping_info.phone);
        return {
            name: {
                fullName: `${shipping_info.first_name} ${shipping_info.last_name}`,
            },
            ...(email && { emailAddress: email }),
            ...(parsedPhoneNumber && {
                phoneNumber: {
                    countryCode: parsedPhoneNumber.countryCallingCode,
                    nationalNumber: parsedPhoneNumber.nationalNumber,
                },
            }),
        };
    }
    mapShippingData(shipping_info) {
        if (!this.includeShippingData ||
            !shipping_info ||
            !shipping_info.country_code) {
            return undefined;
        }
        return {
            address: {
                countryCode: shipping_info.country_code,
                postalCode: shipping_info.postal_code,
                adminArea1: shipping_info.province,
                adminArea2: shipping_info.city,
                addressLine1: shipping_info.address_1,
            },
        };
    }
}
exports.PaypalService = PaypalService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5cGFsLWNvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheXBhbC9wYXlwYWwtY29yZS9wYXlwYWwtY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpRUFnQm1DO0FBRW5DLHlEQUErRDtBQUUvRCxxREFBd0Q7QUFXeEQsTUFBYSxhQUFhO0lBWXhCLFlBQVksRUFDVixRQUFRLEVBQ1IsWUFBWSxFQUNaLFNBQVMsRUFDVCxTQUFTLEVBQ1QsbUJBQW1CLEVBQ25CLG1CQUFtQixHQUNjO1FBb0s1QixrQkFBYSxHQUFHLEtBQUssRUFBRSxFQUM1QixPQUFPLEVBQ1AsSUFBSSxHQUlMLEVBQTRELEVBQUU7WUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDOUIsdUJBQXVCLENBQ3hCLENBQUM7WUFDSixDQUFDO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFaEQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEtBQUssQ0FDbEMsR0FBRyxJQUFJLENBQUMsT0FBTyw0Q0FBNEMsRUFDM0Q7Z0JBQ0UsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFO29CQUNQLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRTtvQkFDdEMsY0FBYyxFQUFFLGtCQUFrQjtpQkFDbkM7Z0JBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ25CLFNBQVMsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUM7b0JBQ3RDLFFBQVEsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUM7b0JBQ3BDLGVBQWUsRUFBRSxPQUFPLENBQUMsd0JBQXdCLENBQUM7b0JBQ2xELGdCQUFnQixFQUFFLE9BQU8sQ0FBQyx5QkFBeUIs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