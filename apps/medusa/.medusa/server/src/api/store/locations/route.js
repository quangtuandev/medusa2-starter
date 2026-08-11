"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const GET = async (req, res) => {
    try {
        const query = req.scope.resolve("query");
        const regionModuleService = req.scope.resolve(utils_1.Modules.REGION);
        const [countries, countriesCount] = await regionModuleService.listAndCountCountries();
        const { data: locations, metadata: { count, take, skip } = {}, } = await query.graph({
            entity: "location",
            fields: [
                "id",
                "name",
                "iso_country_code",
                "address_lines",
                "options",
                "created_at",
                "updated_at",
            ],
        });
        const result = Object.values(locations.reduce((acc, cur) => {
            const key = cur.iso_country_code;
            if (!acc[key]) {
                acc[key] = {
                    id: cur.id,
                    iso_country_code: key,
                    items: []
                };
            }
            acc[key].items.push({
                name: cur.name,
                address_lines: cur.address_lines,
                options: cur.options
            });
            return acc;
        }, {}));
        const locationsMapping = result.map((location) => {
            return {
                ...location,
                country: countries.find((country) => country.iso_2 === location.iso_country_code.toLowerCase())?.display_name,
            };
        }).sort((a, b) => (a.country ?? '').localeCompare(b.country ?? ''));
        res.status(200).json({
            locations: locationsMapping
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch locations",
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2xvY2F0aW9ucy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxxREFBbUQ7QUFtQjVDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDcEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDckIsRUFBRTtJQUNBLElBQUksQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzdELE1BQU0sQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1FBRXJGLE1BQU0sRUFDRixJQUFJLEVBQUUsU0FBUyxFQUNmLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUN2QyxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNsQixNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUU7Z0JBQ0osSUFBSTtnQkFDSixNQUFNO2dCQUNOLGtCQUFrQjtnQkFDbEIsZUFBZTtnQkFDZixTQUFTO2dCQUNULFlBQVk7Z0JBQ1osWUFBWTthQUNmO1NBQ0osQ0FBQyxDQUFBO1FBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDdkIsU0FBNkIsQ0FBQyxNQUFNLENBQWtDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2hGLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztZQUVqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHO29CQUNQLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDVixnQkFBZ0IsRUFBRSxHQUFHO29CQUNyQixLQUFLLEVBQUUsRUFBRTtpQkFDWixDQUFDO1lBQ04sQ0FBQztZQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ2QsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhO2dCQUNoQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87YUFDdkIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ1QsQ0FBQztRQUVGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQzdDLE9BQU87Z0JBQ0gsR0FBRyxRQUFRO2dCQUNYLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLFlBQVk7YUFDaEgsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ25FLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLFNBQVMsRUFBRSxnQkFBZ0I7U0FDOUIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksMkJBQTJCO1NBQ3hELENBQUMsQ0FBQTtJQUNOLENBQUM7QUFDTCxDQUFDLENBQUE7QUE3RFksUUFBQSxHQUFHLE9BNkRmIn0=