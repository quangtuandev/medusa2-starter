import { isOutsideElement } from "./active-card-pointer";

describe("isOutsideElement", () => {
  it("returns false for the active card and its descendants", () => {
    const card = document.createElement("div");
    const child = document.createElement("span");
    card.appendChild(child);

    expect(isOutsideElement(card, card)).toBe(false);
    expect(isOutsideElement(card, child)).toBe(false);
  });

  it("returns true for an element outside the active card", () => {
    const card = document.createElement("div");
    const outside = document.createElement("button");

    expect(isOutsideElement(card, outside)).toBe(true);
  });

  it("returns false when no active card exists", () => {
    expect(isOutsideElement(null, document.body)).toBe(false);
  });
});
