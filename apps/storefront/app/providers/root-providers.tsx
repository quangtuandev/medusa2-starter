import { StorefrontProvider, storefrontInitialState } from '@app/providers/storefront-provider';
import { I18nProvider } from '@app/providers/i18n-provider';
import { FC, PropsWithChildren } from 'react';

export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
  <I18nProvider>
    <StorefrontProvider data={storefrontInitialState}>{children}</StorefrontProvider>
  </I18nProvider>
);
