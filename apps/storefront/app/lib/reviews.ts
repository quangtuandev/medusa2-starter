/**
 * Product Reviews API Client Utilities
 * Handles communication with the backend reviews API
 */

export interface Review {
  id: string
  product_id: string
  name: string
  content: string
  stars: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface CreateReviewInput {
  product_id: string
  name: string
  content: string
  stars: number
}

export interface ProductReviewsResponse {
  reviews: Review[]
  count: number
  average_rating: number
}

export interface ReviewSubmissionResponse {
  review: Review
  message?: string
}

/**
 * Get the backend URL for API calls
 * Fallback to window.location.origin if not provided
 */
export const getBackendUrl = (customUrl?: string): string => {
  if (customUrl) return customUrl

  if (typeof window !== 'undefined') {
    // In browser environment
    const env = import.meta.env.INTERNAL_MEDUSA_API_URL
    if (env) return env
  }

  return import.meta.env.INTERNAL_MEDUSA_API_URL || 'http://localhost:9000'
}

/**
 * Fetch reviews for a specific product
 * Only returns approved reviews
 */
export async function getProductReviews(
  productId: string,
  backendUrl?: string
): Promise<ProductReviewsResponse> {
  const url = getBackendUrl(backendUrl)

  try {
    const response = await fetch(`${url}/store/reviews/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `Failed to fetch reviews: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

/**
 * Submit a new review
 * Default status is "pending"
 */
export async function submitReview(
  data: CreateReviewInput,
  backendUrl?: string
): Promise<ReviewSubmissionResponse> {
  const url = getBackendUrl(backendUrl)

  // Validate input
  if (!data.product_id) throw new Error('Product ID is required')
  if (!data.name || !data.name.trim()) throw new Error('Name is required')
  if (!data.content || !data.content.trim()) throw new Error('Review content is required')
  if (data.stars < 1 || data.stars > 5) throw new Error('Stars must be between 1 and 5')

  try {
    const response = await fetch(`${url}/store/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: data.product_id,
        name: data.name.trim(),
        content: data.content.trim(),
        stars: parseInt(data.stars.toString()),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `Failed to submit review: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting review:', error)
    throw error
  }
}

/**
 * Fetch product reviews with error handling
 * Returns empty array on error
 */
export async function fetchProductReviewsSafe(
  productId: string,
  backendUrl?: string
): Promise<ProductReviewsResponse> {
  try {
    return await getProductReviews(productId, backendUrl)
  } catch (error) {
    console.warn('Failed to fetch reviews, returning empty list:', error)
    return {
      reviews: [],
      count: 0,
      average_rating: 0,
    }
  }
}

/**
 * Check if a review submission is valid
 */
export function validateReviewSubmission(data: Partial<CreateReviewInput>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.product_id) {
    errors.push('Product ID is required')
  }

  if (!data.name || !data.name.trim()) {
    errors.push('Name is required')
  } else if (data.name.length > 255) {
    errors.push('Name must be 255 characters or less')
  }

  if (!data.content || !data.content.trim()) {
    errors.push('Review content is required')
  } else if (data.content.length > 1000) {
    errors.push('Review must be 1000 characters or less')
  } else if (data.content.length < 10) {
    errors.push('Review must be at least 10 characters')
  }

  if (!data.stars) {
    errors.push('Star rating is required')
  } else if (data.stars < 1 || data.stars > 5 || !Number.isInteger(data.stars)) {
    errors.push('Star rating must be between 1 and 5')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Format a review date for display
 */
export function formatReviewDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Calculate average rating from reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.stars, 0)
  return sum / reviews.length
}

/**
 * Get review distribution (count by stars)
 */
export function getReviewDistribution(reviews: Review[]) {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }

  reviews.forEach((review) => {
    if (review.stars >= 1 && review.stars <= 5) {
      distribution[review.stars as keyof typeof distribution]++
    }
  })

  return distribution
}
