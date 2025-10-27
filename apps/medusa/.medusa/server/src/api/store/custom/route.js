"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/utils");
async function GET(req, res) {
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    // const orderService = req.scope.resolve(
    //   ContainerRegistrationKeys.ORDER_SERVICE
    // );
    //test
    res.json({ message: 'Hello' });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtCQVFDO0FBVkQsMkNBQTREO0FBRXJELEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSwwQ0FBMEM7SUFDMUMsNENBQTRDO0lBQzVDLEtBQUs7SUFDTCxNQUFNO0lBRU4sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUMifQ==