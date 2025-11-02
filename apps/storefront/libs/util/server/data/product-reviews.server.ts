import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { withAuthHeaders } from '../auth.server';
import { MILLIS } from '../cache-builder.server';

import {
  StoreListProductReviewStatsQuery,
  StoreListProductReviewsQuery,
  StoreUpsertProductReviewsDTO,
} from '@lambdacurry/medusa-plugins-sdk';

import { MemoryFileStorage } from '@mjackson/file-storage/memory';
import { FileUpload } from '@mjackson/form-data-parser';
import { Review } from '@libs/types';
export interface ReviewListResponse {
  reviews: Review[];
  limit: number;
  offset: number;
  count: number;
}
export interface CreateReviewInput {
  product_id: string;
  name: string;
  content: string;
  stars: number;
}

export const fetchProductReviews = async (
  productId: string,
  query: Partial<StoreListProductReviewsQuery> = {},
  cacheOptions: { forceFresh?: boolean } = {},
): Promise<ReviewListResponse> => {
  return await cachified({
    key: `product-reviews-${productId}-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    forceFresh: cacheOptions.forceFresh,
    async getFreshValue() {
      return await sdk.client.fetch(`/store/reviews/${productId}`, {
        method: 'GET',
        query: {
          ...query,
          offset: query.offset ?? 0,
          limit: query.limit ?? 10,
        },
      });
    },
  });
};

export const createProductReview = async (data: CreateReviewInput) => {
  return await sdk.client.fetch(`/store/reviews`, {
    method: 'POST',
    body: {
      product_id: data.product_id,
      name: data.name,
      content: data.content,
      stars: data.stars,
    },
  });
};

export const memoryStorage = new MemoryFileStorage();

export const reviewsFileUploadHandler = async (fileUpload: FileUpload) => {
  const randomId = Math.random().toString(36).substring(2, 15);
  if (fileUpload.type.startsWith('image/')) {
    const storageKey = `${randomId}-${fileUpload.fieldName}`;

    // FileUpload objects are not meant to stick around for very long (they are
    // streaming data from the request.body); store them as soon as possible.
    await memoryStorage.set(storageKey, fileUpload);

    // Return a File for the FormData object. This is a LazyFile that knows how
    // to access the file's content if needed (using e.g. file.stream()) but
    // waits until it is requested to actually read anything.
    return memoryStorage.get(storageKey);
  }
  return null;
};
