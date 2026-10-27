/// <reference types="react" />
import React, { useState, useEffect, useCallback } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { EnvelopeSolid } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Input,
    Label,
    Switch,
    Textarea,
    toast,
    Text,
    Badge,
    Tabs,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk.js"

type EmailSetting = {
    id: string
    type: string
    is_enabled: boolean
    subject: string
    body_html: string
    recipients: string | null
    created_at: string
    updated_at: string
}

type EmailSettingsResponse = {
    email_settings: EmailSetting[]
    count: number
    seeded?: number
}

const ORDER_TEMPLATE_VARIABLES = [
    { key: "{{order_id}}", desc: "ID đơn hàng" },
    { key: "{{display_id}}", desc: "Mã đơn hàng hiển thị" },
    { key: "{{customer_name}}", desc: "Tên khách hàng" },
    { key: "{{customer_email}}", desc: "Email khách hàng" },
    { key: "{{total}}", desc: "Tổng tiền đơn hàng" },
    { key: "{{items}}", desc: "Danh sách sản phẩm (HTML)" },
    { key: "{{shipping_address}}", desc: "Địa chỉ giao hàng" },
    { key: "{{store_name}}", desc: "Tên cửa hàng" },
]

const CONTACT_TEMPLATE_VARIABLES = [
    { key: "{{name}}", desc: "Họ và tên khách gửi liên hệ" },
    { key: "{{email}}", desc: "Email của khách gửi liên hệ" },
    { key: "{{message}}", desc: "Nội dung lời nhắn" },
    { key: "{{date}}", desc: "Thời gian gửi (Ngày/giờ)" },
    { key: "{{store_name}}", desc: "Tên cửa hàng" },
]

