import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, Text, Input, Label, Select, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import QuillEditor from "../components/QuillEditor"
import { sdk } from "../lib/sdk"

const MORPHING_PRESETS: Record<string, { label: string; colorStart: string; colorEnd: string }> = {
  BLOSSOM: { label: "Blossom (White -> Green)", colorStart: "#FFFFFF", colorEnd: "#6DCB8F" },
  SAFFRON: { label: "Saffron (Purple -> Dark Purple)", colorStart: "#BEB1F8", colorEnd: "#8F5DDB" },
  HAZE: { label: "Haze (Mint -> Lime)", colorStart: "#BFFAED", colorEnd: "#BBEE7C" },
  RICE: { label: "Rice (Soft Blue -> Light Blue)", colorStart: "#EEF7FF", colorEnd: "#A2D4FD" },
  LATTE: { label: "Latte (Cream -> Teal)", colorStart: "#E4E3D8", colorEnd: "#89E4BB" },
  COFFEE: { label: "Coffee (Soft Pink -> Orange)", colorStart: "#F5DDDD", colorEnd: "#FFB578" },
}

type ProductContentFields = {
  notes: string
  ingredients: string
  precautions_of_use: string
  application_tips: string
}

type ProductContent = ProductContentFields & {
  id: string
  product_id: string
}

const emptyContent: ProductContentFields = {
  notes: "",
  ingredients: "",
  precautions_of_use: "",
  application_tips: "",
}

const ProductContentWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const [content, setContent] = useState<ProductContentFields>(emptyContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Morphing shape states
  const initialShape = (product.metadata?.morphing_shape as any) || {}
  const [selectedPreset, setSelectedPreset] = useState<string>(initialShape.preset || (initialShape.colorStart ? "CUSTOM" : "DEFAULT"))
  const [colorStart, setColorStart] = useState<string>(initialShape.colorStart || "#FFFFFF")
  const [colorEnd, setColorEnd] = useState<string>(initialShape.colorEnd || "#6DCB8F")

  useEffect(() => {
    let isCurrent = true

    sdk.client
      .fetch<{ product_content: ProductContent | null }>(
        `/admin/product-content?product_id=${encodeURIComponent(product.id)}`,
      )
      .then(({ product_content }) => {
        if (!isCurrent || !product_content) return
        setContent({
          notes: product_content.notes,
          ingredients: product_content.ingredients,
          precautions_of_use: product_content.precautions_of_use,
          application_tips: product_content.application_tips,
        })
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load product content")
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [product.id])

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey)
    if (presetKey !== "DEFAULT" && presetKey !== "CUSTOM" && MORPHING_PRESETS[presetKey]) {
      setColorStart(MORPHING_PRESETS[presetKey].colorStart)
      setColorEnd(MORPHING_PRESETS[presetKey].colorEnd)
    }
  }

  const updateField = (field: keyof ProductContentFields, value: string) => {
    setContent((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // 1. Save product content
      await sdk.client.fetch("/admin/product-content", {
        method: "POST",
        body: { product_id: product.id, ...content },
      })

      // 2. Save morphing shape colors in product metadata
      const morphingShapeData = selectedPreset === "DEFAULT"
        ? null
        : {
            preset: selectedPreset,
            colorStart,
            colorEnd,
          }

      await sdk.client.fetch(`/admin/products/${product.id}`, {
        method: "POST",
        body: {
          metadata: {
            ...product.metadata,
            morphing_shape: morphingShapeData,
          },
        },
      })

      toast.success("Product content & shape colors saved successfully")
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save product content"
      setError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="space-y-6 p-6">
      <div>
        <Heading level="h2">Morphing Shape Background Color</Heading>
        <Text className="text-ui-fg-subtle mt-1" size="small">
          Configure the background morphing shape color gradient for this specific product.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl bg-ui-bg-subtle">
        <div className="space-y-2">
          <Label size="small" weight="plus">Preset</Label>
          <select
            className="w-full h-9 px-3 rounded-md border text-sm bg-white"
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            <option value="DEFAULT">Default / Random</option>
            {Object.entries(MORPHING_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>{preset.label}</option>
            ))}
            <option value="CUSTOM">Custom Colors</option>
          </select>
        </div>

        {selectedPreset !== "DEFAULT" && (
          <>
            <div className="space-y-2">
              <Label size="small" weight="plus">Color Start</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorStart}
                  onChange={(e) => {
                    setColorStart(e.target.value)
                    setSelectedPreset("CUSTOM")
                  }}
                  className="w-9 h-9 rounded cursor-pointer border p-0.5"
                />
                <Input
                  value={colorStart}
                  onChange={(e) => {
                    setColorStart(e.target.value)
                    setSelectedPreset("CUSTOM")
                  }}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label size="small" weight="plus">Color End</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorEnd}
                  onChange={(e) => {
                    setColorEnd(e.target.value)
                    setSelectedPreset("CUSTOM")
                  }}
                  className="w-9 h-9 rounded cursor-pointer border p-0.5"
                />
                <Input
                  value={colorEnd}
                  onChange={(e) => {
                    setColorEnd(e.target.value)
                    setSelectedPreset("CUSTOM")
                  }}
                  placeholder="#6DCB8F"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {selectedPreset !== "DEFAULT" && (
        <div className="flex items-center gap-3">
          <Text size="small" className="text-ui-fg-subtle">Preview Gradient:</Text>
          <div
            className="h-7 w-48 rounded-md border shadow-sm"
            style={{ background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})` }}
          />
        </div>
      )}

      <hr className="my-6 border-ui-border-base" />

      <div>
        <Heading level="h2">Localized product content</Heading>
        <Text className="text-ui-fg-subtle mt-1" size="small">
          Edit the original English content here. Add Vietnamese values from Settings → Translations.
        </Text>
      </div>

      {isLoading ? <Text size="small">Loading product content…</Text> : null}
      {error ? <Text className="text-ui-fg-error" size="small">{error}</Text> : null}

      {!isLoading ? (
        <>
          <QuillEditor
            id="product-content-notes"
            label="Notes"
            value={content.notes}
            onChange={(value: string) => updateField("notes", value)}
            placeholder="Enter product notes…"
            height="200px"
          />
          <QuillEditor
            id="product-content-ingredients"
            label="Ingredients"
            value={content.ingredients}
            onChange={(value: string) => updateField("ingredients", value)}
            placeholder="Enter product ingredients…"
            height="200px"
          />
          <QuillEditor
            id="product-content-precautions"
            label="Precautions of use"
            value={content.precautions_of_use}
            onChange={(value: string) => updateField("precautions_of_use", value)}
            placeholder="Enter usage precautions…"
            height="200px"
          />
          <QuillEditor
            id="product-content-application-tips"
            label="Application tips"
            value={content.application_tips}
            onChange={(value: string) => updateField("application_tips", value)}
            placeholder="Enter application tips…"
            height="200px"
          />
          <Button isLoading={isSaving} onClick={handleSave}>Save content & colors</Button>
        </>
      ) : null}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductContentWidget
