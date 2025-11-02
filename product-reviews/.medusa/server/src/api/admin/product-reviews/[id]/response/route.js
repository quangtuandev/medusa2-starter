"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.POST = exports.fetchReviewWithResponse = exports.fetchReviewResponse = void 0;
const utils_1 = require("@medusajs/framework/utils");
const create_product_review_responses_1 = require("../../../../../workflows/create-product-review-responses");
const update_product_review_responses_1 = require("../../../../../workflows/update-product-review-responses");
const delete_product_review_responses_1 = require("../../../../../workflows/delete-product-review-responses");
const fetchReviewResponse = async (container, filter) => {
    const remoteQuery = container.resolve('remoteQuery');
    const query = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: 'product_review_response',
        fields: ['*'],
        variables: {
            ...filter,
        },
    });
    const queryResult = await remoteQuery(query);
    return queryResult[0];
};
exports.fetchReviewResponse = fetchReviewResponse;
const fetchReviewWithResponse = async (container, id) => {
    const remoteQuery = container.resolve('remoteQuery');
    const query = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: 'product_review',
        fields: ['*', 'response.*'],
        variables: { id },
    });
    const queryResult = await remoteQuery(query);
    return queryResult[0];
};
exports.fetchReviewWithResponse = fetchReviewWithResponse;
const POST = async (req, res) => {
    const product_review_id = req.params.id;
    const { result } = await (0, create_product_review_responses_1.createProductReviewResponsesWorkflow)(req.scope).run({
        input: {
            responses: [
                {
                    product_review_id,
                    content: req.validatedBody.content,
                },
            ],
        },
    });
    const product_review_response = await (0, exports.fetchReviewResponse)(req.scope, { id: result[0].id });
    res.status(200).json({ product_review_response });
};
exports.POST = POST;
const PUT = async (req, res) => {
    const product_review_id = req.params.id;
    const review = await (0, exports.fetchReviewWithResponse)(req.scope, product_review_id);
    if (!review.response)
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, 'Product review response not found');
    const { result } = await (0, update_product_review_responses_1.updateProductReviewResponsesWorkflow)(req.scope).run({
        input: {
            responses: [
                {
                    id: review.response.id,
                    content: req.validatedBody.content,
                },
            ],
        },
    });
    const product_review_response = await (0, exports.fetchReviewResponse)(req.scope, { id: result[0].id });
    res.status(200).json({ product_review_response });
};
exports.PUT = PUT;
const DELETE = async (req, res) => {
    const product_review_id = req.params.id;
    const reviewResponse = await (0, exports.fetchReviewResponse)(req.scope, { product_review_id });
    if (!reviewResponse)
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, 'Product review response not found');
    await (0, delete_product_review_responses_1.deleteProductReviewResponsesWorkflow)(req.scope).run({
        input: {
            ids: [reviewResponse.id],
        },
    });
    res.status(200).json({ message: 'Product review response deleted' });
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3cy9baWRdL3Jlc3BvbnNlL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFxRjtBQUNyRiw4R0FBZ0g7QUFFaEgsOEdBQWdIO0FBQ2hILDhHQUFnSDtBQUd6RyxNQUFNLG1CQUFtQixHQUFHLEtBQUssRUFDdEMsU0FBMEIsRUFDMUIsTUFBc0QsRUFDdEQsRUFBRTtJQUNGLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFckQsTUFBTSxLQUFLLEdBQUcsSUFBQSxtQ0FBMkIsRUFBQztRQUN4QyxVQUFVLEVBQUUseUJBQXlCO1FBQ3JDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNiLFNBQVMsRUFBRTtZQUNULEdBQUcsTUFBTTtTQUNWO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFN0MsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUEwQixDQUFDO0FBQ2pELENBQUMsQ0FBQztBQWpCVyxRQUFBLG1CQUFtQix1QkFpQjlCO0FBRUssTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQUUsU0FBMEIsRUFBRSxFQUFVLEVBQUUsRUFBRTtJQUN0RixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXJELE1BQU0sS0FBSyxHQUFHLElBQUEsbUNBQTJCLEVBQUM7UUFDeEMsVUFBVSxFQUFFLGdCQUFnQjtRQUM1QixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDO1FBQzNCLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNsQixDQUFDLENBQUM7SUFFSCxNQUFNLFdBQVcsR0FBRyxNQUFNLFdBQVcsQ0FB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