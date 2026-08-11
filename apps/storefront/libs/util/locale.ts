export type StorefrontLanguage = "en" | "vi";
export type MedusaLocale = "en-US" | "vi-VN";

export function toMedusaLocale(language: string | undefined): MedusaLocale {
  return language === "vi" ? "vi-VN" : "en-US";
}

export function toStorefrontLanguage(language: string | undefined): StorefrontLanguage {
  return language === "vi" ? "vi" : "en";
}
