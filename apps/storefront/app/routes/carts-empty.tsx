import ProductList from "@app/components/sections/ProductList";
import { useI18n } from "@app/hooks/useI18n";

export default function CartsEmpty() {
    const { t } = useI18n();
    return (
        <>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[90px] xl:text-[150px] font-centuryBook italic text-64px leading-48px pl-2">{t('success.oohh')}</p>
                <p className="text-[60px] xl:text-[110px] font-title font-bold text-64px leading-48px pl-2">{t('success.uGotSomething')}</p>
            </div>
            <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
        </>
    );
}
