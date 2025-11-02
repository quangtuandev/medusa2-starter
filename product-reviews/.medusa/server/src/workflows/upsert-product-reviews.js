"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProductReviewsWorkflow = void 0;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const create_product_reviews_1 = require("./create-product-reviews");
const update_product_reviews_1 = require("./update-product-reviews");
exports.upsertProductReviewsWorkflow = (0, workflows_sdk_2.createWorkflow)('upsert-product-reviews-workflow', (input) => {
    const orderIds = (0, workflows_sdk_1.transform)({ input }, ({ input }) => {
        return [...new Set(input.reviews.map((review) => review.order_id))];
    });
    const { data: orders } = (0, core_flows_1.useQueryGraphStep)({
        entity: 'order',
        fields: ['*', 'shipping_address.*', 'customer.*', 'items.*', 'items.product_review.*'],
        filters: {
            id: orderIds,
        },
    });
    const inputs = (0, workflows_sdk_1.transform)({ orders, reviews: input.reviews }, (values) => {
        const ordersMap = new Map(values.orders.map((order) => [order.id, order]));
        const matchedReviews = values.reviews.map((review) => {
            const { items, ...order } = ordersMap.get(review.order_id) || {};
            const lineItem = items?.find((item) => item?.id === review.order_line_item_id);
            if (!lineItem) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Order line item ${review.order_line_item_id} not found in order ${review.order_id}`);
            }
            return { review, lineItem: lineItem, order };
        });
        const getNameFromOrder = (order) => {
            return order.customer?.first_name
                ? `${order.customer.first_name} ${order.customer.last_name}`
                : order.shipping_address?.first_name
                    ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`
                    : undefined;
        };
        const create = matchedReviews
            .filter((review) => !review.lineItem.product_review)
            .map(({ review, lineItem, order }) => {
            return {
                email: order.email,
                name: getNameFromOrder(order),
                product_id: lineItem.product_id,
                order_id: review.order_id,
                order_line_item_id: review.order_line_item_id,
                rating: review.rating,
                content: review.content,
                images: review.images,
            };
        });
        const update = matchedReviews
            .filter((review) => review.lineItem.product_review?.id)
            .map(({ review, lineItem }) => {
            return {
                id: lineItem.product_review.id,
                rating: review.rating,
                content: review.content,
                images: review.images,
            };
        });
        return { create, update };
    });
    const createResult = (0, workflows_sdk_2.when)(inputs, ({ create }) => create.length > 0).then(() => create_product_reviews_1.createProductReviewsWorkflow.runAsStep({ input: { productReviews: inputs.create } }));
    const updateResult = (0, workflows_sdk_2.when)(inputs, ({ update }) => update.length > 0).then(() => update_product_reviews_1.updateProductReviewsWorkflow.runAsStep({ input: { productReviews: inputs.update } }));
    const results = (0, workflows_sdk_1.transform)({ createResult, updateResult }, ({ createResult, updateResult }) => ({ creates: createResult || [], updates: updateResult || [] }));
    return new workflows_sdk_2.WorkflowResponse(results);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBzZXJ0LXByb2R1Y3QtcmV2aWV3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvdXBzZXJ0LXByb2R1Y3QtcmV2aWV3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBd0Q7QUFDeEQscUVBQThEO0FBQzlELDREQUFnRTtBQUNoRSwyREFBK0Y7QUFDL0YscUVBQXdFO0FBQ3hFLHFFQUF3RTtBQWMzRCxRQUFBLDRCQUE0QixHQUFHLElBQUEsOEJBQWMsRUFDeEQsaUNBQWlDLEVBQ2pDLENBQUMsS0FBc0QsRUFBRSxFQUFFO0lBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUEseUJBQVMsRUFBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLDhCQUFpQixFQUFDO1FBQ3pDLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsd0JBQXdCLENBQUM7UUFDdEYsT0FBTyxFQUFFO1lBQ1AsRUFBRSxFQUFFLFFBQVE7U0FDYjtLQUNGLENBQWlDLENBQUM7SUFFbkMsTUFBTSxNQUFNLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUN0RSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENB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