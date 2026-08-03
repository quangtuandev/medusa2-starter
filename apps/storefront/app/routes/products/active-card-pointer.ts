export function isOutsideElement(
  element: HTMLElement | null,
  target: EventTarget | null,
): boolean {
  return element !== null && target instanceof Node && !element.contains(target);
}
