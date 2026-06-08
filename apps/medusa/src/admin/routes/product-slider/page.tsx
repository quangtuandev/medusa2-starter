/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Sparkles, Plus, Trash, Pencil } from "@medusajs/icons"
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
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useMemo, useState, useRef } from "react"
import { sdk } from "../../lib/sdk"

type SliderCard = {
  id: string
  title_en: string
  title_vi: string
  subtitle_en?: string
  subtitle_vi?: string
  image: string
  image_active?: string
  icon?: string
  linkto: string
  rank: number
}

type SliderCardsResponse = {
  slider_cards: SliderCard[]
  count: number
}

const ProductSliderPage = () => {
  const queryClient = useQueryClient()
  const [selectedCard, setSelectedCard] = useState<SliderCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Upload loading states
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingActiveImage, setIsUploadingActiveImage] = useState(false)
  const [isUploadingIcon, setIsUploadingIcon] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title_en: "",
    title_vi: "",
    subtitle_en: "",
    subtitle_vi: "",
    image: "",
    image_active: "",
    icon: "",
    linkto: "",
    rank: 0,
  })

  // Refs for uploader
  const imageInputRef = useRef<HTMLInputElement>(null)
  const activeImageInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  // Fetch slider cards from API
  const { data, isLoading } = useQuery<SliderCardsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/slider-cards`),
    queryKey: [["slider-cards"]],
  })

  // Create card mutation
  const createMutation = useMutation({
    mutationFn: (newCard: any) =>
      sdk.client.fetch(`/admin/slider-cards`, { method: "POST", body: newCard }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["slider-cards"]] })
      toast.success("Card created successfully")
      setIsModalOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error("Failed to create card", { description: error?.message })
    },
  })

  // Update card mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      sdk.client.fetch(`/admin/slider-cards/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["slider-cards"]] })
      toast.success("Card updated successfully")
      setIsModalOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error("Failed to update card", { description: error?.message })
    },
  })

  // Delete card mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/slider-cards/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["slider-cards"]] })
      toast.success("Card deleted successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to delete card", { description: error?.message })
    },
  })

  const resetForm = () => {
    setSelectedCard(null)
    setFormData({
      title_en: "",
      title_vi: "",
      subtitle_en: "",
      subtitle_vi: "",
      image: "",
      image_active: "",
      icon: "",
      linkto: "",
      rank: 0,
    })
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (card: SliderCard) => {
    setSelectedCard(card)
    setFormData({
      title_en: card.title_en || "",
      title_vi: card.title_vi || "",
      subtitle_en: card.subtitle_en || "",
      subtitle_vi: card.subtitle_vi || "",
      image: card.image || "",
      image_active: card.image_active || "",
      icon: card.icon || "",
      linkto: card.linkto || "",
      rank: card.rank || 0,
    })
    setIsModalOpen(true)
  }

  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this slider card?")) {
      deleteMutation.mutate(id)
    }
  }

  // Handle uploading files using Medusa's standard Upload API
  const uploadFile = async (
    file: File,
    setUploading: (val: boolean) => void,
    fieldKey: "image" | "image_active" | "icon"
  ) => {
    setUploading(true)
    try {
      const response = await sdk.admin.upload.create({
        files: [file],
      })
      const fileUrl = response.files[0].url
      setFormData((prev) => ({ ...prev, [fieldKey]: fileUrl }))
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error("Upload failed", error)
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title_en || !formData.title_vi || !formData.image || !formData.linkto) {
      toast.error("Please fill in all required fields (Titles, Base Image, Link Route)")
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedCard) {
        await updateMutation.mutateAsync({ id: selectedCard.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="p-0 divide-y">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <Heading level="h1">Product Slider Config</Heading>
          <p className="text-sm text-gray-500 mt-1">
            Manage the localized slides, hover assets, subtitles, and routes shown on the products list page fan-slider.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Slider Card
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="p-8 text-center">Loading slider configurations...</Skeleton>
      ) : (
        <div className="p-6 overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Rank</Table.HeaderCell>
                <Table.HeaderCell>Title (EN / VI)</Table.HeaderCell>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Active Image</Table.HeaderCell>
                <Table.HeaderCell>Icon</Table.HeaderCell>
                <Table.HeaderCell>Link Path</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(data?.slider_cards || []).map((card) => (
                <Table.Row key={card.id} className="hover:bg-gray-50">
                  <Table.Cell className="font-mono">{card.rank}</Table.Cell>
                  <Table.Cell>
                    <div className="font-medium text-gray-900">{card.title_en}</div>
                    <div className="text-xs text-gray-500 italic">{card.title_vi}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <img src={card.image} className="w-12 h-16 object-cover border rounded-md shadow-sm" alt="Base preview" />
                  </Table.Cell>
                  <Table.Cell>
                    {card.image_active ? (
                      <img src={card.image_active} className="w-12 h-16 object-cover border rounded-md shadow-sm" alt="Active preview" />
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {card.icon ? (
                      <img src={card.icon} className="w-8 h-8 object-contain border rounded-full shadow-sm" alt="Icon preview" />
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-xs font-mono text-gray-500">{card.linkto}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      <Button size="small" variant="transparent" onClick={() => handleOpenEditModal(card)}>
                        <Pencil className="h-4 w-4 text-blue-600 mr-1" />
                        Edit
                      </Button>
                      <Button size="small" variant="transparent" onClick={() => handleDeleteCard(card.id)}>
                        <Trash className="h-4 w-4 text-red-600 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
              {(data?.slider_cards || []).length === 0 && (
                <Table.Row>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No slider cards found. Create your first configured slider card!
                  </td>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Focus Modal Form for creating/editing card */}
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <form onSubmit={handleSubmit}>
            <FocusModal.Header>
              <FocusModal.Title>{selectedCard ? "Edit Slider Card" : "Add Slider Card"}</FocusModal.Title>
            </FocusModal.Header>
            <FocusModal.Body className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              
              {/* Row 1: English & Vietnamese titles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_en" className="block text-sm font-medium mb-1">Title (English) *</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="e.g. Thirsty"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_vi" className="block text-sm font-medium mb-1">Title (Tiếng Việt) *</Label>
                  <Input
                    id="title_vi"
                    value={formData.title_vi}
                    onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                    placeholder="e.g. Khát Khao"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Subtitles (EN/VI) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subtitle_en" className="block text-sm font-medium mb-1">Subtitle (English)</Label>
                  <Textarea
                    id="subtitle_en"
                    value={formData.subtitle_en}
                    onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                    placeholder="Short description shown under active slider..."
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle_vi" className="block text-sm font-medium mb-1">Subtitle (Tiếng Việt)</Label>
                  <Textarea
                    id="subtitle_vi"
                    value={formData.subtitle_vi}
                    onChange={(e) => setFormData({ ...formData, subtitle_vi: e.target.value })}
                    placeholder="Lời giới thiệu ngắn hiển thị dưới slider..."
                  />
                </div>
              </div>

              {/* Row 3: Base image, Hover image, Custom Icon uploader */}
              <div className="space-y-4">
                {/* 1. Base Image Uploader */}
                <div>
                  <Label className="block text-sm font-medium mb-2">Base Slider Image *</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadFile(file, setIsUploadingImage, "image")
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? "Uploading..." : "Upload Base Image"}
                    </Button>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or enter base image URL directly..."
                      required
                    />
                  </div>
                  {formData.image && (
                    <img src={formData.image} className="w-16 h-24 object-cover border rounded mt-2 shadow-sm" alt="Base preview" />
                  )}
                </div>

                {/* 2. Active Hover Image Uploader */}
                <div>
                  <Label className="block text-sm font-medium mb-2">Hover Active Image (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={activeImageInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadFile(file, setIsUploadingActiveImage, "image_active")
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => activeImageInputRef.current?.click()}
                      disabled={isUploadingActiveImage}
                    >
                      {isUploadingActiveImage ? "Uploading..." : "Upload Active Image"}
                    </Button>
                    <Input
                      value={formData.image_active}
                      onChange={(e) => setFormData({ ...formData, image_active: e.target.value })}
                      placeholder="Or enter hover active URL directly..."
                    />
                  </div>
                  {formData.image_active && (
                    <img src={formData.image_active} className="w-16 h-24 object-cover border rounded mt-2 shadow-sm" alt="Active preview" />
                  )}
                </div>

                {/* 3. Custom Icon Uploader */}
                <div>
                  <Label className="block text-sm font-medium mb-2">Custom Slide Icon (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={iconInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadFile(file, setIsUploadingIcon, "icon")
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => iconInputRef.current?.click()}
                      disabled={isUploadingIcon}
                    >
                      {isUploadingIcon ? "Uploading..." : "Upload Icon"}
                    </Button>
                    <Input
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Or enter icon image URL directly..."
                    />
                  </div>
                  {formData.icon && (
                    <img src={formData.icon} className="w-12 h-12 object-contain border rounded-full mt-2 shadow-sm" alt="Icon preview" />
                  )}
                </div>
              </div>

              {/* Row 4: LinkTo Route and Rank */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkto" className="block text-sm font-medium mb-1">Navigation Route / Link *</Label>
                  <Input
                    id="linkto"
                    value={formData.linkto}
                    onChange={(e) => setFormData({ ...formData, linkto: e.target.value })}
                    placeholder="e.g. /collections/thirsty or /collections/icy"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Storefront handle is determined from the end of this route.</p>
                </div>
                <div>
                  <Label htmlFor="rank" className="block text-sm font-medium mb-1">Order Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })}
                    placeholder="Weight for fanning order (0, 1, 2...)"
                  />
                </div>
              </div>

            </FocusModal.Body>
            <FocusModal.Footer>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedCard ? "Update Card" : "Add Card"}
              </Button>
            </FocusModal.Footer>
          </form>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Product Slider",
  icon: Sparkles,
})

export default ProductSliderPage
