import { Breadcrumb, Breadcrumbs } from '@app/components/common/breadcrumbs/Breadcrumbs';
import { Button } from '@app/components/common/buttons/Button';
import { Container } from '@app/components/common/container/Container';
import { FieldLabel } from '@app/components/common/forms/fields/FieldLabel';
import { Grid } from '@app/components/common/grid/Grid';
import { GridColumn } from '@app/components/common/grid/GridColumn';
import { SubmitButton } from '@app/components/common/remix-hook-form/buttons/SubmitButton';
import { QuantitySelector } from '@app/components/common/remix-hook-form/field-groups/QuantitySelector';
import { ProductImageGallery } from '@app/components/product/ProductImageGallery';
import { ProductOptionSelectorRadio } from '@app/components/product/ProductOptionSelectorRadio';
import { ProductOptionSelectorSelect } from '@app/components/product/ProductOptionSelectorSelect';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { ProductPriceRange } from '@app/components/product/ProductPriceRange';
import { ProductReviewSection } from '@app/components/reviews/ProductReviewSection';
import { useCart } from '@app/hooks/useCart';
import { useProductInventory } from '@app/hooks/useProductInventory';
import { useRegion } from '@app/hooks/useRegion';
import { createLineItemSchema } from '@app/routes/api.cart.line-items.create';
import HomeIcon from '@heroicons/react/24/solid/HomeIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoreProductReviewStats } from '@lambdacurry/medusa-plugins-sdk';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import {
  getFilteredOptionValues,
  getOptionValuesWithDiscountLabels,
  selectVariantFromMatrixBySelectedOptions,
  selectVariantMatrix,
} from '@libs/util/products';
import { getCustomizationTitles } from '@libs/util/random';
import { StoreProduct, StoreProductOptionValue, StoreProductVariant } from '@medusajs/types';
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import Collasape from '@app/components/common/collasape/Collasape';

export interface ProductTemplateProps {
  product: StoreProduct;
}

/**
 * Determines if a variant is sold out based on inventory
 * @param variant - The variant to check
 * @returns True if the variant is sold out, false otherwise
 */
const variantIsSoldOut: (variant: StoreProductVariant | undefined) => boolean = (variant) => {
  return !!(variant?.manage_inventory && variant?.inventory_quantity! < 1);
};

