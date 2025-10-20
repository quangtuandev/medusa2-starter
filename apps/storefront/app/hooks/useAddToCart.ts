import { FetcherKeys } from '@libs/util/fetcher-keys';
import { StoreCart } from '@medusajs/types';
import { useFetcher } from 'react-router';

export interface AddToCartData {
  productId: string;
  options?: Record<string, string>;
  quantity?: number;
}

export const useAddToCart = () => {
  const fetcher = useFetcher<{ cart: StoreCart; errors?: any }>({ 
    key: FetcherKeys.cart.createLineItem 
  });

  const addToCart = (data: AddToCartData) => {
    const formData = new FormData();
    formData.append('productId', data.productId);
    formData.append('quantity', String(data.quantity || 1));
    
    // Add options if provided
    if (data.options) {
      Object.entries(data.options).forEach(([key, value]) => {
        formData.append(`options.${key}`, value);
      });
    }

    fetcher.submit(formData, {
      method: 'post',
      action: '/api/cart/line-items/create',
    });
  };

  return {
    addToCart,
    isLoading: fetcher.state === 'submitting' || fetcher.state === 'loading',
    error: fetcher.data?.errors,
    cart: fetcher.data?.cart,
    state: fetcher.state,
  };
};
