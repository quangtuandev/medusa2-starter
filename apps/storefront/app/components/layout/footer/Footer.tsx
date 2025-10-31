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
import { Link, useFetcher } from 'react-router';
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
      <Container className='flex flex-col gap-[72px]'>
        <LogoStoreName theme="dark" />
        <div className="flex justify-center gap-[72px]">
          {footerNavigationItems.map((item) => (
            <div key={item.id}>
              <Link to={item.url} className="hover:underline text-white text-[24px] font-alexandria font-regular leading-[145%] tracking-normal">{item.label}</Link>
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
          <span className='text-[18.56px] font-alexandria font-regular leading-[145%] tracking-normal flex-1'>© 2025 KIRA</span>
          <div className='flex-1 flex justify-center'>
            <SocialIcons siteSettings={settings} />
          </div>
          <p className='text-end flex-1 text-[18.56px] font-alexandria font-regular leading-[145%] tracking-normal inline-block'>Designed by <Link to="https://mayday-creative.com" target="_blank" className="hover:underline text-white text-[24px] font-alexandria font-regular leading-[145%] tracking-normal">Mayday</Link></p>
        </div>
      </Container>
    </footer>
  );
};
