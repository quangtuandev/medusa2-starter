import React from "react";
import ProductList from '@app/components/sections/ProductList';

export default function ContactSuccess() {
    return (
        <>
            <div className="contact-success-message text-center mt-8">
                <p className="text-[150px] font-centuryBook italic text-64px leading-48px pl-2">Okay!!!</p>
                <p className="text-[110px] font-title font-bold text-64px leading-48px pl-2">WE GOT U ;3</p>
                <p className="text-[30px] font-title font-light text-30px leading-30px pl-2">we’ll be replying to u sooooon!!!</p>
                <p className="text-[30px] font-title font-light text-30px leading-30px pl-2">in the meantime....... </p>
            </div>
            <ProductList className="!py-[100px] xl:px-9" heading="You may also like" />
        </>
    );
}
