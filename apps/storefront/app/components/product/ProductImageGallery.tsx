import { ScrollArrowButtons } from '@app/components/common/buttons/ScrollArrowButtons';
import { Image } from '@app/components/common/images/Image';
import { LightboxGallery } from '@app/components/common/images/LightboxGallery';
import { useScrollArrows } from '@app/hooks/useScrollArrows';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, memo, useEffect, useState } from 'react';
import MorphingShape from '../generativeart/MorphingShape';
import { randomAssetMorphingShape } from '@libs/util/random';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
export interface ProductGalleryImage {
  id: string;
  url: string;
  alt?: string;
  name?: string;
}

export interface ProductImageGalleryProps {
  product: StoreProduct;
  [key: string]: any;
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

export const ProductImageGallery: FC<ProductImageGalleryProps> = ({ product, variantImage }) => {
  const { images: productImages = [], thumbnail } = product;
  const images = productImages ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

  const nextTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  useEffect(() => {
    const index = gallery.findIndex((image) => image.url === variantImage);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [variantImage]);

  return (
    <TabGroup as="div" className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      {gallery.length > 1 && (
        <div className="xl:absolute xl:-bottom-8 flex justify-center w-full gap-4">
          <TabList
            ref={scrollableDivRef}
            className="flex flex-row gap-2 p-3 bg-[#D1D1D1] rounded-full"
          >
            {gallery.map((image, index) => (
              <Tab key={image.id} className="relative flex w-2 h-2 items-center justify-center cursor-pointer rounded-lg transition-all duration-200 focus:outline-none aria-selected:border-blue-500">
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(`absolute h-2 w-2 rounded-full transition-colors duration-300 bg-white`, {
                        'opacity-40': !selected,
                      })}
                    />
                  </>
                )}
              </Tab>
            ))}
          </TabList>
          <div className="flex justify-between gap-2 z-10">
            <button
              onClick={prevTab}
              className="w-8 h-8 py-1 bg-[#D1D1D1] rounded-full flex items-center justify-center focus:outline-none focus:ring-0 hover:bg-gray-300"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={nextTab}
              className="w-8 h-8 py-1 bg-[#D1D1D1] rounded-full flex items-center justify-center focus:outline-none focus:ring-0 hover:bg-gray-300"
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}

      <TabPanels className="h-[320px] xl:h-[380px]">
        <div className="relative rounded-2xl h-full">
          <MorphingShape {...randomAssetMorphingShape(product.subtitle)} zoom={0.5} classNameWrapper='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !h-auto' />

          {gallery.length > 0 ? (
            gallery.map((image, imageIndex) => (
              <TabPanel
                key={image.id}
                className="group relative w-1/2 mx-auto overflow-hidden cursor-pointer z-10 h-full"
                onClick={() => setLightboxIndex(imageIndex)}
              >
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
