import { LightboxGallery } from '@app/components/common/images/LightboxGallery';
import { StoreProductReview } from '@lambdacurry/medusa-plugins-sdk';
import { formatDate } from '@libs/util';
import { type FC, useState } from 'react';
import { ReviewImageThumbnailRow } from './ReviewImageThumbnailRow';
import { StarRating } from './StarRating';

export interface ProductReviewListProps {
  productReviews?: StoreProductReview[];
  className?: string;
}

export const ProductReviewList: FC<ProductReviewListProps> = ({ productReviews }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<{ url: string; alt?: string; name?: string }[]>([]);

  // Function to handle image click from any review
  const handleImageClick = (reviewImages: { url: string; alt?: string; name?: string }[], imageIndex: number) => {
    setCurrentGalleryImages(reviewImages);
    setLightboxIndex(imageIndex);
  };
  return (
    <div>
      {productReviews && productReviews.length > 0 && (
        <div className="">
          {productReviews.map((review, reviewIndex) => {
            const galleryImages = (review.images || []).map((image) => ({
              url: image.url,
              alt: "Customer's review image",
              name: "Customer's review image",
            }));

            return (
              <div key={review.id} className="py-8">
                <div className=" flex items-center justify-between">
                  <div>
                    <svg width="54" height="53" viewBox="0 0 54 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="27.5" cy="21.5" r="11.5" fill="#FFE977" />
                      <path d="M34 39.6667C34 41.8758 29.8932 45 27.5 45C25.1068 45 21 41.8758 21 39.6667C21 37.4575 25.1068 37 27.5 37C29.8932 37 34 37.4575 34 39.6667Z" fill="#FFE977" />
                      <path d="M27 0.706055C41.5344 0.706055 53.2939 12.2666 53.2939 26.5C53.2939 40.7334 41.5344 52.2939 27 52.2939C12.4656 52.2939 0.706055 40.7334 0.706055 26.5C0.706055 12.2666 12.4656 0.706055 27 0.706055Z" stroke="black" stroke-width="1.41144" />
                    </svg>
                  </div>
                  <h3 className="px-1.5 text-sm font-bold text-[32px] leading-[42px] tracking-normal uppercase line-clamp-1 text-center">{review.name ?? 'Anonymous'}</h3>
                  <div className="mt-1 flex items-center pb-1">
                    <StarRating value={review.rating ?? 0} readOnly />
                  </div>
                  <p className="sr-only">{review.rating} out of 5 stars</p>
                </div>
                {/* <time className="text-xs italic text-gray-900" dateTime={review.created_at}>
                  {formatDate(new Date(review.created_at))}
                </time> */}

                <div
                  className="mt-4 space-y-6 text-base italic text-gray-600"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />

                {galleryImages.length > 0 && (
                  <ReviewImageThumbnailRow
                    galleryImages={galleryImages}
                    onClick={(imageIndex) => handleImageClick(galleryImages, imageIndex)}
                  />
                )}

                {/* Store Owner Response */}
                {review.response && review.response.content && (
                  <div className="mt-4 rounded-md bg-gray-50 p-4">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">Barrio's Response</h4>
                      {review.response.created_at && (
                        <time
                          className="ml-2 text-xs italic text-gray-500"
                          dateTime={String(review.response.created_at)}
                        >
                          {formatDate(new Date(review.response.created_at))}
                        </time>
                      )}
                    </div>
                    <div
                      className="mt-2 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: review.response.content }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Single LightboxGallery for all reviews */}
      <LightboxGallery
        images={currentGalleryImages.map(({ url, ...image }) => ({ ...image, src: url }))}
        lightBoxIndex={lightboxIndex}
        setLightBoxIndex={setLightboxIndex}
      />
    </div>
  );
};
