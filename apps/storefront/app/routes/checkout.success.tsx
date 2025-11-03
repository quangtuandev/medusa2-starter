import React from "react";
import ProductList from '@app/components/sections/ProductList';

export default function CheckoutSuccessRoute() {
  return (
    <>
      <div className="bg-[url('/assets/images/checkout/success-bg.png')] bg-contain bg-center contact-success-message text-center mt-8">
        <p className="text-[150px] font-centuryBook italic">Hurray!!!</p>
        <p className="text-[110px] font-title font-bold">WE GOT U ;3</p>
        <p className="text-[30px] font-title font-light">we’ll be delivering sweetness to u soon</p>
      </div>
      <ProductList className="!py-[100px] xl:px-9" heading="You may also like" />
    </>
  );
}
