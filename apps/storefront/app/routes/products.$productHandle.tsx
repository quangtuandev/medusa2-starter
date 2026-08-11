import { ProductReviewSection } from '@app/components/reviews/ProductReviewSection';
import ProductList from '@app/components/sections/ProductList';
import { ProductTemplate } from '@app/templates/ProductTemplate';
import { getMergedProductMeta } from '@libs/util/products';
import { fetchProductReviews } from '@libs/util/server/data/product-reviews.server';
import { fetchFeatureFlags } from '@libs/util/server/data/feature-flags.server';
import { fetchProductContent } from '@libs/util/server/data/product-content.server';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import { type LoaderFunctionArgs, type MetaFunction, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import { useI18n } from '@app/hooks/useI18n';

export const loader = async (args: LoaderFunctionArgs) => {
  const { limit: reviewsLimit, offset: reviewsOffset } = withPaginationParams({
    request: args.request,
    defaultPageSize: 2,
  });

  const [{ products }, featureFlags] = await Promise.all([
    fetchProducts(args.request, {
      handle: args.params.productHandle,
      fields: '*categories,*metadata',
    }),
    fetchFeatureFlags(),
  ]);

  if (!products.length) throw redirect('/404');

  const product = products[0];
  const productContent = await fetchProductContent(args.request, product.id);

  // Only fetch reviews if the feature flag is enabled
  const productReviews = featureFlags.customer_reviews
    ? await fetchProductReviews(product.id, {
        offset: reviewsOffset,
        limit: reviewsLimit,
      })
    : { reviews: [], limit: 0, offset: 0, count: 0 };

  return {
    product,
    productContent,
    productReviews,
    featureFlags,
  };
};

export type ProductPageLoaderData = typeof loader;

export const meta: MetaFunction<ProductPageLoaderData> = getMergedProductMeta;

export default function ProductDetailRoute() {
  const { product, productContent } = useLoaderData<ProductPageLoaderData>();
  const { t } = useI18n();
  return (
    <>
      <ProductTemplate
        product={product}
        productContent={productContent}
      />
      <ProductList className="!pb-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
    </>
  );
}
