import { zodResolver } from '@hookform/resolvers/zod';
import { fetchProducts } from '@libs/util/server/products.server';
import { data, data as remixData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const productsSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});

export type ProductsSearchFormData = z.infer<typeof productsSearchSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { products } = await fetchProducts(request, {
    q: new URL(request.url).searchParams.get('q') || '',
    limit: 3
  });

  return data(products, { status: 200 });
}

