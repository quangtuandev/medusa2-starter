import React from "react";
import ProductList from '@app/components/sections/ProductList';
import { useI18n } from '@app/hooks/useI18n';

export default function ContactSuccess() {
    const { t } = useI18n();
    return (
        <>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[80px] xl:text-[150px] font-centuryBook italic text-64px leading-48px pl-2">{t('success.okay')}</p>
                <p className="text-[55px] xl:text-[110px] font-title font-bold text-64px leading-48px pl-2">{t('success.weGotUContact')}</p>
                <p className="text-[28px] font-title font-light xl:text-[30px] leading-30px pl-2">{t('success.replyingSoon')}</p>
                <p className="text-[28px] font-title font-light xl:text-[30px] leading-30px pl-2">{t('success.inTheMeantime')}</p>
            </div>
            <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
        </>
    );
}
