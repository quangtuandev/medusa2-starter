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
        // Group by country, then by business name within each country
        const byCountry = {};
        for (const cur of locations) {
            const countryKey = cur.iso_country_code;
            if (!byCountry[countryKey]) {
                byCountry[countryKey] = {
                    id: cur.id,
                    iso_country_code: countryKey,
                    items: {},
                };
            }
            const nameKey = cur.name || '';
            if (!byCountry[countryKey].items[nameKey]) {
                byCountry[countryKey].items[nameKey] = {
                    name: cur.name,
                    branches: [],
                };
            }
            byCountry[countryKey].items[nameKey].branches.push({
                address_lines: cur.address_lines,
                options: cur.options || [],
            });
        }
        // Convert the nested objects to arrays
        const result = Object.values(byCountry).map((group) => ({
            ...group,
            items: Object.values(group.items),
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2xvY2F0aW9ucy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxxREFBbUQ7QUFDNUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUNwQixHQUFrQixFQUNsQixHQUFtQixFQUNyQixFQUFFO0lBQ0EsSUFBSSxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEMsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0QsTUFBTSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsR0FBRyxNQUFNLG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLENBQUE7UUFFckYsTUFBTSxFQUNGLElBQUksRUFBRSxTQUFTLEVBQ2YsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQ3ZDLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRTtnQkFDSixJQUFJO2dCQUNKLE1BQU07Z0JBQ04sa0JBQWtCO2dCQUNsQixlQUFlO2dCQUNmLFNBQVM7Z0JBQ1QsWUFBWTtnQkFDWixZQUFZO2FBQ2Y7U0FDSixDQUFDLENBQUE7UUFFRiw4REFBOEQ7UUFDOUQsTUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQTtRQUV6QyxLQUFLLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzFCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQTtZQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRztvQkFDcEIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUNWLGdCQUFnQixFQUFFLFVBQVU7b0JBQzVCLEtBQUssRUFBRSxFQUFFO2lCQUNaLENBQUE7WUFDTCxDQUFDO1lBRUQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDeEMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRztvQkFDbkMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO29CQUNkLFFBQVEsRUFBRSxFQUFFO2lCQUNmLENBQUE7WUFDTCxDQUFDO1lBRUQsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUMvQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWE7Z0JBQ2hDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUVELHVDQUF1QztRQUN2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RCxHQUFHLEtBQUs7WUFDUixLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQ3BDLENBQUMsQ0FBQyxDQUFBO1FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7WUFDbEQsT0FBTztnQkFDSCxHQUFHLFFBQVE7Z0JBQ1gsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsWUFBWTthQUNoSCxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDbkUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsU0FBUyxFQUFFLGdCQUFnQjtTQUM5QixDQUFDLENBQUE7SUFDTixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSwyQkFBMkI7U0FDeEQsQ0FBQyxDQUFBO0lBQ04sQ0FBQztBQUNMLENBQUMsQ0FBQTtBQXhFWSxRQUFBLEdBQUcsT0F3RWYifQ==