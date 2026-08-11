"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupProductLocales;
const utils_1 = require("@medusajs/framework/utils");
const locales_1 = require("../modules/product-content/locales");
async function setupProductLocales({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const storeService = container.resolve(utils_1.Modules.STORE);
    const [store] = await storeService.listStores();
    if (!store) {
        throw new Error("Store not found");
    }
    await storeService.updateStores(store.id, {
        supported_locales: locales_1.PRODUCT_LOCALES.map((locale_code) => ({ locale_code })),
    });
    logger.info(`Configured product locales: ${locales_1.PRODUCT_LOCALES.join(", ")}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvZHVjdC1sb2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2V0dXAtcHJvZHVjdC1sb2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsc0NBY0M7QUFqQkQscURBQThFO0FBQzlFLGdFQUFvRTtBQUVyRCxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDdkUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFzQixlQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDMUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBRS9DLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsTUFBTSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7UUFDeEMsaUJBQWlCLEVBQUUseUJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0tBQzNFLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLHlCQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUMxRSxDQUFDIn0=