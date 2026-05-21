import { defineConfig, loadEnv, Module } from '@medusajs/framework/utils';
import { initializeContentful, createContentTypes, enableLocales } from './src/modules/contentful/loaders';
import CustomerReviewsFeatureFlag from './src/feature-flags/customer-reviews';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

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

module.exports = defineConfig({
  featureFlags: {
    [CustomerReviewsFeatureFlag.key]: true,
  },
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
      resolve: "./src/modules/location",
    },
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
      resolve: "./src/modules/email-settings",
    },
    {
      resolve: "./src/modules/page",
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/email-notification",
            id: "nodemailer",
            options: {
              channels: ["email"],
              host: process.env.SMTP_HOST || "smtp.gmail.com",
              port: Number(process.env.SMTP_PORT) || 587,
              auth_user: process.env.SMTP_USER || "",
              auth_pass: process.env.SMTP_PASS || "",
              from: process.env.SMTP_FROM || process.env.SMTP_USER || "",
            },
          },
        ],
      },
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
          // {
          //   resolve: '@medusajs/medusa/payment-stripe',
          //   id: 'stripe',
          //   options: {
          //     apiKey: STRIPE_API_KEY,
          //   },
          // },
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