const EmailSettingForm = ({
    setting,
    onSave,
    isSaving,
    variables = ORDER_TEMPLATE_VARIABLES,
    description,
}: {
    setting: EmailSetting
    onSave: (id: string, data: Partial<EmailSetting>) => void
    isSaving: boolean
    variables?: { key: string; desc: string }[]
    description?: string
}) => {
    const [isEnabled, setIsEnabled] = useState(setting.is_enabled)
    const [subject, setSubject] = useState(setting.subject)
    const [bodyHtml, setBodyHtml] = useState(setting.body_html)
    const [recipients, setRecipients] = useState(setting.recipients || "")
    const [testEmail, setTestEmail] = useState("")
    const [isSendingTest, setIsSendingTest] = useState(false)
    const isInternal = setting.type === "internal_order_notification" || setting.type === "contact_us_notification"

    // Sync state when setting changes (e.g. after save)
    useEffect(() => {
        setIsEnabled(setting.is_enabled)
        setSubject(setting.subject)
        setBodyHtml(setting.body_html)
        setRecipients(setting.recipients || "")
    }, [setting])

    const handleSave = useCallback(() => {
        if (!setting.id) {
            toast.error("Lỗi: Không tìm thấy ID cấu hình email. Vui lòng tải lại trang.")
            return
        }
        onSave(setting.id, {
            is_enabled: isEnabled,
            subject,
            body_html: bodyHtml,
            ...(isInternal ? { recipients } : {}),
        })
    }, [setting.id, isEnabled, subject, bodyHtml, recipients, isInternal, onSave])

    const handleSendTest = useCallback(async () => {
        if (!testEmail) {
            toast.error("Vui lòng nhập email để gửi test")
            return
        }

        setIsSendingTest(true)
        try {
            await sdk.client.fetch(`/admin/email-settings/test`, {
                method: "POST",
                body: {
                    to: testEmail,
                    subject: subject || "Test Email",
                    body_html: bodyHtml || "<p>Test email content</p>",
                },
            })
            toast.success("Đã gửi test email!", {
                description: `Email đã được gửi tới ${testEmail}`,
            })
        } catch (error: any) {
            toast.error("Lỗi gửi test email", {
                description: error.message || "Không thể gửi email. Kiểm tra cấu hình SMTP.",
            })
        } finally {
            setIsSendingTest(false)
        }
    }, [testEmail, subject, bodyHtml])

    return (
        <div className="space-y-6 p-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-ui-bg-subtle rounded-lg border">
                <div>
                    <Text weight="plus" size="base">
                        {isEnabled ? "Đang bật" : "Đang tắt"}
                    </Text>
                    <Text className="text-ui-fg-subtle" size="small">
                        {isEnabled
                            ? (description || "Email sẽ được gửi tự động")
                            : "Email sẽ không được gửi"}
                    </Text>
                </div>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                />
            </div>

            {/* Recipients (Internal only) */}
            {isInternal && (
                <div className="space-y-2">
                    <Label htmlFor="recipients" className="text-sm font-medium">
                        Email nhận thông báo
                    </Label>
                    <Input
                        id={`recipients-${setting.type}`}
                        placeholder="admin@example.com, team@example.com"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                    />
                    <Text className="text-ui-fg-muted" size="small">
                        Nhập nhiều email phân cách bằng dấu phẩy
                    </Text>
                </div>
            )}

            {/* Subject */}
            <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                    Tiêu đề email
                </Label>
                <Input
                    id={`subject-${setting.type}`}
                    placeholder="Nhập tiêu đề email..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>

            {/* Body HTML */}
            <div className="space-y-2">
                <Label htmlFor="body_html" className="text-sm font-medium">
                    Nội dung email (HTML)
                </Label>
                <Textarea
                    id={`body_html-${setting.type}`}
                    placeholder="Nhập nội dung email HTML..."
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    rows={16}
                    className="font-mono text-sm"
                />
            </div>

            {/* Template Variables Reference */}
            <div className="p-4 bg-ui-bg-subtle rounded-lg border">
                <Text weight="plus" size="small" className="mb-3 block">
                    📋 Biến template có sẵn:
                </Text>
                <div className="grid grid-cols-2 gap-2">
                    {variables.map((v) => (
                        <div key={v.key} className="flex items-center gap-2">
                            <Badge size="2xsmall" className="font-mono">
                                {v.key}
                            </Badge>
                            <Text size="small" className="text-ui-fg-subtle">
                                {v.desc}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview */}
            {bodyHtml && (
                <div className="space-y-2">
                    <Text weight="plus" size="small">
                        👁️ Xem trước email:
                    </Text>
                    <div
                        className="border rounded-lg p-4 bg-white max-h-[400px] overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Email để gửi test..."
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        variant="secondary"
                        onClick={handleSendTest}
                        isLoading={isSendingTest}
                        disabled={!testEmail || isSendingTest}
                    >
                        Gửi Test Email
                    </Button>
                </div>
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                >
                    💾 Lưu cấu hình
                </Button>
            </div>
        </div>
    )
}

const EmailSettingsPage = () => {
    const queryClient = useQueryClient()

    // Fetch settings
    const { data, isLoading } = useQuery<EmailSettingsResponse>({
        queryFn: () =>
            sdk.client.fetch(`/admin/email-settings`, {
                query: {},
            }),
        queryKey: ["email-settings"],
    })

    // Seed default settings mutation
    const seedMutation = useMutation({
        mutationFn: () =>
            sdk.client.fetch(`/admin/email-settings`, {
                method: "POST",
                body: { seed: true },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["email-settings"] })
            toast.success("Đã tạo cấu hình email mặc định")
        },
        onError: (error: any) => {
            toast.error("Lỗi", {
                description: error.message || "Không thể tạo cấu hình mặc định",
            })
        },
    })

    // Update setting mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Partial<EmailSetting>
        }) =>
            sdk.client.fetch(`/admin/email-settings/${id}`, {
                method: "POST",
                body: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["email-settings"] })
            toast.success("Đã lưu cấu hình email")
        },
        onError: (error: any) => {
            toast.error("Lỗi", {
                description: error.message || "Không thể cập nhật cấu hình",
            })
        },
    })

    const handleSave = useCallback(
        (id: string, data: Partial<EmailSetting>) => {
            updateMutation.mutate({ id, data })
        },
        [updateMutation]
    )

    // Auto-seed if any required templates are missing
    useEffect(() => {
        if (data) {
            const existingTypes = data.email_settings.map((s) => s.type)
            const requiredTypes = [
                "customer_order_confirmation",
                "internal_order_notification",
                "contact_us_notification",
                "contact_us_confirmation",
            ]
            const hasMissing = requiredTypes.some((t) => !existingTypes.includes(t))
            if (hasMissing) {
                seedMutation.mutate()
            }
        }
    }, [data])

    const customerSetting = data?.email_settings.find(
        (s) => s.type === "customer_order_confirmation"
    )
    const internalSetting = data?.email_settings.find(
        (s) => s.type === "internal_order_notification"
    )
    const contactNotificationSetting = data?.email_settings.find(
        (s) => s.type === "contact_us_notification"
    )
    const contactConfirmationSetting = data?.email_settings.find(
        (s) => s.type === "contact_us_confirmation"
    )

    if (isLoading) {
        return (
            <Container className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-ui-bg-subtle rounded w-1/3"></div>
                    <div className="h-4 bg-ui-bg-subtle rounded w-2/3"></div>
                    <div className="h-64 bg-ui-bg-subtle rounded"></div>
                </div>
            </Container>
        )
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="p-6 border-b">
                <Heading level="h1">Quản lý Email</Heading>
                <Text className="text-ui-fg-subtle mt-1">
                    Cấu hình email tự động gửi khi có đơn hàng mới hoặc khách hàng gửi form liên hệ
                </Text>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="customer">
                <Tabs.List className="px-6 pt-4 flex-wrap">
                    <Tabs.Trigger value="customer">
                        <span className="flex items-center gap-2">
                            📧 Email xác nhận đơn hàng
                            {customerSetting?.is_enabled && (
                                <Badge color="green" size="2xsmall">ON</Badge>
                            )}
                        </span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="internal">
                        <span className="flex items-center gap-2">
                            🔔 Thông báo đơn hàng (Nội bộ)
                            {internalSetting?.is_enabled && (
                                <Badge color="green" size="2xsmall">ON</Badge>
                            )}
                        </span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="contact_notification">
                        <span className="flex items-center gap-2">
                            📬 Thông báo liên hệ mới (Nội bộ)
                            {contactNotificationSetting?.is_enabled && (
                                <Badge color="green" size="2xsmall">ON</Badge>
                            )}
                        </span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="contact_confirmation">
                        <span className="flex items-center gap-2">
                            ✉️ Xác nhận liên hệ (Khách hàng)
                            {contactConfirmationSetting?.is_enabled && (
                                <Badge color="green" size="2xsmall">ON</Badge>
                            )}
                        </span>
                    </Tabs.Trigger>
                </Tabs.List>

                {/* 1. Customer Order Confirmation */}
                <Tabs.Content value="customer">
                    {customerSetting ? (
                        <EmailSettingForm
                            setting={customerSetting}
                            onSave={handleSave}
                            isSaving={updateMutation.isPending}
                            variables={ORDER_TEMPLATE_VARIABLES}
                            description="Email sẽ được gửi tự động tới khách hàng khi có đơn hàng mới"
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <Text className="text-ui-fg-subtle">
                                Đang tạo cấu hình mặc định...
                            </Text>
                        </div>
                    )}
                </Tabs.Content>

                {/* 2. Internal Order Notification */}
                <Tabs.Content value="internal">
                    {internalSetting ? (
                        <EmailSettingForm
                            setting={internalSetting}
                            onSave={handleSave}
                            isSaving={updateMutation.isPending}
                            variables={ORDER_TEMPLATE_VARIABLES}
                            description="Email sẽ được gửi tự động tới danh sách người nhận khi có đơn hàng mới"
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <Text className="text-ui-fg-subtle">
                                Đang tạo cấu hình mặc định...
                            </Text>
                        </div>
                    )}
                </Tabs.Content>

                {/* 3. Contact Us Notification (Internal) */}
                <Tabs.Content value="contact_notification">
                    {contactNotificationSetting ? (
                        <EmailSettingForm
                            setting={contactNotificationSetting}
                            onSave={handleSave}
                            isSaving={updateMutation.isPending}
                            variables={CONTACT_TEMPLATE_VARIABLES}
                            description="Email thông báo sẽ được gửi tới danh sách người nhận khi có khách gửi liên hệ mới qua form Contact Us"
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <Text className="text-ui-fg-subtle">
                                Đang tạo cấu hình mặc định...
                            </Text>
                        </div>
                    )}
                </Tabs.Content>

                {/* 4. Contact Us Confirmation (Customer) */}
                <Tabs.Content value="contact_confirmation">
                    {contactConfirmationSetting ? (
                        <EmailSettingForm
                            setting={contactConfirmationSetting}
                            onSave={handleSave}
                            isSaving={updateMutation.isPending}
                            variables={CONTACT_TEMPLATE_VARIABLES}
                            description="Email phản hồi sẽ được gửi tự động tới email của khách hàng sau khi họ gửi form Contact Us"
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <Text className="text-ui-fg-subtle">
                                Đang tạo cấu hình mặc định...
                            </Text>
                        </div>
                    )}
                </Tabs.Content>
            </Tabs>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Email Settings",
    icon: EnvelopeSolid,
})

export default EmailSettingsPage
