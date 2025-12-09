"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const node_fetch_1 = __importDefault(require("node-fetch")); // npm install node-fetch
const xml2js_1 = require("xml2js");
const paypal_server_sdk_1 = require("@paypal/paypal-server-sdk");
const paypal_core_1 = require("./paypal-core");
const zod_1 = require("zod");
const VCB_URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10';
const optionsSchema = zod_1.z.object({
    clientId: zod_1.z
        .string()
        .min(1, "PayPal client ID is required")
        .describe("PayPal client ID used for authentication. This field is required."),
    clientSecret: zod_1.z.string().min(1, "PayPal client secret is required"),
    isSandbox: zod_1.z.boolean().default(false),
    webhookId: zod_1.z.string().optional(),
    includeShippingData: zod_1.z.boolean().default(false),
    includeCustomerData: zod_1.z.boolean().default(false),
});
class PaypalModuleService extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.options = options;
        this.logger = container.logger;
        this.paymentModuleService = container.paymentModuleService;
        this.client = new paypal_core_1.PaypalService(this.options);
    }
    static validateOptions(options) {
        const result = optionsSchema.safeParse(options);
        if (!result.success) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Invalid PayPal plugin options: ${result.error.message}`);
        }
    }
    async capturePayment(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            if (!input.data.id) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "PayPal order ID is required to capture payment");
            }
            if (input.data.status === utils_1.PaymentSessionStatus.CAPTURED ||
                input.data.status === "COMPLETED") {
                return {
                    data: {
                        ...input.data,
                        status: utils_1.PaymentSessionStatus.CAPTURED,
                        captured_at: new Date().toISOString(),
                    },
                };
            }
            const id = input.data.id;
            await this.client.captureOrder(id);
            return {
                data: {
                    ...input.data,
                    status: utils_1.PaymentSessionStatus.CAPTURED,
                    captured_at: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error("PayPal capture payment error:", error);
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Failed to capture PayPal payment");
        }
    }
    async authorizePayment(input) {
        if (!input.data) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
        }
        const data = input.data;
        let paypalData = input.data;
        const amount = input.data.amount;
        const currencyCode = input.data.currency_code;
        const orderId = paypalData?.id;
        if (!orderId || !amount || !currencyCode) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "PayPal order ID, Amount or Currency is missing, can not capture order.");
        }
        if (currencyCode !== 'USD') {
            const convertedAmount = await this.convertVndToUsd(Number(amount));
            console.log(convertedAmount, 'convertedAmount');
        }
        const isAuthorized = paypalData?.purchaseUnits?.[0].payments?.captures?.[0]?.status ===
            paypal_server_sdk_1.CaptureStatus.Completed;
        if (!isAuthorized) {
            try {
                paypalData = await this.client.captureOrder(orderId);
            }
            catch (err) {
                const body = JSON.parse(err?.body || "{}");
                const captureData = body?.purchase_units?.[0]?.payments?.captures?.[0];
                const newOrder = await this.client.createOrder({
                    amount: Number(amount),
                    currency: currencyCode,
                    sessionId: input.context?.idempotency_key,
                    items: data?.items,
                    shipping_info: data?.shipping_info,
                    email: data?.email,
                });
                if (!captureData) {
                    const error = {
                        code: "404",
                        message: "Payment declined. Please try again or use a different card.",
                        retryable: true,
                    };
                    return {
                        status: utils_1.PaymentSessionStatus.PENDING,
                        data: {
                            ...input.data,
                            ...newOrder,
                            error,
                        },
                    };
                }
                const paymentStatus = captureData?.status || paypal_server_sdk_1.CaptureStatus.Declined;
                const processorResponse = captureData?.processorResponse;
                const { error = undefined } = this.checkPaymentStatus(paymentStatus, processorResponse);
                return {
                    status: utils_1.PaymentSessionStatus.PENDING,
                    data: {
                        ...input.data,
                        ...newOrder,
                        error,
                    },
                };
            }
            const captureData = paypalData.purchaseUnits?.[0].payments?.captures?.[0];
            const paymentStatus = captureData?.status || paypal_server_sdk_1.CaptureStatus.Declined;
            const processorResponse = captureData?.processorResponse;
            const { status, error = undefined } = this.checkPaymentStatus(paymentStatus, processorResponse);
            if (status === paypal_server_sdk_1.CaptureStatus.Declined) {
                const newOrder = await this.client.createOrder({
                    amount: Number(captureData?.amount?.value),
                    currency: captureData?.amount?.currencyCode,
                    sessionId: input.context?.idempotency_key,
                    items: data?.items,
                    shipping_info: data?.shipping_info,
                    email: data?.email,
                });
                return {
                    status: utils_1.PaymentSessionStatus.PENDING,
                    data: {
                        ...input.data,
                        ...newOrder,
                        error,
                    },
                };
            }
        }
        return {
            data: {
                ...paypalData,
            },
            status: utils_1.PaymentSessionStatus.AUTHORIZED,
        };
    }
    async cancelPayment(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            const orderId = input.data["id"];
            if (!orderId) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Cancel payment failed! PayPal order ID and capture ID is required to cancel payment");
            }
            return {
                data: {
                    order_id: orderId,
                    status: utils_1.PaymentSessionStatus.CANCELED,
                    cancelled_at: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error("PayPal cancel payment error:", error);
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Failed to cancel PayPal payment");
        }
    }
    async initiatePayment(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            const { context, data } = input;
            let { currency_code, amount } = input;
            if (!amount || !currency_code) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Amount and currency code are required");
            }
            // if (currency_code !== 'USD') {
            //   const converter = new CurrencyConverter.default();
            //   const convertedAmount = converter.convert({ from: currency_code, to: "USD", amount: Number(amount) });
            //   console.log(convertedAmount, 'convertedAmount');
            // }
            if (currency_code?.toLowerCase() === 'vnd') {
                const convertedAmount = await this.convertVndToUsd(Number(amount));
                currency_code = 'usd';
                amount = Number(convertedAmount);
            }
            const order = await this.client.createOrder({
                amount: Number(amount),
                currency: currency_code,
                sessionId: context?.idempotency_key,
                items: data?.items,
                shipping_info: data?.shipping_info,
                email: data?.email,
            });
            return {
                data: { ...data, ...order, ...context, amount, currency_code },
                id: order.id,
            };
        }
        catch (error) {
            this.logger.error("PayPal initiate payment error:", error);
            throw error;
        }
    }
    async refundPayment(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            const orderId = input.data["id"];
            const purchaseUnits = input?.data?.["purchaseUnits"] || [];
            const captureIds = purchaseUnits
                ?.flatMap((item) => item?.payments?.captures?.map((capture) => capture.id))
                .filter((id) => id !== undefined);
            if (!orderId || !captureIds) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Refund payment failed! PayPal order ID and capture ID is required to cancel payment");
            }
            await this.client.refundPayment(captureIds);
            return {
                data: {
                    order_id: orderId,
                    status: utils_1.PaymentSessionStatus.CANCELED,
                    cancelled_at: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error("PayPal refund payment error:", error);
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Failed to refund PayPal payment");
        }
    }
    async deletePayment(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            const orderId = input.data["id"];
            if (!orderId) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Delete payment failed! PayPal order ID and capture ID is required to cancel payment");
            }
            return {
                data: {
                    order_id: orderId,
                    status: utils_1.PaymentSessionStatus.CANCELED,
                    cancelled_at: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error("PayPal cancel payment error:", error);
            throw error;
        }
    }
    async getPaymentStatus(input) {
        try {
            if (!input.data) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment data is required");
            }
            const order_id = input.data["id"];
            if (!order_id) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "PayPal order ID is required to cancel payment");
            }
            const order = await this.client.retrieveOrder(order_id);
            if (!order || !order.status) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `PayPal order with ID ${order_id} not found`);
            }
            return {
                status: order.status === "COMPLETED"
                    ? utils_1.PaymentSessionStatus.CAPTURED
                    : utils_1.PaymentSessionStatus.AUTHORIZED,
            };
        }
        catch (error) {
            this.logger.error("PayPal get payment status error:", error);
            throw error;
        }
    }
    async retrievePayment(input) {
        try {
            const id = input["id"];
            const res = await this.client.retrieveOrder(id);
            return {
                data: { response: res },
            };
        }
        catch (error) {
            this.logger.error("PayPal retrieve payment error:", error);
            throw error;
        }
    }
    async updatePayment(input) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Not implemented");
    }
    async getWebhookActionAndData(payload) {
        try {
            const { data, headers } = payload;
            await this.client.verifyWebhook({ headers, body: data });
            switch (data.event_type) {
                case "PAYMENT.CAPTURE.COMPLETED":
                    return {
                        action: "captured",
                        data: {
                            session_id: data.resource.custom_id,
                            amount: Number(data.resource.amount.value),
                        },
                    };
                default:
                    return {
                        action: "not_supported",
                    };
            }
        }
        catch (e) {
            return {
                action: "failed",
                data: {
                    session_id: payload.data.resource.custom_id,
                    amount: Number(payload.data.resource.amount.value),
                },
            };
        }
    }
    checkPaymentStatus(status, processorResponse) {
        const processorResponseMap = {
            "0500": {
                code: "0500 - DO_NOT_HONOR",
                message: "Card refused by issuer. Please try again or use a different card.",
                retryable: false,
            },
            "9500": {
                code: "9500 - SUSPECTED_FRAUD",
                message: "Suspected fraudulent card. Please try again and use a different card.",
                retryable: false,
            },
            "5400": {
                code: "5400 - EXPIRED_CARD",
                message: "Card has expired. Please try again and use a different card.",
                retryable: false,
            },
            "5120": {
                code: "5120 - INSUFFICIENT_FUNDS",
                message: "Insufficient funds. Please try again or use a different card.",
                retryable: true,
            },
            "00N7": {
                code: "00N7 - CVV_FAILURE",
                message: "Incorrect security code. Please try again or use a different card.",
                retryable: true,
            },
            "1330": {
                code: "1330 - INVALID_ACCOUNT",
                message: "Card not valid. Please try again or use a different card.",
                retryable: true,
            },
            "5100": {
                code: "5100 - GENERIC_DECLINE",
                message: "Card is declined. Please try again or use a different card.",
                retryable: true,
            },
        };
        switch (status) {
            case "COMPLETED":
                return { status };
            case "DECLINED":
                if (processorResponse?.responseCode) {
                    const errorDetails = processorResponseMap[processorResponse.responseCode] || {
                        code: processorResponse.responseCode,
                        message: "Payment declined. Please try again or use a different card.",
                        retryable: false,
                    };
                    return {
                        status,
                        error: {
                            ...errorDetails,
                            avsCode: processorResponse.avsCode,
                            cvvCode: processorResponse.cvvCode,
                        },
                    };
                }
                return {
                    status,
                    error: {
                        code: "DECLINED",
                        message: "Payment declined. Please try again or use a different card.",
                        retryable: false,
                    },
                };
            default:
                return {
                    status,
                    error: {
                        code: "UNKNOWN_STATUS",
                        message: `Unknown payment status: ${status}. Please try again or use a different card.`,
                        retryable: false,
                    },
                };
        }
    }
    // Lấy dữ liệu XML từ Vietcombank → chuyển sang JSON
    async getVcbRates() {
        const res = await (0, node_fetch_1.default)(VCB_URL);
        if (!res.ok)
            throw new Error("Failed to fetch VCB API");
        const xml = await res.text();
        const json = await (0, xml2js_1.parseStringPromise)(xml, { explicitArray: false });
        console.log(JSON.stringify(json, null, 2), 'json');
        return json;
    }
    // Lấy tỉ giá USD (Sell)
    async getUsdSellRate(data) {
        const list = data.ExrateList.Exrate;
        const arr = Array.isArray(list) ? list : [list];
        const usd = arr.find((x) => x.$.CurrencyCode === "USD");
        if (!usd)
            throw new Error("USD rate not found");
        // Remove commas & convert to number
        const sellRate = parseFloat(usd.$.Sell.replace(/,/g, ""));
        return sellRate; // VND per 1 USD
    }
    // Convert VND → USD
    async convertVndToUsd(amountVnd) {
        const data = await this.getVcbRates();
        const sellRate = await this.getUsdSellRate(data);
        const usd = amountVnd / sellRate;
        return usd.toFixed(2);
    }
}
PaypalModuleService.identifier = "paypal";
exports.default = PaypalModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcGF5cGFsL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFJbUM7QUFDbkMsNERBQStCLENBQVMseUJBQXlCO0FBQ2pFLG1DQUE0QztBQXFCNUMsaUVBQWlFO0FBRWpFLCtDQUFzRTtBQUN0RSw2QkFBd0I7QUFDeEIsTUFBTSxPQUFPLEdBQUcsOEVBQThFLENBQUM7QUFVL0YsTUFBTSxhQUFhLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM3QixRQUFRLEVBQUUsT0FBQztTQUNSLE1BQU0sRUFBRTtTQUNSLEdBQUcsQ0FBQyxDQUFDLEVBQUUsOEJBQThCLENBQUM7U0FDdEMsUUFBUSxDQUNQLG1FQUFtRSxDQUNwRTtJQUNILFlBQVksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxrQ0FBa0MsQ0FBQztJQUNuRSxTQUFTLEVBQUUsT0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDckMsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDaEMsbUJBQW1CLEVBQUUsT0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDL0MsbUJBQW1CLEVBQUUsT0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDaEQsQ0FBQyxDQUFDO0FBdURILE1BQXFCLG1CQUFvQixTQUFRLCtCQUF5RDtJQU94RyxZQUNFLFNBQStCLEVBQ2QsT0FBeUM7UUFFMUQsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUZULFlBQU8sR0FBUCxPQUFPLENBQWtDO1FBSTFELElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FB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