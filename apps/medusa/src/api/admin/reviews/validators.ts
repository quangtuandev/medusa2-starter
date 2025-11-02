import { z } from "zod"

export const AdminCreateReview = z.object({
  product_id: z.string(),
  name: z.string(),
  content: z.string(),
  stars: z.number().min(1).max(5),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
})

export const AdminUpdateReview = z.object({
  product_id: z.string().optional(),
  name: z.string().optional(),
  content: z.string().optional(),
  stars: z.number().min(1).max(5).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
})
