import { useEffect, useState } from "react";
import { Container } from "@app/components/common/container";
import { ProductListWithPagination } from "@app/components/product/ProductListWithPagination";
import { PageHeading } from "@app/components/sections/PageHeading";
import { fetchCollections } from "@libs/util/server/data/collections.server";
import { fetchProducts } from "@libs/util/server/products.server";
import clsx from "clsx";
import { LoaderFunctionArgs, redirect } from "react-router";
import { NavLink, useLoaderData } from "react-router";
import { useI18n } from '@app/hooks/useI18n';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.collectionHandle as string;

  const { collections } = await fetchCollections();

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

  const [description, setDescription] = useState<string>('');
  const { currentLanguage } = useI18n();
  useEffect(() => {
    if (currentLanguage === 'vi') {
      setDescription(collection.metadata?.description_vi as string || '');
    } else {
      setDescription(collection.metadata?.description_en as string || '');
    }
  }, [currentLanguage, data.collection.metadata]);


  return (
    <Container className="pb-16">
      <h1 className="relative flex items-end text-[110px] text-[#321D14] mt-12 after:content-[''] after:block after:w-1/2 after:h-[1px] after:bg-[#000000] after:absolute after:bottom-[32px] after:left-0">
        <p className="flex-1 font-title font-bold uppercase leading-none relative top-[-18px]">
          <span>This</span> <br />
          <span className="pl-[14px] pr-16 bg-white z-10 relative">is</span>
        </p>
        <span className="flex-1 inline-block justify-center bg-white z-10 relative px-16 text-center font-centuryBook block italic">
          {collection.title}
        </span>
        <div className="flex-1">
          <div className="relative h-20 w-20 -top-16 -left-16 z-10">
            <img
              className="animate-rotate-bounce absolute top-0 left-0"
              src="/assets/images/home/cup.svg"
              alt="Cup"
            />
            <img
              className="animate-rotate-bounce-reverse absolute top-0 left-0"
              src="/assets/images/home/cup-bg.svg"
              alt="Cup"
            />
          </div>
        </div>
      </h1>
      <div className="flex gap-4 sm:flex-row max-w-3xl mx-auto h-[84px] mb-6">
        <p className="text-lg font-montserrat font-regular text-[15px] leading-[26px] text-center text-[#000] flex-1">{description}</p>
      </div>

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
