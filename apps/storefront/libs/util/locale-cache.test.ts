import { buildLocalizedCacheKey } from "./locale-cache";

describe("buildLocalizedCacheKey", () => {
  it("isolates cached values by locale", () => {
    const english = buildLocalizedCacheKey("products", { limit: 10 }, "en-US");
    const vietnamese = buildLocalizedCacheKey("products", { limit: 10 }, "vi-VN");

    expect(english).not.toBe(vietnamese);
    expect(english).toContain("en-US");
    expect(vietnamese).toContain("vi-VN");
  });
});
