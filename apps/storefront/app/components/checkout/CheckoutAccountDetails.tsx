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
import { medusaAddressToAddress } from '@libs/util';
import { checkAccountDetailsComplete } from '@libs/util/checkout';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import type { StoreRegion, StoreRegionCountry } from '@medusajs/types';
import { useEffect } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { SubmitButton } from '../common/remix-hook-form/buttons/SubmitButton';
import { CheckoutSectionHeader } from './CheckoutSectionHeader';
import { AddressDisplay } from './address/AddressDisplay';
import { selectInitialShippingAddress } from './checkout-form-helpers';
import { useI18n } from '@app/hooks/useI18n';

const NEW_SHIPPING_ADDRESS_ID = 'new';

export const CheckoutAccountDetails = () => {
  const { t } = useI18n();
  const checkoutAccountDetailsFormFetcher = useFetcher<{
    errors: FieldErrors;
  }>({ key: FetcherKeys.cart.accountDetails });
  const { customer } = useCustomer();
  const { regions } = useRegions();
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
      form.reset();
      goToNextStep();
    }
  }, [isSubmitting, isComplete]);

  const handleCancel = () => {
    goToNextStep();
  };

  const showCompleted = isComplete && !isActiveStep;

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
                  <StyledTextField
                    name="shippingAddress.countryCode"
                    type="text"
                    label={t('checkout.country')}
                    placeholder={t('checkout.countryPlaceholder')}
                  />

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
