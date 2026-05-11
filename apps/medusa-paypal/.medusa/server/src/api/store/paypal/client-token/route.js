"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const paypal_core_1 = require("@alphabite/medusa-paypal/providers/paypal/paypal-core");
const base = process.env.PAYPAL_IS_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
const POST = async (req, res) => {
    const paymentModule = req.scope.resolve("payment");
    //@ts-ignore
    const paymentProviders = paymentModule.moduleDeclaration
        .providers;
    const paypalProvider = paymentProviders.find((provider) => provider.id === "paypal");
    if (!paypalProvider) {
        return res.status(404).json({ error: "Paypal provider not found" });
    }
    const paypalService = new paypal_core_1.PaypalService(paypalProvider.options);
    const accessToken = await paypalService.getAccessToken();
    const response = await fetch(`${base}/v1/identity/generate-token`, {
        method: "post",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return res.status(201).json({ client_token: data.client_token });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3BheXBhbC9jbGllbnQtdG9rZW4vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUZBQXNGO0FBU3RGLE1BQU0sSUFBSSxHQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEtBQUssTUFBTTtJQUN0QyxDQUFDLENBQUMsa0NBQWtDO0lBQ3BDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQztBQUUxQixNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQThDLEVBQzlDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVuRCxZQUFZO0lBQ1osTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsaUJBQWlCO1NBQ3JELFNBQW9DLENBQUM7SUFFeEMsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUMxQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQ3ZDLENBQUM7SUFFRixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHLElBQUksMkJBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFaEUsTUFBTSxXQUFXLEdBQUcsTUFBTSxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFekQsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLDZCQUE2QixFQUFFO1FBQ2pFLE1BQU0sRUFBRSxNQUFNO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsYUFBYSxFQUFFLFVBQVUsV0FBVyxFQUFFO1lBQ3RDLGlCQUFpQixFQUFFLE9BQU87WUFDMUIsY0FBYyxFQUFFLGtCQUFrQjtTQUNuQztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBRW5DLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDO0FBbENXLFFBQUEsSUFBSSxRQWtDZiJ9