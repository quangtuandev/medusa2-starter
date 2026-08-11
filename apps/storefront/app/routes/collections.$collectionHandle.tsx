import { Container } from "@app/components/common/container";
import { ProductListWithPagination } from "@app/components/product/ProductListWithPagination";
import { PageHeading } from "@app/components/sections/PageHeading";
import { fetchCollections } from "@libs/util/server/data/collections.server";
import { fetchProducts } from "@libs/util/server/products.server";
import clsx from "clsx";
import { LoaderFunctionArgs, redirect } from "react-router";
import { NavLink, useLoaderData } from "react-router";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.collectionHandle as string;

  const { collections } = await fetchCollections(request);

  const collection = collections?.find(
    (collection) => collection.handle === handle
  );

  if (!collection) throw redirect("/products");

  const { products, count, limit, offset } = await fetchProducts(request, {
    collection_id: collection.id,
  });

  return { products, count, limit, offset, collection };
};

export type ProductCollectionRouteLoader = typeof loader;

export default function ProductCollectionRoute() {

  const data = useLoaderData<ProductCollectionRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, collection } = data;

  const description = collection.metadata?.description as string || '';


  return (
    <Container className="pb-16">
      <div className="relative mb-2 lg:mb-14 flex flex-col xl:flex-row items-center xl:items-end text-4xl xl:text-[110px] leading-normal xl:leading-[114px] text-[#321D14] mt-12 after:hidden xl:after:block after:content-[''] after:block after:w-1/2 after:h-[1px] after:bg-[#000000] after:absolute after:bottom-[32px] after:left-0">
        <p className="flex-1 font-title font-bold uppercase leading-none relative lg:top-[-18px] top-0">
          <span>This</span> <br className="hidden xl:block" />
          <span className="px-0 xl:pl-[14px] xl:pr-16 bg-white z-10 relative">is</span>
        </p>
        <div className="flex-1 flex items-center justify-center">
          <span className="inline-block justify-center bg-white z-10 relative lg:pl-16 px-1 text-center font-centuryBook block italic">
            {collection.title}
          </span>
          <div className="relative h-10 xl:h-20 w-10 xl:w-20 z-10 top-[-5px] left-[-5px]">
            <img
              className="animate-rotate-bounce absolute top-0 left-0"
              src="/assets/images/home/cup.svg"
              alt="Cup"
            />
            <img
              className="reverse-animate-rotate-bounce absolute top-0 left-0"
              src="/assets/images/home/cup-bg.svg"
              alt="Cup"
            />
          </div>
        </div>
        <div className="flex-1" />
      </div>
      {description && (
        <div className="flex gap-4 sm:flex-row max-w-3xl mx-auto h-[84px] mb-6">
          <p className="text-lg font-montserrat font-regular text-[15px] leading-[26px] text-center text-[#000] flex-1">{description}</p>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <ProductListWithPagination
            products={products}
            paginationConfig={{ count, offset, limit }}
            context="products"
          />
        </div>
      </div>
    </Container>
  );
}
