import ProductList from "@app/components/sections/ProductList";
import { useI18n } from "@app/hooks/useI18n";
import { Container } from "@app/components/common/container/Container";

export default function CartsEmpty() {
    const { t } = useI18n();
    return (
        <Container>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[65px] xl:text-[120px] font-centuryBook italic leading-48px pl-2">{t('success.oohh')}</p>
                <p className="text-[30px] xl:text-[70px] font-title font-bold leading-48px pl-2">{t('success.uGotSomething')}</p>
            </div>
            <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading={t('success.youMayAlsoLike')} />
        </Container>
    );
}
