import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData, NavLink } from "react-router";
import { useI18n } from "@app/hooks/useI18n";
import { fetchCollections } from "@libs/util/server/data/collections.server";
import { fetchProducts } from "@libs/util/server/products.server";
import { fetchSliderCards } from "@libs/util/server/slider-cards.server";
import { Container } from "@app/components/common/container";
import { ProductGrid } from "@app/components/product/ProductGrid";
import { HalfFanSlider, SliderCardItem } from "@app/components/product/HalfFanSlider";

export type { SliderCardItem };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { collections } = await fetchCollections(request);

  // Map products into their respective collections
  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      const { products } = await fetchProducts(request, {
        collection_id: collection.id,
        limit: 100,
      });
      return { ...collection, products };
    })
  );

  const slider_cards = await fetchSliderCards();

  return { collectionsWithProducts, slider_cards };
};

export default function ProductsPage() {
  const { t } = useI18n();
  const { collectionsWithProducts, slider_cards } = useLoaderData<typeof loader>();
  const [displayCard, setDisplayCard] = useState<SliderCardItem | null>(null);

  return (
    <div className="min-h-[max(calc(100vh-144px),_900px)] flex flex-col items-center">
      {/* Half Fan Slider */}
      <HalfFanSlider
        sliderCards={slider_cards}
        onDisplayCardChange={setDisplayCard}
      />

      {/* Product List Grid Area */}
      <Container className="w-full pb-32 mt-12 xl:mt-24">
        {displayCard?.handle === "coming" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in w-full">
            <h3 className="font-centuryBook italic text-3xl xl:text-5xl text-[#000] mb-4">
              {t('products.stayTuned') || "Stay Tuned"}
            </h3>
            <p className="font-body text-gray-500 max-w-md">
              {t('products.comingDescription') || "We are crafting something magical for you. Follow us for updates!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center lg:gap-24 gap-12 collections-index animate-fade-in">
            {collectionsWithProducts.map((collection) => (
              <div className="flex flex-col lg:gap-[34px] gap-6 w-full collections-index_item animate-fade-in" key={collection.id}>
                <div className="min-h-[54px] flex items-center justify-center">
                  <NavLink
                    to={`/collections/${collection.handle}`}
                    className="rounded-full bg-[#699BFF] text-white uppercase py-2.5 px-6 text-lg font-body font-bold hover:scale-105 transition-transform duration-200 min-w-[180px] text-center"
                  >
                    {collection.title}
                  </NavLink>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row w-full">
                  <div className="flex-1 w-full">
                    <ProductGrid products={collection.products as any} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
