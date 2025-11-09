import { AbstractPaymentProvider, MedusaError, BigNumber } from "@medusajs/framework/utils"
import type {
    InitiatePaymentInput,
    InitiatePaymentOutput,
    AuthorizePaymentInput,
    AuthorizePaymentOutput,
    CapturePaymentInput,
    CapturePaymentOutput,
    RefundPaymentInput,
    RefundPaymentOutput,
    CancelPaymentInput,
    CancelPaymentOutput,
    DeletePaymentInput,
    DeletePaymentOutput,
    GetPaymentStatusInput,
    GetPaymentStatusOutput,
    RetrievePaymentInput,
    RetrievePaymentOutput,
    UpdatePaymentInput,
    UpdatePaymentOutput,
    PaymentSessionStatus,
    ProviderWebhookPayload,
    WebhookActionResult,
} from "@medusajs/framework/types"

type BankTransferOptions = {
    // Options can be passed from medusa-config.ts if needed
}

type InjectedDependencies = {
    logger: any
    manager: any
}

class BankTransferPaymentProviderService extends AbstractPaymentProvider<BankTransferOptions> {
    static identifier = "bank_transfer"

    protected logger_: any
    protected manager_: any

    constructor(container: InjectedDependencies, options: BankTransferOptions) {
        super(container, options)
        this.logger_ = container.logger
        this.manager_ = container.manager
    }

    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
        const { amount, currency_code, data } = input

        // Get bank account ID from data parameter
        // In Medusa v2, the data parameter passed to initiatePaymentSession 
        // is available in the data property of InitiatePaymentInput
        const bankAccountId = data?.bank_account_id as string | undefined

        // Prepare payment session data
        // For bank transfer, we just store the bank_account_id
        // The storefront will fetch bank account details from the API
        const sessionData: any = {
            amount,
            currency_code,
            status: "pending",
        }

        // Store bank_account_id if provided
        // The storefront component will fetch and display bank account details
        if (bankAccountId) {
            sessionData.bank_account_id = bankAccountId
        }

        // Generate a unique ID for this payment session
        const sessionId = `bank_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        return {
            id: sessionId,
            data: sessionData,
        }
    }

    async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
        // For bank transfer, authorization means the customer has selected the payment method
        // We authorize the payment session so the order can be created
        // The actual payment confirmation will be handled manually by admin later
        const { data } = input

        return {
            data: {
                ...data,
                status: "authorized",
                authorized_at: new Date().toISOString(),
            },
            status: "authorized" as PaymentSessionStatus,
        }
    }

    async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
        // For bank transfer, capture means admin has confirmed the payment
        // This should be called after admin verifies the bank transfer
        const { data } = input

        // Check if payment is already authorized
        if (data?.status !== "pending" && data?.status !== "authorized") {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Payment must be in pending or authorized status to capture"
            )
        }

        return {
            data: {
                ...data,
                status: "captured",
                captured_at: new Date().toISOString(),
            },
        }
    }

    async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
        // Bank transfer refunds need to be processed manually by admin
        const { amount, data } = input

        return {
            data: {
                ...data,
                refund_amount: amount,
                status: "pending",
                refunded_at: new Date().toISOString(),
            },
        }
    }

    async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
        const { data } = input

        return {
            data: {
                ...data,
                status: "canceled",
                canceled_at: new Date().toISOString(),
            },
        }
    }

    async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
        // For bank transfer, just return success
        // The actual deletion is handled by the Payment Module
        return {
            data: input.data,
        }
    }

    async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
        const { data } = input

        // Return the status from the payment data
        const status = data?.status || "pending"

        return {
            status: status as PaymentSessionStatus,
            data,
        }
    }

    async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
        const { data } = input

        return {
            data: data || {},
        }
    }

    async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
        const { data } = input

        return {
            data: {
                ...data,
                updated_at: new Date().toISOString(),
            },
        }
    }

    async getWebhookActionAndData(
        payload: ProviderWebhookPayload["payload"]
    ): Promise<WebhookActionResult> {
        // Bank transfer doesn't use webhooks, so return not_supported
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: new BigNumber(0),
            },
        }
    }
}

export default BankTransferPaymentProviderService

