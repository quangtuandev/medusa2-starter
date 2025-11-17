import { StarRating } from './StarRating';
export interface Review {
  id: string;
  product_id: string;
  name: string;
  content: string;
  stars: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductReviewListProps {
  productId: string;
  productReviews?: Review[];
  className?: string;
}

export const ProductReviewList = ({
  productReviews,
}) => {

  return (
    <div>
      {/* Reviews List */}
      {productReviews && productReviews.length > 0 && (
        <div className="space-y-8">
          {productReviews.map((review, reviewIndex) => {
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

                  <h3 className="px-1.5 font-title font-extrabold text-2xl xl:text-[32px] leading-normal xl:leading-[42px] tracking-normal uppercase line-clamp-1 text-center">{review.name ?? 'Anonymous'}</h3>
                  <div className="mt-1 flex items-center pb-1">
                    <StarRating value={review.stars ?? 0} readOnly />
                  </div>
                  <p className="sr-only">{review.stars} out of 5 stars</p>
                </div>

                <div
                  className="mt-4 space-y-6 text-base text-gray-600"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* No Reviews Message */}
      {(!productReviews || productReviews.length === 0) && (
        <div className="mb-8 text-center py-8 text-gray-500">
          <p className="text-lg">No reviews yet. Be the first to review this product!</p>
        </div>
      )}

    </div>
  );
};
