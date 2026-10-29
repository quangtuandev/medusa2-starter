import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { HOMEPAGE_MODULE } from '../../../../modules/homepage';
import { HeroBannerWorkflowInput, upsertHeroBannerWorkflow } from '../../../../workflows/upsert-homepage';
import { heroBannerSchema } from '../validators';

/** All slides of the hero carousel, in display order. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service: any = req.scope.resolve(HOMEPAGE_MODULE);

  const hero_banners = await service.listHeroBanners({}, { order: { rank: 'ASC', created_at: 'ASC' } });

  res.json({
    hero_banners,
    // Kept for clients that still expect a single banner.
    hero_banner: hero_banners?.[0] ?? null,
  });
};

const upsert = async (req: MedusaRequest, res: MedusaResponse) => {
  const parsed = heroBannerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      type: 'invalid_data',
      message: 'Invalid hero banner payload',
      errors: parsed.error.flatten(),
    });
  }

  const input = parsed.data;
  const titleEn = input.title_en || input.title;

  if (!titleEn) {
    return res.status(400).json({
      type: 'invalid_data',
      message: 'title_en (or title) is required',
    });
  }

  const service: any = req.scope.resolve(HOMEPAGE_MODULE);

  // New slides go to the end of the carousel unless a rank was provided.
  let rank = input.rank;
  if (rank == null) {
    const [last] = await service.listHeroBanners({}, { order: { rank: 'DESC' }, take: 1 });
    rank = last?.rank != null ? Number(last.rank) + 1 : 0;
  }

  const titleVi = input.title_vi || input.title || titleEn;
  const ctaLabelEn = input.cta_label_en || input.cta_label || 'SHOP NOW';

  const payload: HeroBannerWorkflowInput = {
    id: input.id,
    is_active: input.is_active ?? true,
    rank,
    image_desktop_url: input.image_desktop_url,
    image_mobile_url: input.image_mobile_url ?? null,
    title_en: titleEn,
    title_vi: titleVi,
    subtitle_en: input.subtitle_en ?? input.subtitle ?? null,
    subtitle_vi: input.subtitle_vi ?? input.subtitle ?? null,
    cta_label_en: ctaLabelEn,
    cta_label_vi: input.cta_label_vi || input.cta_label || 'MUA NGAY',
    cta_href: input.cta_href || '/products',
    cta_variant: input.cta_variant || 'primary',
    text_color: input.text_color || '#FFFFFF',
    text_align: input.text_align || 'left',
  };

  const { result } = await upsertHeroBannerWorkflow(req.scope).run({
    input: payload,
  });

  res.json({ hero_banner: result });
};

export const POST = upsert;
export const PUT = upsert;
