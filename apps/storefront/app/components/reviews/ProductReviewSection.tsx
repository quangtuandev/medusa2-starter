import { FC } from 'react';
import { useRouteLoaderData } from 'react-router';
import { ProductPageLoaderData } from '../../routes/products.$productHandle';
import { ProductReviewListWithPagination } from './ReviewListWithPagination';
import ProductReviewSummary from './ReviewSummary';

export const ProductReviewSection: FC = () => {
  const data = useRouteLoaderData<ProductPageLoaderData>('routes/products.$productHandle');

  if (!data) return null;

  const { product, productReviews, productReviewStats } = data;

  if (!productReviews.count || productReviewStats.count < 1) return null;

  return (
    <>
      <p className='text-center'>
        <span className='text-5xl font-title font-extrabold text-64px leading-48px uppercase'>Customer</span>
        <span className='text-6xl font-centuryBook italic text-64px leading-48px pl-2'>Review</span>
      </p>
      <section id="reviews" className="container mx-auto my-12 grid grid-cols-12 px-8">
        {/* <ProductReviewSummary
          className="col-span-12 lg:col-span-4"
          stats={productReviewStats?.product_review_stats[0]}
          count={productReviews.count}
        /> */}

        <ProductReviewListWithPagination
          className="col-span-12"
          productReviews={productReviews.product_reviews}
          context={`products/${product.handle}`}
          paginationConfig={{
            limit: productReviews.limit,
            offset: productReviews.offset,
            count: productReviews.count,
          }}
        />
      </section>
    </>
  );
};
