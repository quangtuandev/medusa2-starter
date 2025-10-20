import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { Container } from '@app/components/common/container/Container';
import { Select } from '@app/components/common/forms/inputs/Select';
import { URLAwareNavLink } from '@app/components/common/link/URLAwareNavLink';
import { NewsletterSubscription } from '@app/components/newsletter/Newsletter';
import { useRegion } from '@app/hooks/useRegion';
import { useRegions } from '@app/hooks/useRegions';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { convertToFormData } from '@libs/util/forms/objectToFormData';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useFetcher } from 'react-router';
import { StripeSecurityImage } from '../../images/StripeSecurityImage';
import { SocialIcons } from './SocialIcons';

export const Footer = () => {
  const { footerNavigationItems, settings } = useSiteDetails();
  const rootData = useRootLoaderData();
  const hasProducts = rootData?.hasPublishedProducts;
  const fetcher = useFetcher();
  const { regions } = useRegions();
  const { region } = useRegion();

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      label: `${region.name} (${region.currency_code})`,
      value: region.id,
    }));
  }, [regions]);

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({
        regionId,
      }),
      { method: 'post', action: '/api/region' },
    );
  };

  return (
    <footer className="bg-black min-h-[140px] py-8 text-white">
      <Container>
        <LogoStoreName theme="dark" />
      </Container>
    </footer>
  );
};
