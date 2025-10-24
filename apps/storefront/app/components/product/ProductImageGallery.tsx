import { ScrollArrowButtons } from '@app/components/common/buttons/ScrollArrowButtons';
import { Image } from '@app/components/common/images/Image';
import { LightboxGallery } from '@app/components/common/images/LightboxGallery';
import { useScrollArrows } from '@app/hooks/useScrollArrows';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, memo, useState } from 'react';
import MorphingShape from '../generativeart/MorphingShape';
import { randomAssetMorphingShape } from '@libs/util/random';

export interface ProductGalleryImage {
  id: string;
  url: string;
  alt?: string;
  name?: string;
}

export interface ProductImageGalleryProps {
  product: StoreProduct;
}

const GalleryImagesRow: FC<{ galleryImages: ProductGalleryImage[] }> = memo(({ galleryImages }) => {
  return (
    <>
      {galleryImages.map((image, imageIndex) => (
        <Tab
          key={image.id}
          className={
            'relative mb-0 mr-0 inline-block h-16 w-16 flex-none snap-start whitespace-nowrap rounded-lg overflow-hidden bg-white text-sm font-medium uppercase text-gray-900 last:mb-0 hover:bg-gray-50 focus:outline-none focus:ring-0 transition-all duration-200 lg:mb-3 lg:h-20 lg:w-20'
          }
        >
          {({ selected }) => (
            <>
              <span className="sr-only">{image.name}</span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt || 'tab for image gallery'}
                  className={'h-full w-full object-cover object-center transition-transform duration-200 hover:scale-105'}
                />
              </span>
              <span
                className={clsx(
                  'pointer-events-none absolute inset-0 rounded-lg border-2 transition-all duration-200',
                  {
                    'border-blue-500 shadow-lg': selected,
                    'border-gray-200': !selected,
                  }
                )}
                aria-hidden="true"
              />
              {selected && (
                <span className="absolute inset-0 rounded-lg bg-blue-500/10" aria-hidden="true" />
              )}
            </>
          )}
        </Tab>
      ))}
    </>
  );
});

export const ProductImageGallery: FC<ProductImageGalleryProps> = ({ product }) => {
  const { images: productImages = [], thumbnail } = product;
  const images = productImages ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { scrollableDivRef, showStartArrow, showEndArrow, handleArrowClick } = useScrollArrows({
    buffer: 50,
    resetOnDepChange: [product],
  });

  const gallery: ProductGalleryImage[] =
    images?.length < 1 && thumbnail
      ? [
        {
          id: 'thumbnail',
          name: `Thumbnail for ${product.title}`,
          url: thumbnail,
          alt: product.description || product.title,
        },
      ]
      : (images as ProductGalleryImage[]);

  return (
    <TabGroup as="div" className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      <h2 className="sr-only">Images</h2>
      {/* {gallery.length > 1 && (
        <div className="flex-row lg:flex-col">
          <TabList
            ref={scrollableDivRef}
            className="flex flex-row gap-2 overflow-x-auto scrollbar-hide lg:flex-col lg:gap-3 lg:max-h-[600px] lg:overflow-y-auto lg:px-0 lg:py-0"
          >
            <GalleryImagesRow galleryImages={gallery} />
          </TabList>
        </div>
      )} */}

      <TabPanels className="flex-1">
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          {gallery.length > 0 ? (
            gallery.map((image, imageIndex) => (
              <TabPanel
                key={image.id}
                className="group relative h-full w-full overflow-hidden cursor-pointer"
                onClick={() => setLightboxIndex(imageIndex)}
              >
                <MorphingShape {...randomAssetMorphingShape()} zoom={0.75} classNameWrapper='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !h-auto' />
                <Image
                  key={image.id}
                  style={{
                    viewTransitionName: 'product-thumbnail',
                  }}
                  src={image.url}
                  alt={image.alt || 'selected image for product'}
                  className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105 -rotate-[14deg]"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                <div className="absolute right-4 top-4 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-2.5 opacity-0 transition-all duration-300 shadow-lg group-hover:opacity-100 hover:scale-110">
                  <MagnifyingGlassPlusIcon className="h-5 w-5 text-gray-700" />
                </div>
              </TabPanel>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 rounded-2xl">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

        </div>
      </TabPanels>
      <LightboxGallery
        images={gallery.map((image) => ({
          src: image.url,
          alt: image.alt || 'Product image',
        }))}
        lightBoxIndex={lightboxIndex}
        setLightBoxIndex={setLightboxIndex}
      />
    </TabGroup>
  );
};
