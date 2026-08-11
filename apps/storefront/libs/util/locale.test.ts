import { toMedusaLocale } from "./locale";

describe("toMedusaLocale", () => {
  it("maps English to en-US", () => {
    expect(toMedusaLocale("en")).toBe("en-US");
  });

  it("maps Vietnamese to vi-VN", () => {
    expect(toMedusaLocale("vi")).toBe("vi-VN");
  });

  it("falls back to en-US for missing or unsupported languages", () => {
    expect(toMedusaLocale(undefined)).toBe("en-US");
    expect(toMedusaLocale("fr")).toBe("en-US");
  });
});
