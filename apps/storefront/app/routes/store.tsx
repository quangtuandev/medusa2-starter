import { Container } from '@app/components/common/container';
import Hero from '@app/components/sections/Hero';
import { getMergedPageMeta } from '@libs/util/page';
import { listLocations } from '@libs/util/server/data/locations.server';
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';

export const loader = async () => {
  const locations = await listLocations();
  return locations;
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

type LocationProps = {
  iso_country_code: string;
  country: string;
  items: {
    address_lines: string;
    name: string;
    options: {
      name: string;
      value: string;
      type: string;
    }[]
  }[];
};

const mapTypeToLink = (type: string) => {
  switch (type) {
    case 'email':
      return 'mailto:';
    case 'phone':
      return 'tel:';
    case 'sms':
      return 'sms:';
    case 'text':
    case 'url':
    default:
      return '';
  }
}

const Location = ({ country, items }: LocationProps) => {
  return (
    <div className='xl:rounded-[76px] rounded-3xl shadow-lg border border-[#F4C5D854] xl:px-[90px] px-6 xl:py-[45px] py-6'>
      <div className="flex flex-col gap-6 pb-12 xl:pb-0 ">
        <div className="w-full h-full flex">
          <h3 className="xl:text-[40px] text-[24px] font-extrabold uppercase font-title">{country}</h3>
        </div>
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.address_lines} className='flex flex-col gap-2 xl:gap-4'>
              <p className='font-title font-extrabold xl:text-[24px] text-[18px] uppercase'>{item.name}</p>
              <p className='font-title font-normal text-[#716E6E] xl:text-[18px] text-[14px] uppercase'>{item.address_lines}</p>
              <div className='gap-2 flex flex-wrap'>
                {item.options.map((option) =>
                  <a target={option.type === 'url' ? '_blank' : '_self'} href={`${mapTypeToLink(option.type)}${option.value}`} className="rounded-[38px] gap-2 py-[6px] px-[20px] bg-[#FCEE21] flex items-center">
                    <span className='font-title font-normal text-[#716E6E] text-[10px]'>{option.name}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function IndexRoute() {
  const { locations } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-6 xl:gap-12 pb-12 xl:pb-12">
      <div className="flex flex-col gap-4 xl:gap-6">
        <h1 className="text-3xl font-title font-extrabold xl:text-[110px] leading-normal xl:leading-[114px] tracking-0% text-center">THIS IS OUR</h1>
        <p className="text-3xl font-centuryBook italic xl:text-[125px] leading-normal xl:leading-[114px] text-center">Stores</p>
        <p className="text-base font-montserrat font-normal text-sm xl:text-[15px] leading-normal xl:leading-[26px] text-center max-w-3xl mx-auto">KIRA fragrances are available at our partner stockists below.
          Please check with each store on stock availability before your visit.</p>
      </div>
      <div className="flex flex-col gap-6 xl:gap-12">
        {locations && locations.map((location) => (
          <Location key={location.id} country={location.country} items={location.items} />
        ))}
      </div>
    </Container>
  );
}
