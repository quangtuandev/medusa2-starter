"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const popup_1 = require("../../../modules/popup");
const GET = async (req, res) => {
    const service = req.scope.resolve(popup_1.POPUP_MODULE);
    const popups = await service.listPopups({ is_active: true }, { order: { created_at: "DESC" } });
    res.json({
        popups: popups || [],
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3BvcHVwcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxrREFBcUQ7QUFFOUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxPQUFPLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsb0JBQVksQ0FBQyxDQUFBO0lBQ3BELE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FDckMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQ25CLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQ2xDLENBQUE7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsTUFBTSxFQUFFLE1BQU0sSUFBSSxFQUFFO0tBQ3JCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQWJZLFFBQUEsR0FBRyxPQWFmIn0=