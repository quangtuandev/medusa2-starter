"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeContentfulModule = initializeContentfulModule;
const loaders_1 = require("./loaders");
/**
 * Initialize Contentful integration
 * This should be called when the module is loaded
 */
async function initializeContentfulModule(container) {
    try {
        // Initialize Contentful client
        const contentfulConfig = await (0, loaders_1.initializeContentful)(container);
        if (!contentfulConfig) {
            console.warn('[Contentful] Not configured. Skipping initialization.');
            return;
        }
        const { environment } = contentfulConfig;
        // Enable required locales
        console.info('[Contentful] Setting up locales...');
        await (0, loaders_1.enableLocales)(environment);
        // Create content types
        console.info('[Contentful] Creating content types...');
        await (0, loaders_1.createContentTypes)(environment);
        // Set environment on service for later use
        const contentfulService = container.resolve('contentfulService');
        contentfulService.setEnvironment(environment);
        console.info('[Contentful] Module initialized successfully');
    }
    catch (error) {
        console.error('[Contentful] Failed to initialize module:', error);
        // Don't throw - allow app to continue without Contentful
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbnRlbnRmdWwvaW5pdGlhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLGdFQStCQztBQXRDRCx1Q0FBb0Y7QUFHcEY7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLDBCQUEwQixDQUM5QyxTQUEwQjtJQUUxQixJQUFJLENBQUM7UUFDSCwrQkFBK0I7UUFDL0IsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsOEJBQW9CLEVBQUMsU0FBUyxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQ3RFLE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLGdCQUFnQixDQUFDO1FBRXpDLDBCQUEwQjtRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxJQUFBLHVCQUFhLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFFakMsdUJBQXVCO1FBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN2RCxNQUFNLElBQUEsNEJBQWtCLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsMkNBQTJDO1FBQzNDLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBc0IsQ0FBQztRQUN0RixpQkFBaUIsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUMsT0FBTyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSx5REFBeUQ7SUFDM0QsQ0FBQztBQUNILENBQUMifQ==