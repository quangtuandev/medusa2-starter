import { normalizeProductContentInput } from "../input"

describe("normalizeProductContentInput", () => {
  it("trims the product ID and content fields", () => {
    expect(normalizeProductContentInput({
      product_id: "  prod_123  ",
      notes: "  Notes  ",
      ingredients: "  Ingredients  ",
      precautions_of_use: "  Precautions  ",
      application_tips: "  Tips  ",
    })).toEqual({
      product_id: "prod_123",
      notes: "Notes",
      ingredients: "Ingredients",
      precautions_of_use: "Precautions",
      application_tips: "Tips",
    })
  })

  it("defaults omitted content fields to empty strings", () => {
    expect(normalizeProductContentInput({ product_id: "prod_123" })).toEqual({
      product_id: "prod_123",
      notes: "",
      ingredients: "",
      precautions_of_use: "",
      application_tips: "",
    })
  })

  it("rejects a missing product ID", () => {
    expect(() => normalizeProductContentInput({ product_id: "  " })).toThrow(
      "product_id is required",
    )
  })
})
