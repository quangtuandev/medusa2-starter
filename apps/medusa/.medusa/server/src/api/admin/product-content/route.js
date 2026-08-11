"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const product_content_1 = require("../../../modules/product-content");
const input_1 = require("../../../modules/product-content/input");
const GET = async (req, res) => {
    const productId = String(req.query.product_id ?? "").trim();
    if (!productId) {
        return res.status(400).json({ message: "product_id is required" });
    }
    const service = req.scope.resolve(product_content_1.PRODUCT_CONTENT_MODULE);
    const [items] = await service.listAndCountProductContents({ product_id: productId });
    return res.json({ product_content: items[0] ?? null });
};
exports.GET = GET;
const POST = async (req, res) => {
    let input;
    try {
        input = (0, input_1.normalizeProductContentInput)(req.body);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Invalid product content",
        });
    }
    const productService = req.scope.resolve(utils_1.Modules.PRODUCT);
    try {
        await productService.retrieveProduct(input.product_id);
    }
    catch {
        return res.status(404).json({ message: "Product not found" });
    }
    const service = req.scope.resolve(product_content_1.PRODUCT_CONTENT_MODULE);
    const [existing] = await service.listAndCountProductContents({
        product_id: input.product_id,
    });
    const productContent = existing[0]
        ? await service.updateProductContents({ id: existing[0].id, ...input })
        : await service.createProductContents(input);
    return res.json({ product_content: productContent });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtY29udGVudC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBbUQ7QUFDbkQsc0VBQXlFO0FBQ3pFLGtFQUcrQztBQUV4QyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBRTNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNmLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFBO0lBQ3BFLENBQUM7SUFFRCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx3Q0FBc0IsQ0FBUSxDQUFBO0lBQ2hFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBRXBGLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN4RCxDQUFDLENBQUE7QUFYWSxRQUFBLEdBQUcsT0FXZjtBQUVNLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBdUMsRUFDdkMsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksS0FBSyxDQUFBO0lBRVQsSUFBSSxDQUFDO1FBQ0gsS0FBSyxHQUFHLElBQUEsb0NBQTRCLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMseUJBQXlCO1NBQzVFLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFRLENBQUE7SUFDaEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUE7SUFDL0QsQ0FBQztJQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHdDQUFzQixDQUFRLENBQUE7SUFDaEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLDJCQUEyQixDQUFDO1FBQzNELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtLQUM3QixDQUFDLENBQUE7SUFFRixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUM7UUFDdkUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTlDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO0FBQ3RELENBQUMsQ0FBQTtBQS9CWSxRQUFBLElBQUksUUErQmhCIn0=