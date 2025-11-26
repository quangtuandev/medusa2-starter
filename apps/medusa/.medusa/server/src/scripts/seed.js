"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDemoData;
const core_flows_1 = require("@medusajs/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const core_flows_2 = require("@medusajs/medusa/core-flows");
const products_1 = require("./seed/products");
const reviews_1 = require("./seed/reviews");
async function seedDemoData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const paymentModuleService = container.resolve(utils_1.Modules.PAYMENT);
    const canadianCountries = ['ca'];
    const americanCountries = ['us'];
    const allCountries = [...canadianCountries, ...americanCountries];
    logger.info('Seeding store data...');
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: 'Default Sales Channel',
    });
    if (!defaultSalesChannel.length) {
        // create the default sales channel
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
            input: {
                salesChannelsData: [
                    {
                        name: 'Default Sales Channel',
                    },
                ],
            },
        });
        defaultSalesChannel = salesChannelResult;
    }
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: {
                supported_currencies: [
                    {
                        currency_code: 'usd',
                        is_default: true,
                    },
                    {
                        currency_code: 'cad',
                    },
                ],
                default_sales_channel_id: defaultSalesChannel[0].id,
            },
        },
    });
    logger.info('Seeding region data...');
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
        input: {
            regions: [
                {
                    name: 'United States',
                    currency_code: 'usd',
                    countries: americanCountries,
                    payment_providers: ['pp_stripe_stripe'],
                },
                {
                    name: 'Canada',
                    currency_code: 'cad',
                    countries: canadianCountries,
                    payment_providers: ['pp_stripe_stripe'],
                },
            ],
        },
    });
    const usRegion = regionResult[0];
    const caRegion = regionResult[1];
    logger.info('Finished seeding regions.');
    logger.info('Seeding tax regions...');
    // await createTaxRegionsWorkflow(container).run({
    //   input: allCountries.map((country_code) => ({
    //     country_code,
    //   })),
    // });
    logger.info('Finished seeding tax regions.');
    logger.info('Seeding stock location data...');
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
        input: {
            locations: [
                {
                    name: 'South Lamar Location',
                    address: {
                        city: 'Austin',
                        country_code: 'US',
                        province: 'TX',
                        address_1: '1200 S Lamar Blvd',
                        postal_code: '78704',
                    },
                },
            ],
        },
    });
    // const europeanStockLocation = stockLocationResult[0];
    const americanStockLocation = stockLocationResult[0];
    await remoteLink.create([
        {
            [utils_1.Modules.STOCK_LOCATION]: {
                stock_location_id: americanStockLocation.id,
            },
            [utils_1.Modules.FULFILLMENT]: {
                fulfillment_provider_id: 'manual_manual',
            },
        },
    ]);
    logger.info('Seeding fulfillment data...');
    const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
        input: {
            data: [
                {
                    name: 'Default',
                    type: 'default',
                },
            ],
        },
    });
    const shippingProfile = shippingProfileResult[0];
    const northAmericanFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: 'North American delivery',
        type: 'shipping',
        service_zones: [
            {
                name: 'United States',
                geo_zones: [
                    {
                        country_code: 'us',
                        type: 'country',
                    },
                ],
            },
            {
                name: 'Canada',
                geo_zones: [
                    {
                        country_code: 'ca',
                        type: 'country',
                    },
                ],
            },
        ],
    });
    await remoteLink.create({
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: americanStockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_set_id: northAmericanFulfillmentSet.id,
        },
    });
    const { result: collectionsResult } = await (0, core_flows_2.createCollectionsWorkflow)(container).run({
        input: {
            collections: [
                {
                    title: 'Light Roasts',
                    handle: 'light-roasts',
                },
                {
                    title: 'Medium Roasts',
                    handle: 'medium-roasts',
                },
                {
                    title: 'Dark Roasts',
                    handle: 'dark-roasts',
                },
            ],
        },
    });
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
        input: [
            {
                name: 'Standard Shipping',
                price_type: 'flat',
                provider_id: 'manual_manual',
                service_zone_id: northAmericanFulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: 'Standard',
                    description: 'Ship in 2-3 days.',
                    code: 'standard',
                },
                prices: [
                    {
                        currency_code: 'usd',
                        amount: 5,
                    },
                    {
                        currency_code: 'cad',
                        amount: 5,
                    },
                    {
                        region_id: usRegion.id,
                        amount: 5,
                    },
                    {
                        region_id: caRegion.id,
                        amount: 5,
                    },
                ],
                rules: [
                    {
                        attribute: 'enabled_in_store',
                        value: 'true',
                        operator: 'eq',
                    },
                    {
                        attribute: 'is_return',
                        value: 'false',
                        operator: 'eq',
                    },
                ],
            },
            {
                name: 'Express Shipping',
                price_type: 'flat',
                provider_id: 'manual_manual',
                service_zone_id: northAmericanFulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: 'Express',
                    description: 'Ship in 24 hours.',
                    code: 'express',
                },
                prices: [
                    {
                        currency_code: 'usd',
                        amount: 10,
                    },
                    {
                        currency_code: 'cad',
                        amount: 10,
                    },
                    {
                        region_id: usRegion.id,
                        amount: 10,
                    },
                    {
                        region_id: caRegion.id,
                        amount: 10,
                    },
                ],
                rules: [
                    {
                        attribute: 'enabled_in_store',
                        value: 'true',
                        operator: 'eq',
                    },
                    {
                        attribute: 'is_return',
                        value: 'false',
                        operator: 'eq',
                    },
                ],
            },
        ],
    });
    logger.info('Finished seeding fulfillment data.');
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: americanStockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info('Finished seeding stock location data.');
    logger.info('Seeding publishable API key data...');
    const { result: publishableApiKeyResult } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
        input: {
            api_keys: [
                {
                    title: 'Storefront',
                    type: 'publishable',
                    created_by: '',
                },
            ],
        },
    });
    const publishableApiKey = publishableApiKeyResult[0];
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: {
            id: publishableApiKey.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info('Finished seeding publishable API key data.');
    logger.info('Seeding product data...');
    const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: [
                {
                    name: 'Blends',
                    is_active: true,
                },
                {
                    name: 'Single Origin',
                    is_active: true,
                },
            ],
        },
    });
    const { result: productTagsResult } = await (0, core_flows_1.createProductTagsWorkflow)(container).run({
        input: {
            product_tags: [
                {
                    value: 'Ethiopia',
                },
                {
                    value: 'Colombia',
                },
                {
                    value: 'Best Sellers',
                },
                {
                    value: 'Brazil',
                },
                {
                    value: 'Africa',
                },
                {
                    value: 'Latin America',
                },
            ],
        },
    });
    const { result: productResult } = await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: (0, products_1.seedProducts)({
                collections: collectionsResult,
                tags: productTagsResult,
                categories: categoryResult,
                sales_channels: [{ id: defaultSalesChannel[0].id }],
                shipping_profile_id: shippingProfile.id,
            }),
        },
    });
    for (const product of productResult) {
        const firstVariant = product.variants[0];
        // Determine a random number of reviews between 5 and 10 for this product
        const numReviews = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
        // Shuffle the customers array to get random customers for each product
        const shuffledCustomers = [...reviews_1.texasCustomers].sort(() => 0.5 - Math.random());
        const selectedCustomers = shuffledCustomers.slice(0, numReviews);
        // Shuffle the review contents to get random reviews
        const shuffledReviews = [...reviews_1.reviewContents].sort(() => 0.5 - Math.random());
        const selectedReviews = shuffledReviews.slice(0, numReviews);
        // Create multiple orders for each product with different customers
        const orders = [];
        for (const customer of selectedCustomers) {
            const { result: order } = await (0, core_flows_1.createOrderWorkflow)(container).run({
                input: {
                    email: customer.email,
                    shipping_address: {
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        phone: customer.phone,
                        city: customer.city,
                        country_code: 'US',
                        province: 'TX',
                        address_1: customer.address_1,
                        postal_code: customer.postal_code,
                    },
                    items: [
                        {
                            variant_id: firstVariant.id,
                            product_id: product.id,
                            quantity: 1,
                            title: product.title,
                            thumbnail: product.thumbnail ?? undefined,
                            unit_price: 18.0,
                        },
                    ],
                    transactions: [
                        {
                            amount: 18.0,
                            currency_code: 'usd',
                        },
                    ],
                    region_id: usRegion.id,
                    sales_channel_id: defaultSalesChannel[0].id,
                },
            });
            orders.push(order);
        }
    }
    logger.info('Finished seeding product data.');
    logger.info(`PUBLISHABLE API KEY: ${publishableApiKey.token}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE0QkEsK0JBbWFDO0FBL2JELHFEQWU4QjtBQUU5QixxREFBK0U7QUFDL0UsNERBQXdFO0FBT3hFLDhDQUErQztBQUMvQyw0Q0FBd0Y7QUFFekUsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNoRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckUsTUFBTSx3QkFBd0IsR0FBOEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbkcsTUFBTSx5QkFBeUIsR0FBK0IsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkcsTUFBTSxrQkFBa0IsR0FBd0IsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakYsTUFBTSxvQkFBb0IsR0FBMEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdkYsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQUcsaUJBQWlCLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0lBRWxFLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUVyQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUs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