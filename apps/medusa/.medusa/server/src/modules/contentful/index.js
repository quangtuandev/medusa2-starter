"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENTFUL_MODULE = void 0;
const utils_1 = require("@medusajs/framework/utils");
const service_1 = require("./service");
const loaders_1 = require("./loaders");
exports.CONTENTFUL_MODULE = 'contentful';
exports.default = (0, utils_1.Module)(exports.CONTENTFUL_MODULE, {
    service: service_1.ContentfulService,
    loaders: [
        async (container) => {
            try {
                console.log('[Contentful] Initializing Contentful module...');
                // Initialize Contentful client
                const contentfulConfig = await (0, loaders_1.initializeContentful)(container);
                if (!contentfulConfig) {
                    console.warn('[Contentful] Not configured. Skipping initialization.');
                    return;
                }
                const { environment } = contentfulConfig;
                // Enable required locales
                console.log('[Contentful] Setting up locales...');
                await (0, loaders_1.enableLocales)(environment);
                // Create content types
                console.log('[Contentful] Creating content types...');
                await (0, loaders_1.createContentTypes)(environment);
                // Set environment on service for later use
                try {
                    const contentfulService = container.resolve?.(exports.CONTENTFUL_MODULE);
                    if (contentfulService && contentfulService.setEnvironment) {
                        contentfulService.setEnvironment(environment);
                    }
                }
                catch (e) {
                    console.warn('[Contentful] Could not set environment on service:', e.message);
                }
                console.log('[Contentful] Module initialized successfully');
            }
            catch (error) {
                console.error('[Contentful] Failed to initialize module:', error);
                // Don't throw - allow app to continue without Contentful
            }
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb250ZW50ZnVsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFtRDtBQUNuRCx1Q0FBOEM7QUFDOUMsdUNBQW9GO0FBRXZFLFFBQUEsaUJBQWlCLEdBQUcsWUFBWSxDQUFDO0FBRTlDLGtCQUFlLElBQUEsY0FBTSxFQUFDLHlCQUFpQixFQUFFO0lBQ3ZDLE9BQU8sRUFBRSwyQkFBaUI7SUFDMUIsT0FBTyxFQUFFO1FBQ1AsS0FBSyxFQUFFLFNBQWMsRUFBRSxFQUFFO1lBQ3ZCLElBQUksQ0FBQztnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7Z0JBRTlELCtCQUErQjtnQkFDL0IsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsOEJBQW9CLEVBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRS9ELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ3RFLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7Z0JBRXpDLDBCQUEwQjtnQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLElBQUEsdUJBQWEsRUFBQyxXQUFXLENBQUMsQ0FBQztnQkFFakMsdUJBQXVCO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sSUFBQSw0QkFBa0IsRUFBQyxXQUFXLENBQUMsQ0FBQztnQkFFdEMsMkNBQTJDO2dCQUMzQyxJQUFJLENBQUM7b0JBQ0gsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMseUJBQWlCLENBQVEsQ0FBQztvQkFDeEUsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDMUQsaUJBQWlCLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNoRCxDQUFDO2dCQUNILENBQUM7Z0JBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztvQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxFQUFHLENBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0YsQ0FBQztnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEUseURBQXlEO1lBQzNELENBQUM7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMifQ==