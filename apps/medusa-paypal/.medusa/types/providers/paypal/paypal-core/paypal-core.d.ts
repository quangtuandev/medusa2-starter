import { Order, OrderAuthorizeResponse, Refund } from "@paypal/paypal-server-sdk";
import { CartAddressDTO, CartLineItemDTO } from "@medusajs/framework/types";
import { AlphabitePaypalPluginOptionsType } from "../service";
export interface PaypalCreateOrderInput {
    amount: number;
    currency: string;
    sessionId?: string;
    shipping_info?: CartAddressDTO;
    items?: CartLineItemDTO[];
    email?: string;
}
export declare class PaypalService {
    private client;
    private ordersController;
    private paymentsController;
    private authController;
    private clientId;
    private clientSecret;
    private webhookId;
    private includeShippingData;
    private includeCustomerData;
    private baseUrl;
    constructor({ clientId, clientSecret, isSandbox, webhookId, includeCustomerData, includeShippingData, }: AlphabitePaypalPluginOptionsType);
    getAccessToken(): Promise<string>;
    createOrder({ amount, currency, sessionId, shipping_info, items, email, }: PaypalCreateOrderInput): Promise<Order>;
    captureOrder(id: string): Promise<Order>;
    retrieveOrder(id: string): Promise<Order>;
    authorizeOrder(id: string): Promise<OrderAuthorizeResponse>;
    refundPayment(captureIds: string[]): Promise<Refund[]>;
    verifyWebhook: ({ headers, body, }: {
        headers: Record<string, string>;
        body: object;
    }) => Promise<{
        body: object;
        status: "SUCCESS" | "FAILURE";
    }>;
    private mapCustomerData;
    private mapShippingData;
}