export const ProductTemplate = ({ product }: ProductTemplateProps) => {
  const [indexGallery, setIndexGallery] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const addToCartFetcher = useFetcher<any>({ key: FetcherKeys.cart.createLineItem });
  const { toggleCartDrawer } = useCart();
  const { region } = useRegion();
  const hasErrors = Object.keys(addToCartFetcher.data?.errors || {}).length > 0;

  // Combine both states to detect adding items as early as possible
  const isAddingToCart = ['submitting', 'loading'].includes(addToCartFetcher.state);

  const defaultValues = {
    productId: product.id!,
    quantity: '1',
    options: useMemo(() => {
      // Get the first variant as the default
      const firstVariant = product.variants?.[0];

      if (firstVariant && firstVariant.options) {
        // Create options object from the first variant
        return firstVariant.options.reduce(
          (acc, option) => {
            if (option.option_id && option.value) {
              acc[option.option_id] = option.value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );
      }

      // Fallback to first option values if no variants
      return (
        product.options?.reduce(
          (acc, option) => {
            if (!option.id || !option.values?.length) return acc;
            acc[option.id] = option.values[0].value;
            return acc;
          },
          {} as Record<string, string>,
        ) || {}
      );
    }, [product]),
  };

  const form = useRemixForm({
    resolver: zodResolver(createLineItemSchema),
    defaultValues,
    fetcher: addToCartFetcher,
    submitConfig: {
      method: 'post',
      action: '/api/cart/line-items/create',
      encType: 'multipart/form-data',
    },
  });

  const currencyCode = region.currency_code;
  const [controlledOptions, setControlledOptions] = useState<Record<string, string>>(defaultValues.options);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [customizationTitles, setCustomizationTitles] = useState<string[]>([]);
  const selectedOptions = useMemo(
    () => product.options?.map(({ id }) => controlledOptions[id]),
    [product, controlledOptions],
  );

  const variantMatrix = useMemo(() => selectVariantMatrix(product), [product]);
  const selectedVariant = useMemo(() => {
    return selectVariantFromMatrixBySelectedOptions(variantMatrix, selectedOptions);
  }, [variantMatrix, selectedOptions]);

  const productSelectOptions = useMemo(
    () =>
      product.options?.map((option, index) => {
        // For the first option (Duration), always show all values
        if (index === 0) {
          const optionValuesWithPrices = getOptionValuesWithDiscountLabels(
            index,
            currencyCode,
            option.values || [],
            variantMatrix,
            selectedOptions,
          );

          return {
            title: option.title,
            product_id: option.product_id as string,
            id: option.id,
            values: optionValuesWithPrices,
          };
        }

        // For subsequent options, filter based on previous selections
        const filteredOptionValues = getFilteredOptionValues(product, controlledOptions, option.id);

        // Only include option values that are available based on current selections
        const availableOptionValues = option.values?.filter((optionValue) =>
          filteredOptionValues.some((filteredValue) => filteredValue.value === optionValue.value),
        ) as StoreProductOptionValue[];

        const optionValuesWithPrices = getOptionValuesWithDiscountLabels(
          index,
          currencyCode,
          availableOptionValues || [],
          variantMatrix,
          selectedOptions,
        );

        return {
          title: option.title,
          product_id: option.product_id as string,
          id: option.id,
          values: optionValuesWithPrices,
        };
      }),
    [product, controlledOptions, currencyCode, variantMatrix, selectedOptions],
  );

  const productSoldOut = useProductInventory(product).averageInventory === 0;

  /**
   * Updates controlled options based on a changed option and resets subsequent options
   * @param currentOptions - Current controlled options
   * @param changedOptionId - ID of the option that changed
   * @param newValue - New value for the changed option
   * @returns Updated options object
   */
  const updateControlledOptions = (
    currentOptions: Record<string, string>,
    changedOptionId: string,
    newValue: string,
  ): Record<string, string> => {
    // Create new options object with the changed option
    const newOptions = { ...currentOptions };
    newOptions[changedOptionId] = newValue;

    // Get all option IDs in order
    const allOptionIds = product.options?.map((option) => option.id) || [];

    // Find the index of the changed option
    const changedOptionIndex = allOptionIds.indexOf(changedOptionId);

    // Get all options that come after the changed one
    const subsequentOptionIds = changedOptionIndex >= 0 ? allOptionIds.slice(changedOptionIndex + 1) : [];

    // Reset all subsequent options to their first available value
    if (subsequentOptionIds.length > 0) {
      // For each subsequent option, find available values based on current selections
      subsequentOptionIds.forEach((optionId) => {
        if (!optionId) return;

        // Get filtered option values for this option
        const filteredValues = getFilteredOptionValues(product, newOptions, optionId);

        if (filteredValues.length > 0) {
          // Set to first available value
          newOptions[optionId] = filteredValues[0].value;
        } else {
          // No valid options, set to empty
          newOptions[optionId] = '';
        }
      });
    }

    return newOptions;
  };

  const handleOptionChangeBySelect = (e: ChangeEvent<HTMLInputElement>) => {
    const changedOptionId = e.target.name.replace('options.', '');
    const newValue = e.target.value;
    const newOptions = updateControlledOptions(controlledOptions, changedOptionId, newValue);
    setControlledOptions(newOptions);
    form.setValue('options', newOptions);
  };

  useEffect(() => {
    if (selectedVariant) {
      console.log('selectedVariant', selectedVariant);
      const index = selectedVariant.title === 'small' ? 1 : 0;
      setIndexGallery(index);
    }
  }, [selectedVariant]);

  const handleOptionChangeByRadio = (name: string, value: string) => {
    const newOptions = updateControlledOptions(controlledOptions, name, value);
    setControlledOptions(newOptions);
    form.setValue('options', newOptions);
  };

  useEffect(() => {
    if (!isAddingToCart && !hasErrors) {
      // Only reset the form fields, not the controlled options
      if (formRef.current) {
        // Reset the form to clear validation states
        formRef.current.reset();

        // Re-set the quantity field to 1
        const quantityInput = formRef.current.querySelector('input[name="quantity"]') as HTMLInputElement;
        if (quantityInput) {
          quantityInput.value = '1';
        }

        // Keep the hidden productId field
        const productIdInput = formRef.current.querySelector('input[name="productId"]') as HTMLInputElement;
        if (productIdInput) {
          productIdInput.value = product.id!;
        }
      }
    }
  }, [isAddingToCart, hasErrors, product.id]);

  useEffect(() => {
    // Initialize controlledOptions with defaultValues.options only on initial load
    if (Object.keys(controlledOptions).length === 0) {
      setControlledOptions(defaultValues.options);
    }
  }, [defaultValues.options, controlledOptions]);

  useEffect(() => {
    // Initialize controlledOptions with defaultValues.options
    setControlledOptions(defaultValues.options);
  }, [defaultValues.options]);

  const soldOut = variantIsSoldOut(selectedVariant) || productSoldOut;

  // Use useCallback for the form submission handler
  const handleAddToCart = useCallback(() => {
    // Open cart drawer
    toggleCartDrawer(true);
  }, [toggleCartDrawer]);

  // Handle Buy Now functionality
  const handleBuyNow = useCallback(async () => {
    if (isBuyingNow) return;

    setIsBuyingNow(true);

    // Create a new form data submission
    const formData = new FormData();
    formData.append('productId', product.id!);
    formData.append('quantity', form.getValues('quantity'));

    // Add selected options to form data
    const options = form.getValues('options');
    Object.entries(options).forEach(([key, value]) => {
      formData.append(`options.${key}`, value as string);
    });

    try {
      // Submit to add to cart endpoint
      const response = await fetch('/api/cart/line-items/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to checkout on success
        window.location.href = '/checkout';
      } else {
        // Handle error
        console.error('Failed to add item to cart');
        setIsBuyingNow(false);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setIsBuyingNow(false);
    }
  }, [product.id, form, isBuyingNow]);

  useEffect(() => {
    const titles = getCustomizationTitles(product.title);
    if (titles.length > 1) {
      setCustomizationTitles(titles);
    } else {
      setCustomizationTitles([product.title]);
    }
  }, [product.title]);

  return (
    <>
      <section className="pb-12 pt-12 min-h-screen">
        <RemixFormProvider {...form}>
          <addToCartFetcher.Form
            id="addToCartForm"
            ref={formRef}
            method="post"
            action="/api/cart/line-items/create"
            onSubmit={handleAddToCart}
          >
            <input type="hidden" name="productId" value={product.id} />

            <Container className="px-0 sm:px-6 md:px-8">
              <Grid className="!gap-0 overflow-visible">
                <GridColumn className="mb-8 md:col-span-6 sticky top-[144px] [height:min-content]">
                  <h2 className="xl:text-[100px] font-bold text-gray-900 leading-[5rem]">
                    {customizationTitles[0]}
                  </h2>
                  <ProductImageGallery key={product.id} product={product} indexGallery={indexGallery} />
                  <div className='flex gap-4 items-end justify-between'>
                    <div className='flex flex-col gap-2'>
                      {customizationTitles[1] && (
                        <h2 className="xl:text-[100px] font-bold text-gray-900">
                          {customizationTitles[1]}
                        </h2>
                      )}
                      <p className="text-gray-900 font-bold flex gap-3">
                        <span className="text-5xl">
                          {selectedVariant ? (
                            <ProductPrice product={product} variant={selectedVariant} currencyCode={currencyCode} />
                          ) : (
                            <ProductPriceRange product={product} currencyCode={currencyCode} />
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-6">
                      {!soldOut && <QuantitySelector variant={selectedVariant} />}
                      <div className="flex-1">
                        {!soldOut ? (
                          <SubmitButton
                            variant="ghost"
                            size='image'
                            disabled={isAddingToCart || isBuyingNow}
                            className="disabled:opacity-50 disabled:cursor-not-allowed">
                            <img src="/assets/images/add-to-cart.svg" alt="Add to cart" className="w-auto h-[108px]" />
                          </SubmitButton>
                        ) : (
                          <SubmitButton
                            disabled
                            className="pointer-events-none !h-12 w-full !text-base !font-bold opacity-50"
                          >
                            Sold out
                          </SubmitButton>
                        )}
                      </div>
                    </div>
                  </div>
                </GridColumn>

                <GridColumn className="flex flex-col md:col-span-6">
                  <div className="h-fit">
                    <div className="px-0 sm:px-6 md:p-10 md:pt-0">
                      <div className="flex items-center gap-4 py-2">
                        <div className="flex-1">
                          {!soldOut ? (
                            <Button
                              variant="primary"
                              onClick={handleBuyNow}
                              disabled={isAddingToCart || isBuyingNow}
                              className="!h-12 whitespace-nowrap !text-base !font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isBuyingNow ? 'Processing...' : 'Buy Now'}
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="pointer-events-none !h-12 !text-base !font-bold opacity-50 bg-gray-300 text-gray-500"
                            >
                              Sold out
                            </Button>
                          )}
                        </div>
                      </div>

                      {productSelectOptions && productSelectOptions.length > 5 && (
                        <section aria-labelledby="product-options" className="product-options">
                          <h2 id="product-options" className="sr-only">
                            Product options
                          </h2>

                          <div className="space-y-4">
                            {productSelectOptions.map((option, optionIndex) => (
                              <ProductOptionSelectorSelect
                                key={optionIndex}
                                option={option}
                                value={controlledOptions[option.id]}
                                onChange={handleOptionChangeBySelect}
                                currencyCode={currencyCode}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {productSelectOptions && productSelectOptions.length <= 5 && (
                        <section aria-labelledby="product-options" className="product-options my-6 grid gap-4">
                          <h2 id="product-options" className="sr-only">
                            Product options
                          </h2>
                          {productSelectOptions.map((option, optionIndex) => (
                            <div key={optionIndex}>
                              <ProductOptionSelectorRadio
                                option={option}
                                value={controlledOptions[option.id]}
                                onChange={handleOptionChangeByRadio}
                                currencyCode={currencyCode}
                              />
                            </div>
                          ))}
                        </section>
                      )}

                      <div className="my-2 flex flex-col gap-2">
                        {!!product.description && (
                          <div className="mt-4">
                            <div className="whitespace-pre-wrap text-base text-primary-800">
                              {product.description}
                            </div>
                          </div>
                        )}

                        {/* {product.categories && product.categories.length > 0 && (
                              <nav aria-label="Categories" className="mt-4">
                                <h3 className="mb-2">Categories</h3>

                                <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  {product.categories.map((category, categoryIndex) => (
                                    <li key={categoryIndex}>
                                      <Button
                                        as={(buttonProps) => (
                                          <Link to={`/categories/${category.handle}`} {...buttonProps} />
                                        )}
                                        className="!h-auto whitespace-nowrap !rounded !px-2 !py-1 !text-xs !font-bold"
                                      >
                                        {category.name}
                                      </Button>
                                    </li>
                                  ))}
                                </ol>
                              </nav>
                            )}

                            {product.tags && product.tags.length > 0 && (
                              <nav aria-label="Tags" className="mt-4">
                                <h3 className="mb-2">Tags</h3>

                                <ol className="flex flex-wrap items-center gap-2 text-xs text-primary">
                                  {product.tags.map((tag, tagIndex) => (
                                    <li key={tagIndex}>
                                      <Button className="!h-auto whitespace-nowrap !rounded !px-2 !py-1 !text-xs !font-bold bg-accent-900 cursor-default">
                                        {tag.value}
                                      </Button>
                                    </li>
                                  ))}
                                </ol>
                              </nav>
                            )} */}
                      </div>
                    </div>
                    <div className="container mx-auto grid grid-cols-12 px-8 gap-[20px]">
                      <hr className='col-span-8 border-t-[1px] border-primary' />
                    </div>
                    <div className="container mx-auto my-12 grid grid-cols-12 px-8 p-4 gap-[20px]">
                      <Collasape className='col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]' title="INGREDIENTS" initiallyOpen={false}>
                        <div>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                        </div>
                      </Collasape>
                      <Collasape className='col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]' title="PRECAUTIONS OF USE" initiallyOpen={false}>
                        <div>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                        </div>
                      </Collasape>
                      <Collasape className='col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]' title="APPLICATION TIPS" initiallyOpen={false}>
                        <div>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                        </div>
                      </Collasape>
                    </div>
                    <div className="container mx-auto grid grid-cols-12 px-8 gap-[20px]">
                      <hr className='col-span-8 border-t-[1px] border-primary' />
                    </div>
                  </div>
                </GridColumn>
              </Grid>

            </Container>
          </addToCartFetcher.Form>
        </RemixFormProvider>
      </section>
      <Container>
        <ProductReviewSection />
      </Container>
    </>
  );
};
