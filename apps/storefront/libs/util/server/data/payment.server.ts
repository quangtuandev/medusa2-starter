import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { StorePaymentProvider } from '@medusajs/types';
import { BankAccount } from '@libs/types';
import { MILLIS } from '../cache-builder.server';

export interface BankAccountListResponse {
  bank_accounts: BankAccount[];
  limit: number;
  offset: number;
  count: number;
}

export const listCartPaymentProviders = async (regionId: string) => {
  return sdk.store.payment
    .listPaymentProviders({ region_id: regionId })
    .then(({ payment_providers }) => payment_providers)
    .catch(() => [] as StorePaymentProvider[]);
};


export const listBankAccounts = async (
  cacheOptions: { forceFresh?: boolean } = {},
): Promise<BankAccountListResponse> => {
  return await cachified({
    key: `bank-accounts`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    forceFresh: cacheOptions.forceFresh,
    async getFreshValue() {
      return await sdk.client.fetch(`/store/bank-accounts`, {
        method: 'GET',
      });
    },
  });
};