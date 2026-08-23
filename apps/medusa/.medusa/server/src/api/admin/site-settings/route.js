"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const GET = async (req, res) => {
    try {
        const storeService = req.scope.resolve(utils_1.Modules.STORE);
        const [store] = await storeService.listStores();
        res.json({
            settings: store?.metadata || {},
            store: store ? { id: store.id, name: store.name } : null,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch site settings" });
    }
};
exports.GET = GET;
const POST = async (req, res) => {
    try {
        const storeService = req.scope.resolve(utils_1.Modules.STORE);
        const [store] = await storeService.listStores();
        if (!store) {
            res.status(404).json({ message: "Store not found" });
            return;
        }
        const currentMetadata = (store.metadata || {});
        const newMetadata = {
            ...currentMetadata,
            ...req.body,
        };
        const updatedStore = await storeService.updateStores(store.id, {
            metadata: newMetadata,
        });
        res.json({
            settings: updatedStore.metadata,
            message: "Site settings updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to update site settings" });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NpdGUtc2V0dGluZ3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQW1EO0FBRzVDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFzQixlQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBRS9DLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsSUFBSSxFQUFFO1lBQy9CLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUN6RCxDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLCtCQUErQixFQUFFLENBQUMsQ0FBQTtJQUNyRixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBZlksUUFBQSxHQUFHLE9BZWY7QUFFTSxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBc0IsZUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUUvQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUE7WUFDcEQsT0FBTTtRQUNSLENBQUM7UUFFRCxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUF3QixDQUFBO1FBQ3JFLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLEdBQUcsZUFBZTtZQUNsQixHQUFJLEdBQUcsQ0FBQyxJQUE0QjtTQUNyQyxDQUFBO1FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDN0QsUUFBUSxFQUFFLFdBQVc7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNQLFFBQVEsRUFBRSxZQUFZLENBQUMsUUFBUTtZQUMvQixPQUFPLEVBQUUsb0NBQW9DO1NBQzlDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksZ0NBQWdDLEVBQUUsQ0FBQyxDQUFBO0lBQ3RGLENBQUM7QUFDSCxDQUFDLENBQUE7QUE5QlksUUFBQSxJQUFJLFFBOEJoQiJ9