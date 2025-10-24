import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { StoreProductVariant } from '@medusajs/types';
import clsx from 'clsx';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';

interface QuantitySelectorProps {
  variant: StoreProductVariant | undefined;
  maxInventory?: number;
  className?: string;
  formId?: string;
  onChange?: (quantity: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ className, variant, maxInventory = 10, onChange }) => {
  const formContext = useRemixFormContext();

  if (!formContext) {
    console.error('QuantitySelector must be used within a RemixFormProvider');
    return null;
  }

  const { control } = formContext;

  const variantInventory =
    variant?.manage_inventory && !variant.allow_backorder ? variant.inventory_quantity || 0 : maxInventory;

  const handleDecrement = (currentValue: number, onChange: (value: number) => void) => {
    const newValue = Math.max(1, currentValue - 1);
    onChange(newValue);
    onChange?.(newValue);
  };

  const handleIncrement = (currentValue: number, onChange: (value: number) => void) => {
    const newValue = Math.min(variantInventory, currentValue + 1);
    onChange(newValue);
    onChange?.(newValue);
  };

  const handleInputChange = (value: string, onChange: (value: number) => void) => {
    const numValue = parseInt(value, 10) || 1;
    const clampedValue = Math.max(1, Math.min(variantInventory, numValue));
    onChange(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <div className={clsx('flex items-center border border-gray-300 rounded-full px-2', className)}>
          <label htmlFor="quantity" className="sr-only">
            Quantity
          </label>

          {/* Minus Button */}
          <button
            type="button"
            className="bg-highlight flex items-center justify-center p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-full"
            onClick={() => handleDecrement(field.value || 1, field.onChange)}
            disabled={(field.value || 1) <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </button>

          {/* Quantity Input */}
          <input
            {...field}
            type="text"
            inputMode="numeric"
            id="quantity"
            className="w-12 text-center border-0 focus:ring-0 focus:outline-none text-base font-medium px-1 py-2"
            value={field.value || '1'}
            onChange={(e) => handleInputChange(e.target.value, field.onChange)}
            min={1}
            max={variantInventory}
          />

          {/* Plus Button */}
          <button
            type="button"
            className="bg-highlight flex items-center justify-center p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-full"
            onClick={() => handleIncrement(field.value || 1, field.onChange)}
            disabled={(field.value || 1) >= variantInventory}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    />
  );
};
