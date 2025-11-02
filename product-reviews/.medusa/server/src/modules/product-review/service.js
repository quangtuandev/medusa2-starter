"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modduleOptionsSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const models_1 = require("./models");
const zod_1 = require("zod");
exports.modduleOptionsSchema = zod_1.z.object({
    defaultReviewStatus: zod_1.z.enum(['pending', 'approved', 'flagged']).default('approved'),
}).default({
    defaultReviewStatus: 'approved',
});
class ProductReviewService extends (0, utils_1.MedusaService)({
    ProductReview: models_1.ProductReviewModel,
    ProductReviewImage: models_1.ProductReviewImageModel,
    ProductReviewResponse: models_1.ProductReviewResponseModel,
    ProductReviewStats: models_1.ProductReviewStatsModel,
}) {
    constructor(container, options) {
        super(container, options);
        const { defaultReviewStatus } = exports.modduleOptionsSchema.parse(options);
        this.defaultReviewStatus = defaultReviewStatus;
    }
    async refreshProductReviewStats(productIds, sharedContext) {
        const foundStats = await this.listProductReviewStats({ product_id: productIds }, {});
        const calculatedStats = await this.calculateProductReviewStats(foundStats.map((s) => s.product_id), sharedContext);
        const toUpdate = foundStats.map((s) => ({
            ...s,
            ...calculatedStats.find((c) => c.product_id === s.product_id),
        }));
        const upsertedStats = await this.updateProductReviewStats(toUpdate);
        return upsertedStats;
    }
    async calculateProductReviewStats(productIds, sharedContext) {
        const SQL = `SELECT 
    product_id,
    COUNT(*) AS review_count, 
    CAST(AVG(rating) AS DECIMAL(10, 2)) AS average_rating,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS rating_count_1,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS rating_count_2,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS rating_count_3,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS rating_count_4,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS rating_count_5
    FROM product_review WHERE product_id IN (${productIds.map((id) => `'${id}'`).join(', ')}) GROUP BY product_id`;
        const productReviewStats = await sharedContext.manager.execute(SQL);
        return productReviewStats.map((s) => ({
            ...s,
            average_rating: parseFloat(s.average_rating),
        }));
    }
}
__decorate([
    (0, utils_1.InjectManager)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductReviewService.prototype, "calculateProductReviewStats", null);
exports.default = ProductReviewService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtcmV2aWV3L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscURBQXdGO0FBR3hGLHFDQUtrQjtBQUVsQiw2QkFBd0I7QUFhWCxRQUFBLG9CQUFvQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDM0MsbUJBQW1CLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0NBQ3BGLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDVCxtQkFBbUIsRUFBRSxVQUFVO0NBQ2hDLENBQUMsQ0FBQztBQUlILE1BQU0sb0JBQXFCLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQy9DLGFBQWEsRUFBRSwyQkFBa0I7SUFDakMsa0JBQWtCLEVBQUUsZ0NBQXVCO0lBQzNDLHFCQUFxQixFQUFFLG1DQUEwQjtJQUNqRCxrQkFBa0IsRUFBRSxnQ0FBdUI7Q0FDNUMsQ0FBQztJQUdBLFlBQVksU0FBUyxFQUFFLE9BQXNCO1FBQzNDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUIsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsNEJBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztJQUNqRCxDQUFDO0lBRUQsS0FBSyxDQUFDLHlCQUF5QixDQUFDLFVBQW9CLEVBQUUsYUFBdUI7UUFDM0UsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFckYsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsMkJBQTJCLENBQzVELFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFDbkMsYUFBYSxDQUNkLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQztZQUNKLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDO1NBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUosTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEUsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUdLLEFBQU4sS0FBSyxDQUFDLDJCQUEyQixDQUMvQixVQUFvQixFQUNILGFBQWtFO1FBRW5GLE1BQU0sR0FBRyxHQUFHOzs7Ozs7Ozs7K0NBUytCLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBRS9HLE1BQU0sa0JBQWtCLEdBQ3RCLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBV2pDLEdBQUcsQ0FBQyxDQUFDO1FBRVQsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEMsR0FBRyxDQUFDO1lBQ0osY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNGO0FBbENPO0lBREwsSUFBQSxxQkFBYSxHQUFFO0lBR2IsV0FBQSxJQUFBLHFCQUFhLEdBQUUsQ0FBQTs7Ozt1RUErQmpCO0FBR0gsa0JBQWUsb0JBQW9CLENBQUMifQ==