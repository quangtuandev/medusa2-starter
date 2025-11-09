"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
const REDIS_URL = process.env.REDIS_URL;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const IS_TEST = process.env.NODE_ENV === 'test';
// Bank Transfer Configuration (deprecated - now managed via bank-account module)
// Bank accounts are now managed through the admin API
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
            resolve: "./src/modules/product-reviews",
        },
        {
            resolve: "./src/modules/bank-account",
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
                    {
                        resolve: './src/modules/bank-transfer',
                        id: 'bank_transfer',
                        options: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBMEU7QUFFMUUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3hDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztBQUVoRCxpRkFBaUY7QUFDakYsc0RBQXNEO0FBRXRELE1BQU0sV0FBVyxHQUFHLE9BQU87SUFDekIsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFO0lBQ2hELENBQUMsQ0FBQztRQUNBLE9BQU8sRUFBRSw4QkFBOEI7UUFDdkMsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFLFNBQVM7U0FDcEI7S0FDRixDQUFDO0FBRUosTUFBTSxjQUFjLEdBQUcsT0FBTztJQUM1QixDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUU7SUFDakQsQ0FBQyxDQUFDO1FBQ0EsT0FBTyxFQUFFLGtDQUFrQztRQUMzQyxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsU0FBUztTQUNwQjtLQUNGLENBQUM7QUFFSixNQUFNLG9CQUFvQixHQUFHLE9BQU87SUFDbEMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLDJDQUEyQyxFQUFFO0lBQzFELENBQUMsQ0FBQztRQUNBLE9BQU8sRUFBRSx3Q0FBd0M7UUFDakQsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxTQUFTO2FBQ2Y7U0FDRjtLQUNG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