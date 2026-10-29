import { BestSellerSection } from '@app/components/home/BestSellerSection';
import { CollectionsSection } from '@app/components/home/CollectionsSection';
import { FloatingActions } from '@app/components/home/FloatingActions';
import { HeroSlider } from '@app/components/home/HeroSlider';
import { SiteHeader } from '@app/components/home/SiteHeader';
import { getMergedPageMeta } from '@libs/util/page';
import { fetchCollections } from '@libs/util/server/data/collections.server';
import { fetchHomepageConfig } from '@libs/util/server/homepage.server';
import { fetchSliderCards } from '@libs/util/server/slider-cards.server';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [homepage, sliderCards, collectionsData] = await Promise.all([
    fetchHomepageConfig(request),
    fetchSliderCards(),
    fetchCollections(request),
  ]);

  const collections = collectionsData?.collections ?? [];

  // The deck prefers the CMS cards; when there are none, collections with a cover
  // image are mapped into the same shape so the section is never empty.
  const cards =
    sliderCards && sliderCards.length
      ? sliderCards
      : collections
          .map((collection, index) => {
            const metadata = (collection.metadata ?? {}) as Record<string, unknown>;
            const image = (metadata.cover_image as string) || (metadata.image as string) || '';

            return {
              id: collection.id,
              title_en: collection.title ?? '',
              title_vi: collection.title ?? '',
              subtitle_en: '',
              subtitle_vi: '',
              image,
              image_active: '',
              icon: '',
              linkto: `/collections/${collection.handle}`,
              rank: index,
            };
          })
          .filter((card) => !!card.image);

  return {
    homepage,
    slider_cards: cards,
    collectionHandles: collections.map((collection) => collection.handle),
  };
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

export default function IndexRoute() {
  const { homepage, slider_cards, collectionHandles } = useLoaderData<typeof loader>();

  return (
    <div className="relative w-full bg-white">
      <SiteHeader />
      <HeroSlider slides={homepage.heroes} />
      <BestSellerSection bestSeller={homepage.best_seller} />
      <CollectionsSection sliderCards={slider_cards} collectionHandles={collectionHandles} />
      <FloatingActions />
    </div>
  );
}
