import { Container } from "@app/components/common/container";
import { ProductGrid } from "@app/components/product/ProductGrid";
import { fetchCollections } from "@libs/util/server/data/collections.server";
import { fetchProducts } from "@libs/util/server/products.server";
import { LoaderFunctionArgs, redirect } from "react-router";
import { NavLink, useLoaderData } from "react-router";
import { CollectionsHeading } from "@app/components/sections/CollectionsHeading";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { collections } = await fetchCollections();

  if (!collections.length) throw redirect("/products");

  // Map products into their respective collections
  // For each collection, fetch its products and attach them to the collection object
  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      const { products, count, limit, offset } = await fetchProducts(request, {
        collection_id: collection.id,
      });
      return { ...collection, products, count, limit, offset };
    })
  );

  return { collectionsWithProducts };
};

export type ProductCollectionRouteLoader = typeof loader;

export default function ProductCollectionRoute() {
  const data = useLoaderData<ProductCollectionRouteLoader>();

  if (!data) return null;

  const { collectionsWithProducts } = data;

  return (
    <Container className="pb-32">
      <h1 className="relative text-center text-4xl xl:text-[100px] leading-normal xl:leading-[114px] text-[#321D14] mt-12 xl:mt-24 after:hidden xl:after:block after:content-[''] after:block after:w-full after:h-[1px] after:bg-[#000000] after:absolute after:bottom-[32px] after:left-0">
        <span className="inline-block justify-center bg-white z-10 relative px-16 text-center">
          <span className=" font-centuryBook block leading-normal xl:leading-6">All</span>
          <span className="font-bold font-title uppercase">Collections</span>
        </span>
      </h1>

      {collectionsWithProducts.length > 1 && (
        <div className="flex flex-col w-full items-center gap-32 collections-index">
          {collectionsWithProducts.map((collection) => (
            <div className="flex flex-col gap-[34px] w-full collections-index_item" key={collection.id}>
              <div className="min-h-[54px] flex items-center">
                <NavLink
                  to={`/collections/${collection.handle}`}
                  key={collection.id}
                  className="rounded-full bg-[#000] text-white uppercase py-2 px-4 text-lg font-body font-bold"
                >
                  {collection.title}
                </NavLink>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <ProductGrid products={collection.products} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
