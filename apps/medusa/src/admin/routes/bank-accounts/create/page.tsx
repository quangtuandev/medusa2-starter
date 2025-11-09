/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowLeft } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Input,
    Label,
    Switch,
    toast,
} from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/sdk.js"
import * as z from "zod"

// Define form validation schema
const BankAccountFormSchema = z.object({
    name: z.string().min(1, "Bank name is required"),
    account_holder: z.string().min(1, "Account holder name is required"),
    account_number: z.string().min(1, "Account number is required"),
    bank_code: z.string().min(1, "Bank code is required"),
    swift_code: z.string().optional().nullable(),
    qr_code_url: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
    is_active: z.boolean().optional().default(true),
    display_order: z.number().int().min(0).optional().default(0),
})

const CreateBankAccountPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        account_holder: "",
        account_number: "",
        bank_code: "",
        swift_code: "",
        qr_code_url: "",
        is_active: true,
        display_order: 0,
    })

    // Mutation for creating bank account
    const createMutation = useMutation({
        mutationFn: async (data: z.infer<typeof BankAccountFormSchema>) => {
            // Clean up empty string qr_code_url
            const cleanedData = {
                ...data,
                qr_code_url: data.qr_code_url === "" ? null : data.qr_code_url,
                swift_code: data.swift_code === "" ? null : data.swift_code,
            }
            return sdk.client.fetch("/admin/bank-accounts", {
                method: "POST",
                body: cleanedData,
            })
        },
        onSuccess: () => {
            toast.success("Bank account created successfully")
            navigate("/bank-accounts")
        },
        onError: (error: any) => {
            toast.error("Failed to create bank account", {
                description: error.message || "An error occurred",
            })
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = BankAccountFormSchema.parse(formData)
            setIsLoading(true)
            await createMutation.mutateAsync(validatedData)
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error("Validation failed: " + error.errors[0]?.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        navigate("/bank-accounts")
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Bank Accounts
                    </Button>
                    <Heading level="h1">Create New Bank Account</Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || createMutation.isPending}
                >
                    {isLoading || createMutation.isPending ? "Creating..." : "Create Bank Account"}
                </Button>
            </div>

            {/* Form Content */}
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bank Name */}
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="e.g., Vietcombank"
                            required
                        />
                    </div>

                    {/* Account Holder */}
                    <div>
                        <Label htmlFor="account_holder" className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder *
                        </Label>
                        <Input
                            id="account_holder"
                            value={formData.account_holder}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, account_holder: e.target.value })
                            }
                            placeholder="Account holder name"
                            required
                        />
                    </div>

                    {/* Account Number */}
                    <div>
                        <Label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number *
                        </Label>
                        <Input
                            id="account_number"
                            value={formData.account_number}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, account_number: e.target.value })
                            }
                            placeholder="1234567890"
                            required
                        />
                    </div>

                    {/* Bank Code */}
                    <div>
                        <Label htmlFor="bank_code" className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Code *
                        </Label>
                        <Input
                            id="bank_code"
                            value={formData.bank_code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, bank_code: e.target.value })
                            }
                            placeholder="e.g., VCB"
                            required
                        />
                    </div>

                    {/* SWIFT Code */}
                    <div>
                        <Label htmlFor="swift_code" className="block text-sm font-medium text-gray-700 mb-2">
                            SWIFT Code (Optional)
                        </Label>
                        <Input
                            id="swift_code"
                            value={formData.swift_code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, swift_code: e.target.value })
                            }
                            placeholder="e.g., BFTVVNVX"
                        />
                    </div>

                    {/* QR Code URL */}
                    <div>
                        <Label htmlFor="qr_code_url" className="block text-sm font-medium text-gray-700 mb-2">
                            QR Code URL (Optional)
                        </Label>
                        <Input
                            id="qr_code_url"
                            value={formData.qr_code_url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, qr_code_url: e.target.value })
                            }
                            placeholder="https://example.com/qr-code.png"
                            type="url"
                        />
                    </div>

                    {/* Display Order */}
                    <div>
                        <Label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
                            Display Order
                        </Label>
                        <Input
                            id="display_order"
                            type="number"
                            min="0"
                            value={formData.display_order}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Lower numbers appear first. Default is 0.
                        </p>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center space-x-3">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked: boolean) =>
                                setFormData({ ...formData, is_active: checked })
                            }
                        />
                        <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active (Show in storefront)
                        </Label>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Create Bank Account",
})

export default CreateBankAccountPage

