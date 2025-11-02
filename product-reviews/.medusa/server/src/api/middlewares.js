"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const middlewares_1 = require("./admin/product-reviews/middlewares");
const middlewares_2 = require("./admin/product-review-stats/middlewares");
const middlewares_3 = require("./store/product-reviews/middlewares");
const middlewares_4 = require("./admin/product-reviews/[id]/response/middlewares");
const middlewares_5 = require("./store/product-reviews/uploads/middlewares");
const middlewares_6 = require("./store/product-review-stats/middlewares");
const middlewares_7 = require("./admin/product-reviews/[id]/status/middlewares");
exports.default = (0, medusa_1.defineMiddlewares)({
    routes: [
        ...middlewares_1.adminProductReviewRoutesMiddlewares,
        ...middlewares_2.adminProductReviewStatRoutesMiddlewares,
        ...middlewares_4.adminProductReviewResponseRouteMiddlewares,
        ...middlewares_7.adminProductReviewStatusRoutesMiddlewares,
        // Store
        ...middlewares_5.storeProductReviewUploadsMiddlewares,
        ...middlewares_3.storeProductReviewRoutesMiddlewares,
        ...middlewares_6.storeProductReviewStatRoutesMiddlewares,
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXFEO0FBQ3JELHFFQUEwRjtBQUMxRiwwRUFBbUc7QUFDbkcscUVBQTBGO0FBQzFGLG1GQUErRztBQUMvRyw2RUFBbUc7QUFDbkcsMEVBQW1HO0FBQ25HLGlGQUE0RztBQUU1RyxrQkFBZSxJQUFBLDBCQUFpQixFQUFDO0lBQy9CLE1BQU0sRUFBRTtRQUNOLEdBQUcsaURBQW1DO1FBQ3RDLEdBQUcscURBQXVDO1FBQzFDLEdBQUcsd0RBQTBDO1FBQzdDLEdBQUcsdURBQXlDO1FBRTVDLFFBQVE7UUFDUixHQUFHLGtEQUFvQztRQUN2QyxHQUFHLGlEQUFtQztRQUN0QyxHQUFHLHFEQUF1QztLQUMzQztDQUNGLENBQUMsQ0FBQyJ9