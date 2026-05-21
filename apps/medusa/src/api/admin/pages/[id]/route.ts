import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { PAGE_MODULE } from '../../../../modules/page';

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pageModuleService: any = req.scope.resolve(PAGE_MODULE);
    const { id } = req.params;

    const page = await pageModuleService.retrievePage(id);
    if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
    }

    res.json(page);
}

export async function PUT(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pageModuleService: any = req.scope.resolve(PAGE_MODULE);
    const { id } = req.params;

    const page = await pageModuleService.updatePages([{ id, ...(req.body as any) }]);
    if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
    }

    res.json(page);
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pageModuleService: any = req.scope.resolve(PAGE_MODULE);
    const { id } = req.params;

    const success = await pageModuleService.deletePages(id);
    if (!success) {
        res.status(404).json({ error: 'Page not found' });
        return;
    }

    res.status(204).send();
}
