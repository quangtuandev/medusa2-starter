export type ProductContentInput = {
  product_id: string
  notes?: string
  ingredients?: string
  precautions_of_use?: string
  application_tips?: string
}

export type NormalizedProductContentInput = Required<ProductContentInput>

export function normalizeProductContentInput(
  input: ProductContentInput,
): NormalizedProductContentInput {
  const productId = input.product_id?.trim()

  if (!productId) {
    throw new Error("product_id is required")
  }

  return {
    product_id: productId,
    notes: input.notes?.trim() ?? "",
    ingredients: input.ingredients?.trim() ?? "",
    precautions_of_use: input.precautions_of_use?.trim() ?? "",
    application_tips: input.application_tips?.trim() ?? "",
  }
}
