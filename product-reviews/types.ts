/**
 * Product Reviews Module - Type Definitions
 */

export type ReviewStatus = "pending" | "approved" | "rejected"

export interface Review {
  id: string
  product_id: string
  name: string
  content: string
  stars: number
  status: ReviewStatus
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface CreateReviewInput {
  product_id: string
  name: string
  content: string
  stars: number
}

export interface UpdateReviewInput {
  product_id?: string
  name?: string
  content?: string
  stars?: number
  status?: ReviewStatus
}

export interface ReviewFilters {
  product_id?: string
  status?: ReviewStatus
}

export interface ReviewListResponse {
  reviews: Review[]
  count: number
  limit?: number
  offset?: number
}

export interface ProductReviewsResponse {
  reviews: Review[]
  count: number
  average_rating: number
}

export interface ReviewActionResponse {
  review: Review
  message?: string
}
