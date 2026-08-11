"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data } = await query.graph({
        entity: "product_content",
        fields: [
            "id",
            "product_id",
            "notes",
            "ingredients",
            "precautions_of_use",
            "application_tips",
        ],
        filters: { product_id: req.params.id },
    }, { locale: req.locale });
    if (!data[0]) {
        return res.status(404).json({ message: "Product content not found" });
    }
    return res.json({ product_content: data[0] });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3RzL1tpZF0vY29udGVudC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFRLENBQUE7SUFDL0MsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FDaEM7UUFDRSxNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE1BQU0sRUFBRTtZQUNOLElBQUk7WUFDSixZQUFZO1lBQ1osT0FBTztZQUNQLGFBQWE7WUFDYixvQkFBb0I7WUFDcEIsa0JBQWtCO1NBQ25CO1FBQ0QsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO0tBQ3ZDLEVBQ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUN2QixDQUFBO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUE7SUFDdkUsQ0FBQztJQUVELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQy9DLENBQUMsQ0FBQTtBQXZCWSxRQUFBLEdBQUcsT0F1QmYifQ==