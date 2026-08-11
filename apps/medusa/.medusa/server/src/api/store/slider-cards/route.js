"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const product_slider_1 = require("../../../modules/product-slider");
const GET = async (req, res) => {
    const service = req.scope.resolve(product_slider_1.PRODUCT_SLIDER_MODULE);
    const [cards, count] = await service.listAndCountSliderCards({}, { order: { rank: "ASC" } });
    res.json({
        slider_cards: cards,
        count,
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NsaWRlci1jYXJkcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxvRUFBdUU7QUFFaEUsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxPQUFPLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsc0NBQXFCLENBQUMsQ0FBQTtJQUM3RCxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLHVCQUF1QixDQUMxRCxFQUFFLEVBQ0YsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDM0IsQ0FBQTtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxZQUFZLEVBQUUsS0FBSztRQUNuQixLQUFLO0tBQ04sQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZFksUUFBQSxHQUFHLE9BY2YifQ==