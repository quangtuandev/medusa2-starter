import { FC, useState } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Button } from '../common/buttons';
import { SimpleReviewForm } from './SimpleReviewForm';
import { ProductPageLoaderData } from '../../routes/products.$productHandle';
import { ProductReviewListWithPagination } from './ReviewListWithPagination';
import clsx from 'clsx';
export const ProductReviewSection = () => {
  const data = useRouteLoaderData<ProductPageLoaderData>('routes/products.$productHandle');

  if (!data) return null;

  const { product, productReviews } = data;
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmitted = () => {
    setShowForm(false);
    // Optionally refresh reviews here
    window.location.reload();
  };

  return (
    <>
      <p className='text-center'>
        <span className='text-4xl font-title font-extrabold xl:text-[64px] leading-normal xl:leading-[48px] uppercase'>Customer</span>
        <span className='text-4xl font-centuryBook italic xl:text-[64px] leading-normal xl:leading-[48px] pl-2'>Review</span>
      </p>
      <section id="reviews" className="container mx-auto my-6 xl:my-12 grid grid-cols-12 xl:px-8">

        <ProductReviewListWithPagination
          className="col-span-12"
          productId={product.id as string}
          productReviews={productReviews.reviews}
          context={`products/${product.handle}`}
          paginationConfig={{
            limit: productReviews.limit,
            offset: productReviews.offset,
            count: productReviews.count,
          }}
        />
      </section>
      <div>
        {showForm && (
          <SimpleReviewForm
            productId={product.id as string}
            onSubmitSuccess={handleReviewSubmitted}
            onCancel={() => setShowForm(false)}
          />
        )}
        {!showForm && (
          <div className="my-8 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              <span className="font-semibold text-lg">Write a Review</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
