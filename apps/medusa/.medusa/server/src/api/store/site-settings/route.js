"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const GET = async (req, res) => {
    try {
        const storeService = req.scope.resolve(utils_1.Modules.STORE);
        const [store] = await storeService.listStores();
        res.json({
            settings: store?.metadata || {},
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch site settings" });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NpdGUtc2V0dGluZ3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQW1EO0FBRzVDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFzQixlQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBRS9DLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsSUFBSSxFQUFFO1NBQ2hDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksK0JBQStCLEVBQUUsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLEdBQUcsT0FjZiJ9