import { z } from 'zod';

/**
 * Hero banner payload. `title` / `subtitle` / `cta_label` are accepted as
 * language-neutral aliases so the endpoint also matches the plain spec shape.
 */
export const heroBannerSchema = z.object({
  id: z.string().optional(),
  is_active: z.boolean().optional(),
  /** Slide order in the hero carousel. */
  rank: z.number().int().min(0).optional(),

  image_desktop_url: z.string().min(1),
  image_mobile_url: z.string().nullish(),

  title_en: z.string().min(1).optional(),
  title_vi: z.string().min(1).optional(),
  title: z.string().min(1).optional(),

  subtitle_en: z.string().nullish(),
  subtitle_vi: z.string().nullish(),
  subtitle: z.string().nullish(),

  cta_label_en: z.string().min(1).optional(),
  cta_label_vi: z.string().min(1).optional(),
  cta_label: z.string().min(1).optional(),
  cta_href: z.string().min(1).optional(),

  cta_variant: z.enum(['primary', 'outline', 'glass']).optional(),
  text_color: z.string().optional(),
  text_align: z.enum(['left', 'center']).optional(),
});

export type HeroBannerPayload = z.infer<typeof heroBannerSchema>;

/**
 * Best seller card. Either `image_url` (hand-picked artwork) or `product_id`
 * (catalogue product) must be present.
 */
export const bestSellerItemSchema = z
  .object({
    product_id: z.string().nullish(),
    image_url: z.string().min(1).optional(),
    link: z.string().nullish(),
    alt_en: z.string().nullish(),
    alt_vi: z.string().nullish(),
    rank: z.number().int().min(0).optional(),
  })
  .refine((item) => !!item.image_url || !!item.product_id, {
    message: 'Each best seller item needs an image_url or a product_id',
    path: ['image_url'],
  });

export const bestSellerSchema = z.object({
  id: z.string().optional(),
  is_active: z.boolean().optional(),

  heading_en: z.string().min(1).optional(),
  heading_vi: z.string().min(1).optional(),
  heading: z.string().min(1).optional(),

  description_en: z.string().nullish(),
  description_vi: z.string().nullish(),
  description: z.string().nullish(),

  items: z.array(bestSellerItemSchema).min(1).max(6),
});

export type BestSellerPayload = z.infer<typeof bestSellerSchema>;
