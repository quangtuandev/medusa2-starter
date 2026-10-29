"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertBestSellerWorkflow = exports.upsertBestSellerStep = exports.upsertHeroBannerWorkflow = exports.upsertHeroBannerStep = exports.MAX_BEST_SELLER_ITEMS = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const homepage_1 = require("../modules/homepage");
/** The design shows three cards; the admin is allowed to configure up to six. */
exports.MAX_BEST_SELLER_ITEMS = 6;
/* ── step: hero banner ───────────────────────────────────────────────────── */
exports.upsertHeroBannerStep = (0, workflows_sdk_1.createStep)('upsert-hero-banner-step', async (input, { container }) => {
    const service = container.resolve(homepage_1.HOMEPAGE_MODULE);
    // Snapshot the row being edited so the compensation can put it back.
    const existing = input.id ? await service.listHeroBanners({ id: input.id }) : [];
    const snapshot = existing.map((row) => ({
        id: row.id,
        is_active: row.is_active,
    }));
    const { id, ...fields } = input;
    const record = id ? await service.updateHeroBanners([{ id, ...fields }]) : await service.createHeroBanners(fields);
    const created = Array.isArray(record) ? record[0] : record;
    return new workflows_sdk_1.StepResponse(created, {
        createdId: id ? null : (created?.id ?? null),
        snapshot,
    });
}, async (compensation, { container }) => {
    if (!compensation)
        return;
    const service = container.resolve(homepage_1.HOMEPAGE_MODULE);
    if (compensation.createdId) {
        await service.deleteHeroBanners(compensation.createdId);
    }
    if (compensation.snapshot.length) {
        await service.updateHeroBanners(compensation.snapshot);
    }
});
exports.upsertHeroBannerWorkflow = (0, workflows_sdk_1.createWorkflow)('upsert-hero-banner', (input) => {
    const hero = (0, exports.upsertHeroBannerStep)(input);
    return new workflows_sdk_1.WorkflowResponse(hero);
});
/* ── step: best seller section ───────────────────────────────────────────── */
exports.upsertBestSellerStep = (0, workflows_sdk_1.createStep)('upsert-best-seller-step', async (input, { container }) => {
    const service = container.resolve(homepage_1.HOMEPAGE_MODULE);
    const previouslyActive = await service.listBestSellerSections({
        is_active: true,
    });
    const snapshot = previouslyActive.map((row) => ({
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
        .slice(0, exports.MAX_BEST_SELLER_ITEMS);
    const { id, ...fields } = input;
    const payload = { ...fields, items };
    const record = id
        ? await service.updateBestSellerSections([{ id, ...payload }])
        : await service.createBestSellerSections(payload);
    const created = Array.isArray(record) ? record[0] : record;
    return new workflows_sdk_1.StepResponse(created, {
        createdId: id ? null : (created?.id ?? null),
        snapshot,
    });
}, async (compensation, { container }) => {
    if (!compensation)
        return;
    const service = container.resolve(homepage_1.HOMEPAGE_MODULE);
    if (compensation.createdId) {
        await service.deleteBestSellerSections(compensation.createdId);
    }
    if (compensation.snapshot.length) {
        await service.updateBestSellerSections(compensation.snapshot);
    }
});
exports.upsertBestSellerWorkflow = (0, workflows_sdk_1.createWorkflow)('upsert-best-seller', (input) => {
    const section = (0, exports.upsertBestSellerStep)(input);
    return new workflows_sdk_1.WorkflowResponse(section);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBzZXJ0LWhvbWVwYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy91cHNlcnQtaG9tZXBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQStHO0FBQy9HLGtEQUFzRDtBQXlDdEQsaUZBQWlGO0FBQ3BFLFFBQUEscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBSXZDLGdGQUFnRjtBQUVuRSxRQUFBLG9CQUFvQixHQUFHLElBQUEsMEJBQVUsRUFDNUMseUJBQXlCLEVBQ3pCLEtBQUssRUFBRSxLQUE4QixFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN0RCxNQUFNLE9BQU8sR0FBUSxTQUFTLENBQUMsT0FBTyxDQUFDLDBCQUFlLENBQUMsQ0FBQztJQUV4RCxxRUFBcUU7SUFDckUsTUFBTSxRQUFRLEdBQVUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDeEYsTUFBTSxRQUFRLEdBQWUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDVixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7S0FDekIsQ0FBQyxDQUFDLENBQUM7SUFFSixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsaUJBQWlCLENBQUMs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