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
            resolve: '@lambdacurry/medusa-product-reviews',
            options: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBMEU7QUFFMUUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3hDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztBQUVoRCxNQUFNLFdBQVcsR0FBRyxPQUFPO0lBQ3pCLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRTtJQUNoRCxDQUFDLENBQUM7UUFDRSxPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLE9BQU8sRUFBRTtZQUNQLFFBQVEsRUFBRSxTQUFTO1NBQ3BCO0tBQ0YsQ0FBQztBQUVOLE1BQU0sY0FBYyxHQUFHLE9BQU87SUFDNUIsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFO0lBQ2pELENBQUMsQ0FBQztRQUNFLE9BQU8sRUFBRSxrQ0FBa0M7UUFDM0MsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFLFNBQVM7U0FDcEI7S0FDRixDQUFDO0FBRU4sTUFBTSxvQkFBb0IsR0FBRyxPQUFPO0lBQ2xDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQ0FBMkMsRUFBRTtJQUMxRCxDQUFDLENBQUM7UUFDRSxPQUFPLEVBQUUsd0NBQXdDO1FBQ2pELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsU0FBUzthQUNmO1NBQ0Y7S0FDRixDQUFDO0FBRU4sTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDNUIsYUFBYSxFQUFFO1FBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtRQUNyQyxxQkFBcUIsRUFBRTtZQUNyQixHQUFHLEVBQUUsS0FBSztTQUNYO1FBQ0QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtRQUNyQyxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtZQUN2QyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtZQUN2QyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRTtZQUNyQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1A7WUFDRSxPQUFPLEVBQUUscUNBQXFDO1lBQzlDLE9BQU8sRUFBRSxFQUFFO1NBQ1o7S0FDRjtJQUNELE9BQU8sRUFBRTtRQUNQO1lBQ0UsT0FBTyxFQUFFLG9CQUFvQjtTQUM5QjtRQUNEO1lBQ0UsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSw2QkFBNkI7d0JBQ3RDLEVBQUUsRUFBRSxPQUFPO3dCQUNYLE9BQU8sRUFBRTs0QkFDUCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLElBQUksOEJBQThCO3lCQUN6RjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFFRDtZQUNFLE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUNBQWlDO3dCQUMxQyxFQUFFLEVBQUUsUUFBUTt3QkFDWixPQUFPLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLGNBQWM7eUJBQ3ZCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELFdBQVc7UUFDWCxjQUFjO1FBQ2Qsb0JBQW9CO0tBQ3JCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1FBQ3pDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDVCxPQUFPO2dCQUNMLFlBQVksRUFBRTtvQkFDWixPQUFPLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztpQkFDN0M7YUFDRixDQUFDO1FBQ0osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDIn0=