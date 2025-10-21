import { I18nextProvider } from 'react-i18next';
import i18n from '@app/i18n/config';
import { FC, PropsWithChildren } from 'react';

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
