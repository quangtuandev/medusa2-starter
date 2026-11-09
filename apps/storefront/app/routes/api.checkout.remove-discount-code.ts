import { zodResolver } from '@hookform/resolvers/zod';
import { sdk } from '@libs/util/server/client.server';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const removeDiscountCodeSchema = z.object({
  cartId: z.string(),
  code: z.string().min(1, 'Discount code is required'),
});

export type RemoveDiscountCodeFormData = z.infer<typeof removeDiscountCodeSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<RemoveDiscountCodeFormData>(
    actionArgs.request,
    zodResolver(removeDiscountCodeSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  try {
    const { cart: updatedCart } = await sdk.store.cart.removePromotions(data.cartId, {
      promo_codes: [data.code],
    });

    if (!updatedCart) {
      return remixData({ errors: { root: { message: 'Could not remove promo code.' } } }, { status: 400 });
    }

    return remixData({ cart: updatedCart });
  } catch (error) {
    console.error(error);
    return remixData({ errors: { root: { message: 'Could not remove promo code.' } } }, { status: 400 });
  }
}
