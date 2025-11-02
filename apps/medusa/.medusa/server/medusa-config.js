"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
const REDIS_URL = process.env.REDIS_URL;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const IS_TEST = process.env.NODE_ENV === 'test';
const cacheModule = IS_TEST
    ? { resolve: '@medusajs/medusa/cache-inmemory' }
    : {
        resolve: '@medusajs/medusa/cache-redis',
        options: {
            redisUrl: REDIS_URL,
        },
    };
const eventBusModule = IS_TEST
    ? { resolve: '@medusajs/medusa/event-bus-local' }
    : {
        resolve: '@medusajs/medusa/event-bus-redis',
        options: {
            redisUrl: REDIS_URL,
        },
    };
const workflowEngineModule = IS_TEST
    ? { resolve: '@medusajs/medusa/workflow-engine-inmemory' }
    : {
        resolve: '@medusajs/medusa/workflow-engine-redis',
        options: {
            redis: {
                url: REDIS_URL,
            },
        },
    };
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        databaseDriverOptions: {
            ssl: false,
        },
        redisUrl: REDIS_URL,
        redisPrefix: process.env.REDIS_PREFIX,
        http: {
            storeCors: process.env.STORE_CORS || '',
            adminCors: process.env.ADMIN_CORS || '',
            authCors: process.env.AUTH_CORS || '',
            jwtSecret: process.env.JWT_SECRET || 'supersecret',
            cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
        },
    },
    plugins: [
        {
            resolve: "@alphabite/medusa-paypal",
            options: {
                clientId: process.env.PAYPAL_CLIENT_ID,
                clientSecret: process.env.PAYPAL_CLIENT_SECRET,
                isSandbox: process.env.PAYPAL_IS_SANDBOX === "true",
                webhookId: process.env.PAYPAL_WEBHOOK_ID,
                includeShippingData: false,
                includeCustomerData: false,
            },
        },
    ],
    modules: [
        {
            resolve: "./src/modules/blog",
        },
        {
            resolve: "@medusajs/medusa/file",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/file-local",
                        id: "local",
                        options: {
                            backend_url: process.env.ADMIN_BACKEND_URL + '/static' || "http://localhost:7901/static",
                        },
                    },
                ],
            },
        },
        {
            resolve: '@medusajs/medusa/payment',
            options: {
                providers: [
                    {
                        resolve: "@alphabite/medusa-paypal/providers/paypal",
                        id: 'paypal',
                        options: {
                            clientId: process.env.PAYPAL_CLIENT_ID,
                            clientSecret: process.env.PAYPAL_CLIENT_SECRET,
                            isSandbox: process.env.PAYPAL_IS_SANDBOX === "true",
                            webhookId: process.env.PAYPAL_WEBHOOK_ID,
                            includeShippingData: false,
                            includeCustomerData: false,
                        },
                    },
                    {
                        resolve: '@medusajs/medusa/payment-stripe',
                        id: 'stripe',
                        options: {
                            apiKey: STRIPE_API_KEY,
                        },
                    },
                ],
            },
        },
        cacheModule,
        eventBusModule,
        workflowEngineModule,
    ],
    admin: {
        backendUrl: process.env.ADMIN_BACKEND_URL,
        vite: () => {
            return {
                optimizeDeps: {
                    include: ['@lambdacurry/medusa-plugins-sdk'],
                },
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBMEU7QUFFMUUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3hDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztBQUVoRCxNQUFNLFdBQVcsR0FBRyxPQUFPO0lBQ3pCLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRTtJQUNoRCxDQUFDLENBQUM7UUFDQSxPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRSxTQUFTO1NBQ3BCO0tBQ0YsQ0FBQztBQUVKLE1BQU0sY0FBYyxHQUFHLE9BQU87SUFDNUIsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFO0lBQ2pELENBQUMsQ0FBQztRQUNBLE9BQU8sRUFBRSxrQ0FBa0M7UUFDM0MsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFLFNBQVM7U0FDcEI7S0FDRixDQUFDO0FBRUosTUFBTSxvQkFBb0IsR0FBRyxPQUFPO0lBQ2xDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQ0FBMkMsRUFBRTtJQUMxRCxDQUFDLENBQUM7UUFDQSxPQUFPLEVBQUUsd0NBQXdDO1FBQ2pELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsU0FBUzthQUNmO1NBQ0Y7S0FDRixDQUFDO0FBRUosTUFBTSxDQUFDLE9BQU8s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