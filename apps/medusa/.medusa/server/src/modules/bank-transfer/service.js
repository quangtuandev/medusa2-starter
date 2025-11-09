"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
class BankTransferPaymentProviderService extends utils_1.AbstractPaymentProvider {
    static identifier = "bank_transfer";
    logger_;
    manager_;
    constructor(container, options) {
        super(container, options);
        this.logger_ = container.logger;
        this.manager_ = container.manager;
    }
    async initiatePayment(input) {
        const { amount, currency_code, data } = input;
        // Get bank account ID from data parameter
        // In Medusa v2, the data parameter passed to initiatePaymentSession 
        // is available in the data property of InitiatePaymentInput
        const bankAccountId = data?.bank_account_id;
        // Prepare payment session data
        // For bank transfer, we just store the bank_account_id
        // The storefront will fetch bank account details from the API
        const sessionData = {
            amount,
            currency_code,
            status: "pending",
        };
        // Store bank_account_id if provided
        // The storefront component will fetch and display bank account details
        if (bankAccountId) {
            sessionData.bank_account_id = bankAccountId;
        }
        // Generate a unique ID for this payment session
        const sessionId = `bank_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            id: sessionId,
            data: sessionData,
        };
    }
    async authorizePayment(input) {
        // For bank transfer, authorization means the customer has selected the payment method
        // We authorize the payment session so the order can be created
        // The actual payment confirmation will be handled manually by admin later
        const { data } = input;
        return {
            data: {
                ...data,
                status: "authorized",
                authorized_at: new Date().toISOString(),
            },
            status: "authorized",
        };
    }
    async capturePayment(input) {
        // For bank transfer, capture means admin has confirmed the payment
        // This should be called after admin verifies the bank transfer
        const { data } = input;
        // Check if payment is already authorized
        if (data?.status !== "pending" && data?.status !== "authorized") {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Payment must be in pending or authorized status to capture");
        }
        return {
            data: {
                ...data,
                status: "captured",
                captured_at: new Date().toISOString(),
            },
        };
    }
    async refundPayment(input) {
        // Bank transfer refunds need to be processed manually by admin
        const { amount, data } = input;
        return {
            data: {
                ...data,
                refund_amount: amount,
                status: "pending",
                refunded_at: new Date().toISOString(),
            },
        };
    }
    async cancelPayment(input) {
        const { data } = input;
        return {
            data: {
                ...data,
                status: "canceled",
                canceled_at: new Date().toISOString(),
            },
        };
    }
    async deletePayment(input) {
        // For bank transfer, just return success
        // The actual deletion is handled by the Payment Module
        return {
            data: input.data,
        };
    }
    async getPaymentStatus(input) {
        const { data } = input;
        // Return the status from the payment data
        const status = data?.status || "pending";
        return {
            status: status,
            data,
        };
    }
    async retrievePayment(input) {
        const { data } = input;
        return {
            data: data || {},
        };
    }
    async updatePayment(input) {
        const { data } = input;
        return {
            data: {
                ...data,
                updated_at: new Date().toISOString(),
            },
        };
    }
    async getWebhookActionAndData(payload) {
        // Bank transfer doesn't use webhooks, so return not_supported
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: new utils_1.BigNumber(0),
            },
        };
    }
}
exports.default = BankTransferPaymentProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2JhbmstdHJhbnNmZXIvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUEyRjtBQWtDM0YsTUFBTSxrQ0FBbUMsU0FBUSwrQkFBNEM7SUFDekYsTUFBTSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUE7SUFFekIsT0FBTyxDQUFLO0lBQ1osUUFBUSxDQUFLO0lBRXZCLFlBQVksU0FBK0IsRUFBRSxPQUE0QjtRQUNyRSxLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQTtRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUE7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBMkI7UUFDN0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO1FBRTdDLDBDQUEwQztRQUMxQyxxRUFBcUU7UUFDckUsNERBQTREO1FBQzVELE1BQU0sYUFBYSxHQUFHLElBQUksRUFBRSxlQUFxQyxDQUFBO1FBRWpFLCtCQUErQjtRQUMvQix1REFBdUQ7UUFDdkQsOERBQThEO1FBQzlELE1BQU0sV0FBVyxHQUFRO1lBQ3JCLE1BQU07WUFDTixhQUFhO1lBQ2IsTUFBTSxFQUFFLFNBQVM7U0FDcEIsQ0FBQTtRQUVELG9DQUFvQztRQUNwQyx1RUFBdUU7UUFDdkUsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNoQixXQUFXLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQTtRQUMvQyxDQUFDO1FBRUQsZ0RBQWdEO1FBQ2hELE1BQU0sU0FBUyxHQUFHLGlCQUFpQixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEs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