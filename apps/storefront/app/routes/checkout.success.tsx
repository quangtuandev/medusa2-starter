import React from "react";
import ProductList from '@app/components/sections/ProductList';
import { useI18n } from '@app/hooks/useI18n';

export default function CheckoutSuccessRoute() {
  const { t } = useI18n();
  return (
    <>
      <div className="bg-[url('/assets/images/checkout/success-bg.png')] bg-contain bg-center contact-success-message text-center mt-8">
        <p className="text-[90px] xl:text-[150px] font-centuryBook italic">{t('success.hurray')}</p>
        <p className="text-[60px] xl:text-[110px] font-title font-bold">{t('success.weGotU')}</p>
        <p className="text-[30px] font-title font-light">{t('success.deliveringSweetness')}</p>
      </div>
      <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
    </>
  );
}
