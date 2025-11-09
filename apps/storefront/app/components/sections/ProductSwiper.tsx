import { Container } from '@app/components/common/container/Container';
import { ProductListItem } from '@app/components/product/ProductListItem';
import type { CustomAction, ProductListFilter } from '@libs/types';
import { buildSearchParamsFromObject } from '@libs/util/buildSearchParamsFromObject';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { type FC, HTMLAttributes, memo, useEffect, useState } from 'react';
import { NavLink, useFetcher } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ProductSuggestionItem } from '../product/ProductSuggestionItem';

export interface ProductSwiperProps<TElement extends HTMLElement = HTMLDivElement> extends HTMLAttributes<TElement> {
  heading?: string;
  text?: string;
  actions?: CustomAction[];
  className?: string;
}
const ProductSwiperBase: FC<ProductSwiperProps> = ({ className, heading, text, actions, ...props }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const fetcher = useFetcher<{
    products: StoreProduct[];
  }>();

  const { products } = fetcher.data || {};

  const fetchData = (filters?: ProductListFilter) => {
    const queryString = buildSearchParamsFromObject({
      subloader: 'productList',
      data: JSON.stringify({
        content: filters,
        fields: '*categories,*metadata',
      }),
    });

    fetcher.load(`/api/page-data?${queryString}`);
  };

  useEffect(() => {
    // Don't fetch if we have data coming from loader, which is configured to only be passed on non-preview routes.
    if (fetcher.data || fetcher.state === 'loading') {
      return;
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isInitialized && fetcher.data) {
      setIsInitialized(true);
    }
  }, [fetcher.data]);

  // Update swiper when products change
  useEffect(() => {
    if (swiperInstance && products) {
      swiperInstance.update();
    }
  }, [products, swiperInstance]);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có sản phẩm nào để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        spaceBetween={24}
        slidesPerView={1}
      // autoplay={{
      //   delay: 3000,
      //   disableOnInteraction: false,
      // }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <NavLink prefetch="viewport" to={`/products/${product.handle}`} viewTransition>
              {({ isTransitioning }) => (
                <ProductSuggestionItem isTransitioning={isTransitioning} product={product} />
              )}
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export const ProductSwiper: FC<ProductSwiperProps> = memo(({ className, heading, text, actions, ...props }) => {
  return (
    <section className={clsx(`mkt-section relative overflow-x-hidden`, className)} {...props}>
      <ProductSwiperBase {...props} />
    </section>
  );
});

export default ProductSwiper;
