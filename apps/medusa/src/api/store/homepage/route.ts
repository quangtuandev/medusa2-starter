import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { HOMEPAGE_MODULE } from '../../../modules/homepage';

type Localizable = Record<string, any>;

/**
 * Adds the language-neutral fields (`title`, `subtitle`, `cta_label`, `heading`,
 * `description`, `alt`) next to the raw `_en` / `_vi` columns, so a client can
 * consume either shape.
 */
const localize = (record: Localizable | null, lang: string, fields: string[]) => {
  if (!record) return null;

  const suffix = lang.toLowerCase().startsWith('vi') ? 'vi' : 'en';
  const other = suffix === 'vi' ? 'en' : 'vi';
  const localized: Localizable = { ...record };

  for (const field of fields) {
    localized[field] = record[`${field}_${suffix}`] ?? record[`${field}_${other}`] ?? null;
  }

  return localized;
};

const readLanguage = (req: MedusaRequest) => {
  const fromQuery = typeof req.query?.lang === 'string' ? req.query.lang : null;
  if (fromQuery) return fromQuery;

  const header = req.headers['x-language'] || req.headers['accept-language'];
  if (typeof header === 'string' && header.toLowerCase().includes('vi')) {
    return 'vi';
  }

  return 'en';
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service: any = req.scope.resolve(HOMEPAGE_MODULE);
  const lang = readLanguage(req);

  const [heroRows, bestSellerRows] = await Promise.all([
    service.listHeroBanners({ is_active: true }, { order: { rank: 'ASC', created_at: 'ASC' } }),
    service.listBestSellerSections({ is_active: true }, { take: 1, order: { created_at: 'DESC' } }),
  ]);

  const hero_slides = (heroRows ?? []).map((row: any) => localize(row, lang, ['title', 'subtitle', 'cta_label']));

  const hero = hero_slides[0] ?? null;

  const bestSeller = localize(bestSellerRows?.[0] ?? null, lang, ['heading', 'description']);

  if (bestSeller) {
    const items = Array.isArray(bestSeller.items) ? bestSeller.items : [];
    bestSeller.items = items
      .map((item: any, index: number) => ({
        ...item,
        rank: typeof item.rank === 'number' ? item.rank : index,
        alt: item[`alt_${lang.startsWith('vi') ? 'vi' : 'en'}`] ?? item.alt ?? null,
      }))
      .sort((a: any, b: any) => a.rank - b.rank);
  }

  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json({ hero, hero_slides, best_seller: bestSeller, language: lang });
};
