import React, { useEffect, useState } from 'react';
import { useLocalizedProduct, useAvailableLocales } from '../../hooks/use-localized-product';
import { useTranslation } from 'react-i18next';

interface LocalizedProductInfoProps {
  productId: string;
  currentLocale?: string;
  onLocaleChange?: (locale: string) => void;
  className?: string;
}

/**
 * Component to display localized product information from Contentful
 * Falls back to original product data if localized data is not available
 */
export function LocalizedProductInfo({
  productId,
  currentLocale = 'en-US',
  onLocaleChange,
  className = '',
}: LocalizedProductInfoProps) {
  const { i18n } = useTranslation();
  const { data: localizedData, isLoading, error } = useLocalizedProduct(
    productId,
    currentLocale
  );
  const { locales } = useAvailableLocales();

  const getLocaleLabel = (code: string): string => {
    const labels: Record<string, string> = {
      'en-US': 'English',
      'en': 'English',
      'vi': 'Tiếng Việt',
      'vi-VN': 'Tiếng Việt',
    };
    return labels[code] || code;
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    );
  }

  if (error) {
    console.warn(`Failed to load localized product: ${error.message}`);
    return null; // Silently fail - use original product data
  }

  if (!localizedData) {
    return null; // No localized data available
  }

  return (
    <div className={className}>
      {/* Locale Selector */}
      {locales.length > 1 && (
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="locale-select" className="text-sm font-medium text-gray-700">
            {i18n.t('language', { defaultValue: 'Language' })}:
          </label>
          <select
            id="locale-select"
            value={currentLocale}
            onChange={(e) => onLocaleChange?.(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {getLocaleLabel(locale)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Localized Title */}
      {localizedData.product.title && (
        <h1 className="text-2xl font-bold mb-2">{localizedData.product.title}</h1>
      )}

      {/* Localized Description */}
      {localizedData.product.description && (
        <p className="text-gray-600 mb-4">{localizedData.product.description}</p>
      )}

      {/* SEO Meta Information (for development/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700">
          <p className="font-mono">
            <strong>SEO Title:</strong> {localizedData.product.seoTitle}
          </p>
          <p className="font-mono mt-1">
            <strong>SEO Description:</strong>{' '}
            {localizedData.product.seoDescription || 'N/A'}
          </p>
          <p className="font-mono mt-1">
            <strong>Locale:</strong> {localizedData.locale}
          </p>
        </div>
      )}

      {/* Localized Variants */}
      {localizedData.variants.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {i18n.t('variants', { defaultValue: 'Variants' })}
          </h3>
          <ul className="space-y-1">
            {localizedData.variants.map((variant) => (
              <li key={variant.medusaVariantId} className="text-sm text-gray-600">
                {variant.title} {variant.sku && `(${variant.sku})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
