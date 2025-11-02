import { FC, useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { Button } from '../common/buttons';
import { useFetcher } from 'react-router-dom';

export interface SimpleReviewFormProps {
  productId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

type FetcherData = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[] | undefined>;
  message?: string;
  review?: any;
};

export const SimpleReviewForm: FC<SimpleReviewFormProps> = ({
  productId,
  onSubmitSuccess,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [stars, setStars] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fetcher = useFetcher<FetcherData>();

  const isSubmitting = fetcher.state !== 'idle';

  // Handle form response
  useEffect(() => {
    if (fetcher.data?.success) {
      setSuccess(true);
      setName('');
      setContent('');
      setStars(5);
      setError(null);

      // Clear success message and call callback after 2 seconds
      const timer = setTimeout(() => {
        setSuccess(false);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else if (fetcher.data?.error) {
      setError(fetcher.data.error);
    } else if (fetcher.data?.errors) {
      const errorMessages = Object.entries(fetcher.data.errors)
        .filter(([_, messages]) => messages && (messages as any[]).length > 0)
        .map(([field, messages]) => `${field}: ${(messages as any[])?.[0] || 'Invalid'}`)
        .join(', ');
      setError(errorMessages || 'Validation failed');
    }
  }, [fetcher.data, onSubmitSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!content.trim()) {
      setError('Please write a review');
      return;
    }

    if (content.length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    if (stars < 1 || stars > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }

    // Submit form via fetcher
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('name', name);
    formData.append('content', content);
    formData.append('stars', stars.toString());

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/product-reviews/create',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
          <p className="font-semibold">Thank you!</p>
          <p className="text-sm mt-1">
            Your review has been submitted and is pending approval.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <StarRating
            value={stars}
            onChange={(value: number) => setStars(value)}
            readOnly={false}
          />
          <span className="text-sm text-gray-600 ml-2">
            {stars === 0 ? 'No rating' : `${stars} out of 5 stars`}
          </span>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
          maxLength={255}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      {/* Review Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us what you think about this product..."
          disabled={isSubmitting}
          maxLength={1000}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          {content.length}/1000 characters
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-between">
        <Button
          type="button"
          variant="default"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};
