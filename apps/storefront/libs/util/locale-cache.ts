export function buildLocalizedCacheKey(
  namespace: string,
  input: unknown,
  locale: string,
): string {
  return `${namespace}-${locale}-${JSON.stringify(input)}`;
}
