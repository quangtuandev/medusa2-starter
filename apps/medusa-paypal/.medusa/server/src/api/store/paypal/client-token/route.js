"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const paypal_core_1 = require("@alphabite/medusa-paypal/providers/paypal/paypal-core");
const base = process.env.PAYPAL_SANDBOX === "true"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3BheXBhbC9jbGllbnQtdG9rZW4vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUZBQXNGO0FBU3RGLE1BQU0sSUFBSSxHQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxLQUFLLE1BQU07SUFDbkMsQ0FBQyxDQUFDLGtDQUFrQztJQUNwQyxDQUFDLENBQUMsMEJBQTBCLENBQUM7QUFFMUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUE4QyxFQUM5QyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbkQsWUFBWTtJQUNaLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLGlCQUFpQjtTQUNyRCxTQUFvQyxDQUFDO0lBRXhDLE1BQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FDMUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUN2QyxDQUFDO0lBRUYsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLDJCQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWhFLE1BQU0sV0FBVyxHQUFHLE1BQU0sYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRXpELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSw2QkFBNkIsRUFBRTtRQUNqRSxNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRTtZQUNQLGFBQWEsRUFBRSxVQUFVLFdBQVcsRUFBRTtZQUN0QyxpQkFBaUIsRUFBRSxPQUFPO1lBQzFCLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVuQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQztBQWxDVyxRQUFBLElBQUksUUFrQ2YifQ==