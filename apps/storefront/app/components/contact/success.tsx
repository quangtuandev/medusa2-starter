import React from "react";
import ProductList from '@app/components/sections/ProductList';
import { useI18n } from '@app/hooks/useI18n';
import { Container } from "@app/components/common/container/Container";

export default function ContactSuccess() {
    const { t } = useI18n();
    return (
        <Container>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[65px] xl:text-[120px] font-centuryBook italic text-64px leading-48px pl-2">{t('success.okay')}</p>
                <p className="text-[30px] xl:text-[70px] font-title font-bold text-64px leading-48px pl-2">{t('success.weGotUContact')}</p>
                <p className="text-[18px] font-title font-light xl:text-[30px] leading-30px pl-2">{t('success.replyingSoon')}</p>
                <p className="text-[18px] font-title font-light xl:text-[30px] leading-30px pl-2">{t('success.inTheMeantime')}</p>
            </div>
            <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
        </Container>
    );
}
