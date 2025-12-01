import { Actions } from '@app/components/common/actions/Actions';
import { Button } from '@app/components/common/buttons/Button';
import { StyledTextField } from '@app/components/common/remix-hook-form/forms/fields/StyledTextField';
import { useCheckout } from '@app/hooks/useCheckout';
import { useCustomer } from '@app/hooks/useCustomer';
import { useRegions } from '@app/hooks/useRegions';
import { CheckoutStep } from '@app/providers/checkout-provider';
import { accountDetailsSchema } from '@app/routes/api.checkout.account-details';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form';
import type { MedusaAddress } from '@libs/types';
import { convertToFormData, medusaAddressToAddress } from '@libs/util';
import { checkAccountDetailsComplete } from '@libs/util/checkout';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import type { StoreRegion, StoreRegionCountry } from '@medusajs/types';
import { useEffect, useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { SubmitButton } from '../common/remix-hook-form/buttons/SubmitButton';
import { CheckoutSectionHeader } from './CheckoutSectionHeader';
import { AddressDisplay } from './address/AddressDisplay';
import { selectInitialShippingAddress } from './checkout-form-helpers';
import { useI18n } from '@app/hooks/useI18n';
import { Label, Select, type SelectOption } from '@lambdacurry/forms/ui';
import { useRegion } from '@app/hooks/useRegion';

const NEW_SHIPPING_ADDRESS_ID = 'new';

export const CheckoutAccountDetails = () => {
  const { regions } = useRegions();
  const { region } = useRegion();
  const contriesOptions = useMemo(() => regions?.flatMap((region: StoreRegion) => region.countries?.map((country: StoreRegionCountry) => ({
    value: country.iso_2,
    label: country.display_name,
  }))) ?? [], [regions]);

  console.log('contriesOptions', region);

  const { t } = useI18n();
  const checkoutAccountDetailsFormFetcher = useFetcher<{
    errors: FieldErrors;
  }>({ key: FetcherKeys.cart.accountDetails });
  const { customer } = useCustomer();

  const { step, setStep, goToNextStep, cart, isCartMutating } = useCheckout();
  const isActiveStep = step === CheckoutStep.ACCOUNT_DETAILS;

  if (!cart) return null;

  const initialShippingAddress = selectInitialShippingAddress(cart, customer!);

  const isComplete = checkAccountDetailsComplete(cart);

  const isSubmitting = ['submitting', 'loading'].includes(checkoutAccountDetailsFormFetcher.state);

  const hasErrors = !!checkoutAccountDetailsFormFetcher.data?.errors;

  const initialShippingAddressId = initialShippingAddress?.id ?? NEW_SHIPPING_ADDRESS_ID;

  const countryOptions =
    (cart.region?.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    })) as { value: string; label: string }[]) ?? [];

  const defaultValues = {
    cartId: cart.id,
    email: customer?.email || cart.email || '',
    customerId: customer?.id,
    allowSuggestions: true,
    shippingAddress: {
      ...medusaAddressToAddress(initialShippingAddress as MedusaAddress),
    },
    shippingAddressId: initialShippingAddressId,
  };

  const form = useRemixForm({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues,
    fetcher: checkoutAccountDetailsFormFetcher,
    submitConfig: {
      method: 'post',
      action: '/api/checkout/account-details',
    },
  });


  const shippingAddress = form.watch('shippingAddress');

  useEffect(() => {
    if (isActiveStep && !isSubmitting && !hasErrors && isComplete) {
      // form.reset();
      goToNextStep();
    }
  }, [isSubmitting, isComplete]);

  const handleCancel = () => {
    goToNextStep();
  };
  const fetcher = useFetcher();

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({
        regionId,
      }),
      { method: 'post', action: '/api/region' },
    );
  };

  const showCompleted = isComplete && !isActiveStep;
  const onCountryChange = (value: string) => {
    const country = region.countries?.some((country: StoreRegionCountry) => country.iso_2 === value);
    if (!country) {
      const region = regions?.find((region: StoreRegion) => region.countries?.some((country: StoreRegionCountry) => country.iso_2 === value));
      onRegionChange(region?.id ?? '');
    }
    form.setValue('shippingAddress.countryCode', value);
  };

  return (
    <div className="checkout-account-details">
      <CheckoutSectionHeader completed={showCompleted} setStep={setStep} step={CheckoutStep.ACCOUNT_DETAILS}>
        {t('checkout.accountDetails')}
      </CheckoutSectionHeader>
      {!isActiveStep && isComplete && (
        <AddressDisplay title={t('checkout.shippingAddress')} address={shippingAddress} countryOptions={countryOptions} />
      )}

      {isActiveStep && (
        <>
          {customer?.email ? (
            <p className="mt-2 text-sm mb-2">{t('checkout.toGetStartedSelect')}</p>
          ) : (
            <p className="mt-2 text-sm mb-4">{t('checkout.toGetStartedEnter')}</p>
          )}

          <RemixFormProvider {...form}>
            <checkoutAccountDetailsFormFetcher.Form id="checkout-account-details-form" onSubmit={form.handleSubmit}>
              <TextField type="hidden" name="cartId" />
              <TextField type="hidden" name="customerId" />

              <StyledTextField
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('checkout.emailAddressPlaceholder')}
                label={t('checkout.emailAddress')}
                className="[&_input]:!ring-0 mb-2"
              />

              <StyledTextField type="hidden" name="shippingAddressId" value={initialShippingAddressId} />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <StyledTextField
                    name="shippingAddress.firstName"
                    type="text"
                    label={t('checkout.firstName')}
                    placeholder={t('checkout.firstNamePlaceholder')}
                  />

                </div>

                <div>
                  <StyledTextField
                    name="shippingAddress.lastName"
                    type="text"
                    label={t('checkout.lastName')}
                    placeholder={t('checkout.lastNamePlaceholder')}
                  />

                </div>
              </div>

              <div className="mt-4">
                <StyledTextField
                  name="shippingAddress.company"
                  type="text"
                  label={t('checkout.company')}
                  placeholder={t('checkout.companyPlaceholder')}
                />
              </div>

              <div className="mt-4">
                <StyledTextField
                  name="shippingAddress.address1"
                  type="text"
                  label={t('checkout.address')}
                  placeholder={t('checkout.addressPlaceholder')}
                />

              </div>

              <div className="mt-4">
                <StyledTextField
                  name="shippingAddress.address2"
                  type="text"
                  label={t('checkout.apartmentSuite')}
                  placeholder={t('checkout.apartmentSuitePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <StyledTextField
                    name="shippingAddress.city"
                    type="text"
                    label={t('checkout.city')}
                    placeholder={t('checkout.cityPlaceholder')}
                  />

                </div>

                <div>
                  <StyledTextField
                    name="shippingAddress.province"
                    type="text"
                    label={t('checkout.province')}
                    placeholder={t('checkout.provincePlaceholder')}
                  />

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <StyledTextField
                    name="shippingAddress.postalCode"
                    type="text"
                    label={t('checkout.postalCode')}
                    placeholder={t('checkout.postalCodePlaceholder')}
                  />

                </div>

                <div>
                  <div className='form-item grid gap-2 w-full [&_input]:!h-12 [&_input]:border-gray-200 [&_input]:!bg-white [&_input]:text-[16px] [&_input]:shadow-sm [&_input]:!ring-0 [&_input:-webkit-autofill]:!transition-[background-color_5000s_ease-in-out_0s] [&_input:-webkit-autofill]:!shadow-[0_0_0_1000px_white_inset] [&_label]:text-[16px] [&_label]:text-gray-600'>
                    <Label htmlFor="country">{t('checkout.country')}</Label>
                    <Select
                      className='h-12 w-full rounded-md border border-gray-300 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
                      options={contriesOptions ?? [] as SelectOption[]}
                      value={shippingAddress?.countryCode}
                      onValueChange={(value) => onCountryChange(value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <StyledTextField
                  name="shippingAddress.phone"
                  type="tel"
                  label={t('checkout.phone')}
                  placeholder={t('checkout.phonePlaceholder')}
                />
              </div>

              {/* <FormError /> */}

              <Actions>
                <SubmitButton disabled={isSubmitting || isCartMutating}>
                  {isSubmitting ? t('checkout.saving') : t('checkout.saveAndContinue')}
                </SubmitButton>

                {isComplete && (
                  <Button disabled={isSubmitting} onClick={handleCancel}>
                    {t('checkout.cancelEdit')}
                  </Button>
                )}
              </Actions>
            </checkoutAccountDetailsFormFetcher.Form>
          </RemixFormProvider>
        </>
      )}
    </div>
  );
};
