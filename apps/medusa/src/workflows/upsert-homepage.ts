import { StepResponse, WorkflowResponse, createStep, createWorkflow } from '@medusajs/framework/workflows-sdk';
import { HOMEPAGE_MODULE } from '../modules/homepage';

/** Shape of a single "Best Seller" card, stored as JSON on the section. */
export type BestSellerItemInput = {
  product_id?: string | null;
  image_url?: string;
  link?: string | null;
  alt_en?: string | null;
  alt_vi?: string | null;
  rank?: number;
};

export type HeroBannerWorkflowInput = {
  id?: string;
  is_active?: boolean;
  /** Slide order in the hero carousel. */
  rank?: number;
  image_desktop_url: string;
  image_mobile_url?: string | null;
  title_en: string;
  title_vi: string;
  subtitle_en?: string | null;
  subtitle_vi?: string | null;
  cta_label_en?: string;
  cta_label_vi?: string;
  cta_href?: string;
  cta_variant?: string;
  text_color?: string;
  text_align?: string;
};

export type BestSellerWorkflowInput = {
  id?: string;
  is_active?: boolean;
  heading_en?: string;
  heading_vi?: string;
  description_en?: string | null;
  description_vi?: string | null;
  items: BestSellerItemInput[];
};

/** The design shows three cards; the admin is allowed to configure up to six. */
export const MAX_BEST_SELLER_ITEMS = 6;

type Snapshot = { id: string; is_active: boolean };

/* ── step: hero banner ───────────────────────────────────────────────────── */

export const upsertHeroBannerStep = createStep(
  'upsert-hero-banner-step',
  async (input: HeroBannerWorkflowInput, { container }) => {
    const service: any = container.resolve(HOMEPAGE_MODULE);

    // Snapshot the row being edited so the compensation can put it back.
    const existing: any[] = input.id ? await service.listHeroBanners({ id: input.id }) : [];
    const snapshot: Snapshot[] = existing.map((row: any) => ({
      id: row.id,
      is_active: row.is_active,
    }));

    const { id, ...fields } = input;
    const record = id ? await service.updateHeroBanners([{ id, ...fields }]) : await service.createHeroBanners(fields);

    const created = Array.isArray(record) ? record[0] : record;

    return new StepResponse(created, {
      createdId: id ? null : (created?.id ?? null),
      snapshot,
    });
  },
  async (compensation: { createdId: string | null; snapshot: Snapshot[] } | undefined, { container }) => {
    if (!compensation) return;
    const service: any = container.resolve(HOMEPAGE_MODULE);

    if (compensation.createdId) {
      await service.deleteHeroBanners(compensation.createdId);
    }
    if (compensation.snapshot.length) {
      await service.updateHeroBanners(compensation.snapshot);
    }
  },
);

export const upsertHeroBannerWorkflow = createWorkflow('upsert-hero-banner', (input: HeroBannerWorkflowInput) => {
  const hero = upsertHeroBannerStep(input);

  return new WorkflowResponse(hero);
});

/* ── step: best seller section ───────────────────────────────────────────── */

export const upsertBestSellerStep = createStep(
  'upsert-best-seller-step',
  async (input: BestSellerWorkflowInput, { container }) => {
    const service: any = container.resolve(HOMEPAGE_MODULE);

    const previouslyActive: any[] = await service.listBestSellerSections({
      is_active: true,
    });
    const snapshot: Snapshot[] = previouslyActive.map((row) => ({
      id: row.id,
      is_active: row.is_active,
    }));

    if (input.is_active !== false) {
      const toDeactivate = previouslyActive.filter((row) => row.id !== input.id);
      if (toDeactivate.length) {
        await service.updateBestSellerSections(toDeactivate.map((row) => ({ id: row.id, is_active: false })));
      }
    }

    // Normalise: fill missing ranks from the array order, sort, cap at the limit.
    const items = (input.items ?? [])
      .map((item, index) => ({
        ...item,
        rank: typeof item.rank === 'number' ? item.rank : index,
      }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, MAX_BEST_SELLER_ITEMS);

    const { id, ...fields } = input;
    const payload = { ...fields, items };

    const record = id
      ? await service.updateBestSellerSections([{ id, ...payload }])
      : await service.createBestSellerSections(payload);

    const created = Array.isArray(record) ? record[0] : record;

    return new StepResponse(created, {
      createdId: id ? null : (created?.id ?? null),
      snapshot,
    });
  },
  async (compensation: { createdId: string | null; snapshot: Snapshot[] } | undefined, { container }) => {
    if (!compensation) return;
    const service: any = container.resolve(HOMEPAGE_MODULE);

    if (compensation.createdId) {
      await service.deleteBestSellerSections(compensation.createdId);
    }
    if (compensation.snapshot.length) {
      await service.updateBestSellerSections(compensation.snapshot);
    }
  },
);

export const upsertBestSellerWorkflow = createWorkflow('upsert-best-seller', (input: BestSellerWorkflowInput) => {
  const section = upsertBestSellerStep(input);

  return new WorkflowResponse(section);
});
