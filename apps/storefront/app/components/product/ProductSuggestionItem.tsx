import { useRegion } from "@app/hooks/useRegion";
import {
  getFilteredOptionValues,
  getVariantFromSelectedOptions,
  selectVariantFromMatrixBySelectedOptions,
  selectVariantMatrix,
} from "@libs/util/products";
import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, type FC, type HTMLAttributes } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { ProductPrice } from "./ProductPrice";
import { ProductThumbnail } from "./ProductThumbnail";

export interface ProductSuggestionItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

export const ProductSuggestionItem: FC<ProductSuggestionItemProps> = ({
  product,
  className,
  isTransitioning,
  ...props
}) => {
  const { region } = useRegion();
  const currencyCode = region.currency_code;

  // Initialize default options from first variant
  const defaultOptions = useMemo(() => {
    const firstVariant = product.variants?.[0];

    if (firstVariant && firstVariant.options && firstVariant.options.length > 0) {
      // Create options object from the first variant
      // This ensures we get the actual option values from a real variant
      const options = firstVariant.options.reduce(
        (acc, option) => {
          if (option.option_id && option.value) {
            acc[option.option_id] = option.value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Verify that we have values for all product options
      // This is a safety check to ensure the variant has all required options
      if (product.options && product.options.length > 0) {
        const missingOptions = product.options.filter(
          (opt) => opt.id && !options[opt.id]
        );

        if (missingOptions.length > 0) {
          console.log('⚠️ First variant is missing some options:', missingOptions.map(opt => opt.id));
          // Fill in missing options with first available value
          missingOptions.forEach((opt) => {
            if (opt.id && opt.values && opt.values.length > 0) {
              options[opt.id] = opt.values[0].value;
            }
          });
        }
      }

      console.log('✅ defaultOptions from variant:', options);
      console.log('✅ Product options:', product.options?.map(opt => ({ id: opt.id, title: opt.title })));
      return options;
    }

    // Fallback to first option values if no variants
    if (product.options && product.options.length > 0) {
      const options = product.options.reduce(
        (acc, option) => {
          if (!option.id || !option.values?.length) return acc;
          acc[option.id] = option.values[0].value;
          return acc;
        },
        {} as Record<string, string>,
      );
      console.log('✅ defaultOptions from product options:', options);
      return options;
    }

    console.log('⚠️ No defaultOptions found');
    return {};
  }, [product]);

  // Use defaultOptions directly as controlledOptions, but ensure it's always up to date
  const [controlledOptions, setControlledOptions] = useState<Record<string, string>>(defaultOptions);
  const prevDefaultOptionsRef = useRef<Record<string, string>>(defaultOptions);

  // Initialize and update controlledOptions when defaultOptions change
  useEffect(() => {
    console.log('🔄 useEffect: defaultOptions changed', defaultOptions);

    // Check if defaultOptions actually changed
    const hasChanged = JSON.stringify(prevDefaultOptionsRef.current) !== JSON.stringify(defaultOptions);

    if (hasChanged) {
      console.log('✅ defaultOptions changed, updating controlledOptions');
      prevDefaultOptionsRef.current = defaultOptions;

      if (Object.keys(defaultOptions).length > 0) {
        setControlledOptions(defaultOptions);
        console.log('✅ Updated controlledOptions:', defaultOptions);
      } else {
        setControlledOptions({});
        console.log('⚠️ Cleared controlledOptions because defaultOptions is empty');
      }
    }
  }, [defaultOptions]);

  const variantMatrix = useMemo(() => selectVariantMatrix(product), [product]);

  // selectedOptions is used for display/debugging only
  // The actual variant selection uses controlledOptions directly
  const selectedOptions = useMemo(() => {
    if (!product.options || product.options.length === 0) {
      return [];
    }
    // Map options to their selected values in the correct order
    // This array is used to build the lookup key for the variant matrix
    return product.options.map(({ id }) => controlledOptions[id]).filter((opt): opt is string => Boolean(opt));
  }, [product, controlledOptions]);

  const selectedVariant = useMemo(() => {
    // If product has no options, return first variant
    if (!product.options || product.options.length === 0) {
      console.log('✅ No options, using first variant');
      return product.variants?.[0];
    }

    // Check if we have all required options selected
    // selectedOptions should have the same length as product.options
    const allOptionsSelected = product.options.every((option) => {
      if (!option.id) return false;
      const value = controlledOptions[option.id];
      return value && value !== '';
    });

    if (!allOptionsSelected) {
      console.log('⚠️ Not all options selected. controlledOptions:', controlledOptions);
      console.log('⚠️ Product options:', product.options.map(opt => ({ id: opt.id, title: opt.title })));
      return undefined;
    }

    // Build selectedOptions array in the correct order (matching product.options order)
    const orderedSelectedOptions = product.options
      .map(({ id }) => controlledOptions[id])
      .filter((opt): opt is string => Boolean(opt));

    // Check if we have the right number of selected options
    if (orderedSelectedOptions.length !== product.options.length) {
      console.log('⚠️ Selected options count mismatch:', {
        selected: orderedSelectedOptions.length,
        required: product.options.length,
        options: orderedSelectedOptions,
      });
      return undefined;
    }

    // Debug: log the serialized key we're looking for
    const serializedKey = orderedSelectedOptions.join('|');
    console.log('🔍 Looking for variant with key:', serializedKey);
    console.log('🔍 Available keys in matrix:', Object.keys(variantMatrix));

    // Find variant based on selected options using matrix first (faster)
    let variant = selectVariantFromMatrixBySelectedOptions(variantMatrix, orderedSelectedOptions);

    // Fallback: if not found in matrix, try direct lookup
    if (!variant) {
      console.log('⚠️ Variant not found in matrix. Trying direct lookup...');
      console.log('⚠️ Matrix keys:', Object.keys(variantMatrix));
      console.log('⚠️ Looking for:', serializedKey);
      console.log('⚠️ controlledOptions:', controlledOptions);

      // Try direct lookup using getVariantFromSelectedOptions
      variant = getVariantFromSelectedOptions(product, controlledOptions);
      console.log('variant', variant, product, controlledOptions);

      if (variant) {
        console.log('✅ Found variant via direct lookup:', variant.id);
      } else {
        console.log('❌ Variant not found via direct lookup either');
      }
    } else {
      console.log('✅ Found variant in matrix:', variant.id);
    }
    return variant;
  }, [variantMatrix, controlledOptions, product]);

  /**
   * Updates controlled options based on a changed option and resets subsequent options
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
      subsequentOptionIds.forEach((optionId) => {
        if (!optionId) return;

        // Get filtered option values for this option
        const filteredValues = getFilteredOptionValues(product, newOptions, optionId);

        if (filteredValues.length > 0) {
          // Set to first available value
          newOptions[optionId] = filteredValues[0].value;
        } else {
          // No valid options, set to empty
          newOptions[optionId] = "";
        }
      });
    }

    return newOptions;
  };

  const handleOptionChange = (optionId: string, value: string) => {
    const newOptions = updateControlledOptions(controlledOptions, optionId, value);
    setControlledOptions(newOptions);
  };

  // Check if all required options are selected
  const allOptionsSelected = useMemo(() => {
    if (!product.options || product.options.length === 0) return true;

    const allSelected = product.options.every((option) => {
      if (!option.id) return false;
      const selectedValue = controlledOptions[option.id];
      const isValid = selectedValue && selectedValue !== "";
      console.log(`  Option ${option.id} (${option.title}): ${selectedValue} - ${isValid ? '✅' : '❌'}`);
      return isValid;
    });

    console.log('📋 allOptionsSelected check:', allSelected, 'for', product.options.length, 'options');
    return allSelected;
  }, [product.options, controlledOptions]);

  // Get filtered option values for each option
  const productSelectOptions = useMemo(
    () =>
      product.options?.map((option, index) => {
        // For the first option, always show all values
        if (index === 0) {
          return {
            title: option.title,
            id: option.id,
            values: option.values || [],
          };
        }

        // For subsequent options, filter based on previous selections
        const filteredOptionValues = getFilteredOptionValues(product, controlledOptions, option.id);

        return {
          title: option.title,
          id: option.id,
          values: filteredOptionValues,
        };
      }),
    [product, controlledOptions],
  );

  // Determine if we can add to cart
  const canAddToCart = useMemo(() => {
    // If product has no variants, cannot add to cart
    if (!product.variants || product.variants.length === 0) {
      console.log('❌ No variants');
      return false;
    }

    // If product has no options, allow adding to cart (use first variant)
    if (!product.options || product.options.length === 0) {
      console.log('✅ No options, using first variant');
      return true;
    }

    // If product has options, check if all are selected and variant exists
    const result = allOptionsSelected && selectedVariant !== undefined;
    console.log('Result:', result, '(allOptionsSelected:', allOptionsSelected, ', selectedVariant:', selectedVariant !== undefined, ')', selectedVariant);
    return result;
  }, [product.options, product.variants, allOptionsSelected, selectedVariant, controlledOptions, selectedOptions, variantMatrix]);

  return (
    <article
      className={clsx(className, "text-left overflow-hidden flex gap-3")}
      {...props}
    >
      <ProductThumbnail
        isRemoveStyleDefault={true}
        isTransitioning={isTransitioning}
        product={product}
        forcedZoom={0.25}
        className="!aspect-square !w-[200px] !h-[200px]"
        classNameImage="!w-[200px] !h-[200px] !object-cover"
      />
      <div className="flex flex-col gap-4 justify-center">
        <p className="font-medium">{product.title}</p>
        <div className="flex gap-2">

          {selectedVariant ? (
            <ProductPrice
              product={product}
              variant={selectedVariant}
              currencyCode={currencyCode}
            />
          ) : (
            <ProductPrice product={product} currencyCode={currencyCode} />
          )}

          {/* Render all product options */}
          {productSelectOptions && productSelectOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              {productSelectOptions.map((option) => {
                const filteredValues = option.values || [];

                if (filteredValues.length === 0) return null;

                return (
                  <div key={option.id} className="flex flex-col gap-1">
                    {/* <span className="text-xs font-medium text-gray-600">{option.title}</span> */}
                    <div className="flex flex-wrap gap-2">
                      {filteredValues.map((value) => {
                        const isSelected = controlledOptions[option.id] === value.value;

                        return (
                          <button
                            key={value.id}
                            type="button"
                            onClick={() => handleOptionChange(option.id, value.value)}
                            className={clsx(
                              "text-xs font-light border rounded-full px-3 py-1 font-display leading-none transition-colors cursor-pointer",
                              {
                                "!text-black !border-black bg-highlight": isSelected,
                                "border-[#716E6E] text-gray-700 hover:border-gray-900": !isSelected,
                              }
                            )}
                          >
                            {value.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AddToCartButton
          product={product}
          selectedOptions={controlledOptions}
          disabled={!canAddToCart}
          isFullText={true}
          variant="secondary"
        />
      </div>
    </article>
  );
};
