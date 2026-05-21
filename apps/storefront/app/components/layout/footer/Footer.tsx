import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { Container } from '@app/components/common/container/Container';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { useI18n } from '@app/hooks/useI18n';
import { Link } from 'react-router';
import { SocialIcons } from './SocialIcons';

export const Footer = () => {
  const { footerNavigationItems, settings } = useSiteDetails();
  const { t } = useI18n();

  return (
    <footer className="bg-black min-h-[140px] py-8 text-white">
      <Container className='flex flex-col lg:gap-[72px] gap-12'>
        <LogoStoreName theme="dark" />
        <div className="flex justify-center gap-4 xl:gap-[72px] flex-wrap">
          {footerNavigationItems.map((item) => (
            <div key={item.id}>
              {/* t() returns the key itself if no translation found, so CMS page titles work as-is */}
              <Link to={item.url} className="hover:underline text-white text-base xl:text-[24px] font-alexandria font-regular leading-[145%] tracking-normal">{t(item.label, item.label)}</Link>
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
          <span className='lg:text-[18.56px] text-base font-alexandria font-regular leading-[145%] tracking-normal flex-1'>© 2025 KIRA</span>
          <div className='flex-1 flex justify-center'>
            <SocialIcons siteSettings={settings} />
          </div>
          <p className='text-end flex-1 lg:text-[18.56px] text-base font-alexandria font-regular leading-[145%] tracking-normal inline-block'>Designed by <Link to="https://mayday-creative.com" target="_blank" className="hover:underline text-white lg:text-[24px] text-base font-alexandria font-regular leading-[145%] tracking-normal">Mayday</Link></p>
        </div>
      </Container>
    </footer>
  );
};
