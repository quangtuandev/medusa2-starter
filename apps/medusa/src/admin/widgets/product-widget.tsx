import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import QuillEditor from "../components/QuillEditor"
import { sdk } from "../lib/sdk"

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

  const updateField = (field: keyof ProductContentFields, value: string) => {
    setContent((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      await sdk.client.fetch("/admin/product-content", {
        method: "POST",
        body: { product_id: product.id, ...content },
      })
      toast.success("Product content saved")
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
          <Button isLoading={isSaving} onClick={handleSave}>Save content</Button>
        </>
      ) : null}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductContentWidget
