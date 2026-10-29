"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.POST = exports.GET = void 0;
const homepage_1 = require("../../../../modules/homepage");
const upsert_homepage_1 = require("../../../../workflows/upsert-homepage");
const validators_1 = require("../validators");
/** All slides of the hero carousel, in display order. */
const GET = async (req, res) => {
    const service = req.scope.resolve(homepage_1.HOMEPAGE_MODULE);
    const hero_banners = await service.listHeroBanners({}, { order: { rank: 'ASC', created_at: 'ASC' } });
    res.json({
        hero_banners,
        // Kept for clients that still expect a single banner.
        hero_banner: hero_banners?.[0] ?? null,
    });
};
exports.GET = GET;
const upsert = async (req, res) => {
    const parsed = validators_1.heroBannerSchema.safeParse(req.body);
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
    const service = req.scope.resolve(homepage_1.HOMEPAGE_MODULE);
    // New slides go to the end of the carousel unless a rank was provided.
    let rank = input.rank;
    if (rank == null) {
        const [last] = await service.listHeroBanners({}, { order: { rank: 'DESC' }, take: 1 });
        rank = last?.rank != null ? Number(last.rank) + 1 : 0;
    }
    const titleVi = input.title_vi || input.title || titleEn;
    const ctaLabelEn = input.cta_label_en || input.cta_label || 'SHOP NOW';
    const payload = {
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
    const { result } = await (0, upsert_homepage_1.upsertHeroBannerWorkflow)(req.scope).run({
        input: payload,
    });
    res.json({ hero_banner: result });
};
exports.POST = upsert;
exports.PUT = upsert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2hvbWVwYWdlL2hlcm8vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkRBQStEO0FBQy9ELDJFQUEwRztBQUMxRyw4Q0FBaUQ7QUFFakQseURBQXlEO0FBQ2xELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLE9BQU8sR0FBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBZSxDQUFDLENBQUM7SUFFeEQsTUFBTSxZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV0RyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsWUFBWTtRQUNaLHNEQUFzRDtRQUN0RCxXQUFXLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSTtLQUN2QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFWVyxRQUFBLEdBQUcsT0FVZDtBQUVGLE1BQU0sTUFBTSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUMvRCxNQUFNLE1BQU0sR0FBRyw2QkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLEVBQUUsY0FBYztZQUNwQixPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxD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