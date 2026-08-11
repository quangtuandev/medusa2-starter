import { PRODUCT_LOCALES } from "../locales"

describe("PRODUCT_LOCALES", () => {
  it("configures only US English and Vietnamese", () => {
    expect(PRODUCT_LOCALES).toEqual(["en-US", "vi-VN"])
  })
})
