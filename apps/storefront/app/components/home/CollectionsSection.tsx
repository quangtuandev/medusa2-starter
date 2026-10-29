import { HalfFanSlider } from '@app/components/product/HalfFanSlider';
import { useI18n } from '@app/hooks/useI18n';

/**
 * Homepage v2 "All Collections" block: the fan deck without its info panel, so
 * only the cards themselves are shown (the heading carries the section).
 */
export const CollectionsSection = ({
  sliderCards,
  collectionHandles,
}: {
  sliderCards?: any[];
  collectionHandles?: string[];
}) => {
  const { t } = useI18n();

  return (
    <section className="w-full overflow-hidden bg-white pb-24 pt-8 md:pt-12">
      <HalfFanSlider
        sliderCards={sliderCards}
        collectionHandles={collectionHandles}
        showInfoPanel={false}
        heading={{ idle: t('products.all') }}
      />
    </section>
  );
};
