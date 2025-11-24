import ProductList from "@app/components/sections/ProductList";

export default function CartsEmpty() {

    return (
        <>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[90px] xl:text-[150px] font-centuryBook italic text-64px leading-48px pl-2">Oohh</p>
                <p className="text-[60px] xl:text-[110px] font-title font-bold text-64px leading-48px pl-2">U GOT SOMETHING ;3</p>
            </div>
            <ProductList className="py-8 xl:!py-[100px] xl:px-9" heading="You may also like" />
        </>
    );
}
