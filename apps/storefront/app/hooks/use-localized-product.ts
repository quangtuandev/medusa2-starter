import { useEffect, useState } from 'react';

export interface LocalizedProductData {
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface LocalizedProduct {
  product_id: string;
  locale: string;
  product: LocalizedProductData;
  variants: Array<{
    medusaVariantId: string;
    title: string;
    sku?: string;
  }>;
}

/**
 * Hook to fetch localized product data from Contentful via Medusa API
 * @param productId - The Medusa product ID
 * @param locale - The locale code (default: en-US)
 * @returns LocalizedProduct data or null if not found
 */
export function useLocalizedProduct(
  productId: string | null,
  locale: string = 'en-US'
) {
  const [data, setData] = useState<LocalizedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setData(null);
      return;
    }

    const fetchLocalizedProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.MEDUSA_PUBLISHABLE_KEY
          ? `${window.location.origin}`
          : 'http://localhost:7901';

        const response = await fetch(
          `/api/products/${productId}/localized?locale=${locale}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          // Fallback: return null if localized data not found
          if (response.status === 404) {
            setData(null);
            return;
          }
          throw new Error(`Failed to fetch localized product: ${response.statusText}`);
        }

        const localizedData = await response.json();
        setData(localizedData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error fetching localized product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalizedProduct();
  }, [productId, locale]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch available locales from Contentful
 */
export function useAvailableLocales() {
  const [locales, setLocales] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocales = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/contentful/locales', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch locales: ${response.statusText}`);
        }

        const data = await response.json();
        setLocales(data.locales || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error fetching locales:', error);
        // Fallback to default locale
        setLocales(['en-US']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocales();
  }, []);

  return { locales, isLoading, error };
}
