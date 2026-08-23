/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubble, Plus, Trash, Pencil, CheckCircleSolid, XCircleSolid } from "@medusajs/icons"
import {
  Heading,
  Container,
  Button,
  Input,
  Skeleton,
  Label,
  toast,
  Table,
  FocusModal,
  Textarea,
  Switch,
  Badge,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useState, useRef } from "react"
import { sdk } from "../../lib/sdk"

export type PopupItem = {
  id: string
  title_en: string
  title_vi: string
  description_en?: string
  description_vi?: string
  image?: string
  cta_text_en?: string
  cta_text_vi?: string
  cta_link?: string
  secondary_cta_text_en?: string
  secondary_cta_text_vi?: string
  secondary_cta_link?: string
  is_active: boolean
  delay_seconds: number
  display_frequency: "once_per_session" | "once_per_day" | "always"
  target_page: string
  created_at?: string
}

type PopupsResponse = {
  popups: PopupItem[]
  count: number
}

const PopupsPage = () => {
  const queryClient = useQueryClient()
  const [selectedPopup, setSelectedPopup] = useState<PopupItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Omit<PopupItem, "id">>({
    title_en: "",
    title_vi: "",
    description_en: "",
    description_vi: "",
    image: "",
    cta_text_en: "",
    cta_text_vi: "",
    cta_link: "",
    secondary_cta_text_en: "",
    secondary_cta_text_vi: "",
    secondary_cta_link: "",
    is_active: true,
    delay_seconds: 3,
    display_frequency: "once_per_session",
    target_page: "all",
  })

  // Fetch popups
  const { data, isLoading } = useQuery<PopupsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/popups`),
    queryKey: [["popups"]],
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newPopup: any) =>
      sdk.client.fetch(`/admin/popups`, { method: "POST", body: newPopup }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["popups"]] })
      toast.success("Popup created successfully")
      setIsModalOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error("Failed to create popup", { description: error?.message })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      sdk.client.fetch(`/admin/popups/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["popups"]] })
      toast.success("Popup updated successfully")
      setIsModalOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error("Failed to update popup", { description: error?.message })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/popups/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["popups"]] })
      toast.success("Popup deleted successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to delete popup", { description: error?.message })
    },
  })

  const resetForm = () => {
    setSelectedPopup(null)
    setFormData({
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      image: "",
      cta_text_en: "",
      cta_text_vi: "",
      cta_link: "",
      secondary_cta_text_en: "",
      secondary_cta_text_vi: "",
      secondary_cta_link: "",
      is_active: true,
      delay_seconds: 3,
      display_frequency: "once_per_session",
      target_page: "all",
    })
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (popup: PopupItem) => {
    setSelectedPopup(popup)
    setFormData({
      title_en: popup.title_en || "",
      title_vi: popup.title_vi || "",
      description_en: popup.description_en || "",
      description_vi: popup.description_vi || "",
      image: popup.image || "",
      cta_text_en: popup.cta_text_en || "",
      cta_text_vi: popup.cta_text_vi || "",
      cta_link: popup.cta_link || "",
      secondary_cta_text_en: popup.secondary_cta_text_en || "",
      secondary_cta_text_vi: popup.secondary_cta_text_vi || "",
      secondary_cta_link: popup.secondary_cta_link || "",
      is_active: popup.is_active ?? true,
      delay_seconds: popup.delay_seconds ?? 3,
      display_frequency: popup.display_frequency || "once_per_session",
      target_page: popup.target_page || "all",
    })
    setIsModalOpen(true)
  }

  const handleDeletePopup = (id: string) => {
    if (confirm("Are you sure you want to delete this popup?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleActive = async (popup: PopupItem) => {
    await updateMutation.mutateAsync({
      id: popup.id,
      data: { is_active: !popup.is_active },
    })
  }

  const uploadFile = async (file: File) => {
    setIsUploadingImage(true)
    try {
      const response = await sdk.admin.upload.create({
        files: [file],
      })
      const fileUrl = response.files[0].url
      setFormData((prev) => ({ ...prev, image: fileUrl }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload failed", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title_en || !formData.title_vi) {
      toast.error("Please fill in both English and Vietnamese titles")
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedPopup) {
        await updateMutation.mutateAsync({ id: selectedPopup.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1" className="text-xl font-bold">
            Dialogs & Popups
          </Heading>
          <p className="text-ui-fg-subtle text-sm">
            Manage promotional popups, announcements, and call-to-action modals for the storefront.
          </p>
        </div>
        <Button variant="primary" size="small" onClick={handleOpenCreateModal}>
          <Plus className="mr-1" />
          Add Popup
        </Button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !data?.popups || data.popups.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-ui-fg-muted text-sm mb-4">No popups created yet.</p>
            <Button variant="secondary" size="small" onClick={handleOpenCreateModal}>
              <Plus className="mr-1" />
              Create your first popup
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Banner</Table.HeaderCell>
                <Table.HeaderCell>Title (EN / VI)</Table.HeaderCell>
                <Table.HeaderCell>CTA Button</Table.HeaderCell>
                <Table.HeaderCell>Display & Timing</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.popups.map((popup) => (
                <Table.Row key={popup.id}>
                  <Table.Cell>
                    {popup.image ? (
                      <img
                        src={popup.image}
                        alt={popup.title_en}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-ui-bg-subtle rounded-md flex items-center justify-center text-xs text-ui-fg-muted">
                        No image
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="font-semibold text-ui-fg-base">{popup.title_en}</div>
                    <div className="text-xs text-ui-fg-subtle">{popup.title_vi}</div>
                  </Table.Cell>
                  <Table.Cell>
                    {popup.cta_text_en ? (
                      <div>
                        <Badge color="green" size="small">
                          {popup.cta_text_en} ({popup.cta_text_vi})
                        </Badge>
                        <div className="text-xs text-ui-fg-muted truncate max-w-[150px]">
                          {popup.cta_link || "No link"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-ui-fg-muted text-xs">None</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-xs space-y-0.5">
                      <div>Delay: <span className="font-medium">{popup.delay_seconds}s</span></div>
                      <div>Freq: <span className="font-medium">{popup.display_frequency}</span></div>
                      <div>Target: <span className="font-medium">{popup.target_page}</span></div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleToggleActive(popup)}
                      className="cursor-pointer"
                      title={popup.is_active ? "Click to deactivate" : "Click to activate"}
                    >
                      {popup.is_active ? (
                        <Badge color="green" size="small">Active</Badge>
                      ) : (
                        <Badge color="grey" size="small">Inactive</Badge>
                      )}
                    </button>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => handleOpenEditModal(popup)}
                      >
                        <Pencil className="text-ui-fg-subtle" />
                      </Button>
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => handleDeletePopup(popup.id)}
                      >
                        <Trash className="text-ui-fg-error" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Focus Modal for Create / Edit */}
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-between w-full">
              <Heading level="h2">
                {selectedPopup ? "Edit Popup Dialog" : "Create New Popup Dialog"}
              </Heading>
              <Button
                variant="primary"
                size="small"
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                {selectedPopup ? "Save Changes" : "Create Popup"}
              </Button>
            </div>
          </FocusModal.Header>

          <FocusModal.Body className="p-8 max-w-4xl mx-auto overflow-y-auto space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Status & Display Settings */}
              <div className="p-5 border rounded-xl bg-ui-bg-subtle space-y-4">
                <Heading level="h3" className="text-base font-semibold">
                  1. Display & Trigger Settings
                </Heading>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, is_active: checked }))
                      }
                      id="is_active"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer font-medium">
                      {formData.is_active ? "Active (Enabled)" : "Inactive (Disabled)"}
                    </Label>
                  </div>

                  <div className="space-y-1">
                    <Label size="small">Delay (Seconds)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.delay_seconds}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          delay_seconds: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label size="small">Frequency</Label>
                    <select
                      className="w-full h-9 px-3 rounded-md border text-sm bg-white"
                      value={formData.display_frequency}
                      onChange={(e: any) =>
                        setFormData((prev) => ({
                          ...prev,
                          display_frequency: e.target.value,
                        }))
                      }
                    >
                      <option value="once_per_session">Once Per Session</option>
                      <option value="once_per_day">Once Per Day</option>
                      <option value="always">Always (Every Load)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label size="small">Target Page</Label>
                    <Input
                      placeholder="all or /products"
                      value={formData.target_page}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          target_page: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Popup Content */}
              <div className="p-5 border rounded-xl space-y-4">
                <Heading level="h3" className="text-base font-semibold">
                  2. Content & Image (EN & VI)
                </Heading>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label size="small" weight="plus">Title (English) *</Label>
                    <Input
                      placeholder="e.g. Special Offer"
                      value={formData.title_en}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title_en: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label size="small" weight="plus">Title (Vietnamese) *</Label>
                    <Input
                      placeholder="e.g. Ưu Đãi Đặc Biệt"
                      value={formData.title_vi}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title_vi: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label size="small">Description (English)</Label>
                    <Textarea
                      rows={3}
                      placeholder="Enter English description..."
                      value={formData.description_en}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description_en: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label size="small">Description (Vietnamese)</Label>
                    <Textarea
                      rows={3}
                      placeholder="Nhập mô tả tiếng Việt..."
                      value={formData.description_vi}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description_vi: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Banner Image Upload */}
                <div className="space-y-2 pt-2">
                  <Label size="small" weight="plus">Banner Image (Optional)</Label>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadFile(file)
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="https://... or upload image"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, image: e.target.value }))
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => imageInputRef.current?.click()}
                      isLoading={isUploadingImage}
                    >
                      Upload File
                    </Button>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="transparent"
                        size="small"
                        onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="p-5 border rounded-xl space-y-4">
                <Heading level="h3" className="text-base font-semibold">
                  3. Action Buttons (CTA)
                </Heading>

                {/* Primary CTA */}
                <div className="p-4 border rounded-lg bg-ui-bg-subtle space-y-3">
                  <div className="font-medium text-sm text-ui-fg-base">
                    Primary Action Button (Main CTA)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label size="small">Button Label (EN)</Label>
                      <Input
                        placeholder="e.g. Explore Now / Subscribe"
                        value={formData.cta_text_en}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cta_text_en: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label size="small">Button Label (VI)</Label>
                      <Input
                        placeholder="e.g. Xem Chi Tiết / Đăng Ký"
                        value={formData.cta_text_vi}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cta_text_vi: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label size="small">Destination Link</Label>
                      <Input
                        placeholder="e.g. /products or https://..."
                        value={formData.cta_link}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cta_link: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="font-medium text-sm text-ui-fg-base">
                    Secondary Action Button (Optional)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label size="small">Button Label (EN)</Label>
                      <Input
                        placeholder="e.g. Maybe Later"
                        value={formData.secondary_cta_text_en}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondary_cta_text_en: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label size="small">Button Label (VI)</Label>
                      <Input
                        placeholder="e.g. Để Sau"
                        value={formData.secondary_cta_text_vi}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondary_cta_text_vi: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label size="small">Destination Link (or empty to close)</Label>
                      <Input
                        placeholder="e.g. /contact or leave empty"
                        value={formData.secondary_cta_link}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondary_cta_link: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-5 border rounded-xl space-y-3 bg-gray-900 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Storefront Live Preview
                </div>
                <div className="max-w-md mx-auto bg-white text-black rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-xl text-gray-900 font-title">
                      {formData.title_en || "Your Popup Title"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formData.description_en ||
                        "Your popup description will appear here on the storefront."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {formData.cta_text_en && (
                      <button
                        type="button"
                        className="w-full py-3 bg-[#FFE977] text-black font-bold rounded-xl text-sm shadow hover:bg-yellow-300 transition-colors"
                      >
                        {formData.cta_text_en}
                      </button>
                    )}
                    {formData.secondary_cta_text_en && (
                      <button
                        type="button"
                        className="w-full py-2 text-gray-500 font-medium text-xs hover:text-gray-800"
                      >
                        {formData.secondary_cta_text_en}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Popups & Dialogs",
  icon: ChatBubble,
})

export default PopupsPage
