import React from "react";
import ProductList from '@app/components/sections/ProductList';
import { useI18n } from '@app/hooks/useI18n';
import { Container } from "@app/components/common/container/Container";

export default function CheckoutSuccessRoute() {
  const { t } = useI18n();
  return (
    <Container>
      <div className="bg-[url('/assets/images/checkout/success-bg.png')] bg-contain lg:bg-center bg-no-repeat contact-success-message text-center mt-8">
        <p className="text-[65px] xl:text-[150px] font-centuryBook italic">{t('success.hurray')}</p>
        <p className="text-[30px] xl:text-[110px] font-title font-bold">{t('success.weGotU')}</p>
        <p className="text-[18px] xl:text-[30px] font-title font-light">{t('success.deliveringSweetness')}</p>
      </div>
      <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
    </Container>
  );
}
