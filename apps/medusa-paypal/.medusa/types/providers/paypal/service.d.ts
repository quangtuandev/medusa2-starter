import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import { AuthorizePaymentInput, AuthorizePaymentOutput, CancelPaymentInput, CancelPaymentOutput, CapturePaymentInput, CapturePaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, InitiatePaymentInput, InitiatePaymentOutput, Logger, RefundPaymentInput, RefundPaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/framework/types";
import { Order } from "@paypal/paypal-server-sdk";
import { WebhookPayload } from "./types";
import { PaypalCreateOrderInput, PaypalService } from "./paypal-core";
import { z } from "zod";
export interface PaypalPaymentError {
    code: string;
    message: string;
    retryable: boolean;
    avsCode?: string;
    cvvCode?: string;
}
declare const optionsSchema: z.ZodObject<{
    clientId: z.ZodString;
    clientSecret: z.ZodString;
    isSandbox: z.ZodDefault<z.ZodBoolean>;
    webhookId: z.ZodOptional<z.ZodString>;
    includeShippingData: z.ZodDefault<z.ZodBoolean>;
    includeCustomerData: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type AlphabitePaypalPluginOptionsType = z.infer<typeof optionsSchema>;
export type AlphabitePaypalPluginOptions = {
    /**
     * PayPal client ID used for authentication.
     * This field is required.
     */
    clientId: string;
    /**
     * PayPal client secret used for authentication.
     * This field is required.
     */
    clientSecret: string;
    /**
     * Whether to use PayPal’s sandbox environment for testing.
     * Default: false
     */
    isSandbox?: boolean;
    /**
     * PayPal webhook ID to validate incoming webhooks.
     * Optional.
     */
    webhookId?: string;
    /**
     * Whether to include shipping data in transactions and responses.
     * Default: false
     */
    includeShippingData?: boolean;
    /**
     * Whether to include customer data (e.g., name, email) in transactions and responses.
     * Default: false
     */
    includeCustomerData?: boolean;
};
type InjectedDependencies = {
    logger: Logger;
    paymentModuleService: any;
};
interface InitiatePaymentInputCustom extends Omit<InitiatePaymentInput, "data"> {
    data?: Pick<PaypalCreateOrderInput, "items" | "shipping_info" | "email">;
}
export default class PaypalModuleService extends AbstractPaymentProvider<AlphabitePaypalPluginOptionsType> {
    private readonly options;
    static identifier: string;
    protected client: PaypalService;
    protected logger: Logger;
    protected paymentModuleService: any;
    constructor(container: InjectedDependencies, options: AlphabitePaypalPluginOptionsType);
    static validateOptions(options: AlphabitePaypalPluginOptionsType): void;
    capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput>;
    authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput>;
    cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput>;
    initiatePayment(input: InitiatePaymentInputCustom): Promise<InitiatePaymentOutput>;
    refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput>;
    deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput>;
    getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput>;
    retrievePayment(input: Record<string, unknown>): Promise<{
        data: {
            response: Order;
        };
    }>;
    updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput>;
    getWebhookActionAndData(payload: WebhookPayload): Promise<WebhookActionResult>;
    private checkPaymentStatus;
    getVcbRates(): Promise<any>;
    getUsdSellRate(data: any): Promise<number>;
    convertVndToUsd(amountVnd: any): Promise<string>;
}
export {};
