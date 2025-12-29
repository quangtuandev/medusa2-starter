import { Container } from '@app/components/common/container';
import Hero from '@app/components/sections/Hero';
import { getMergedPageMeta } from '@libs/util/page';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

const locations: LocationProps[] = [
  {
    country: 'Viet Nam',
    items: [
      {
        title: 'SOMEWHERE',
        addressLines: '1105 S. Lamar Blvd, Austin, TX 78704',
        infor: [
          {
            name: 'Phone',
            value: '0909090909'
          }
        ]
      }
    ]
  },
  {
    country: 'FRANCE',
    items: [
      {
        title: 'SOMEWHERE',
        addressLines: '1105 S. Lamar Blvd, Austin, TX 78704',
        infor: [
          {
            name: 'Phone',
            value: '0909090909'
          }
        ]
      }
    ]
  },
  {
    country: 'USA',
    items: [
      {
        title: 'SOMEWHERE',
        addressLines: '1105 S. Lamar Blvd, Austin, TX 78704',
        infor: [
          {
            name: 'Phone',
            value: '0909090909'
          }
        ]
      }
    ]
  }
];

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

type LocationProps = {
  country: string;
  items: {
    title: string;
    addressLines: string;
    infor: {
      name: string;
      value: string;
    }[];
  }[];
};

const Location = ({ country, items }: LocationProps) => {
  return (
    <div className='rounded-[76px] shadow-[7px_8px_15px_0px_#F4C5D854] px-[90px] py-[45px]'>
      <div className="flex flex-col gap-6 xl:gap-12 pb-12 xl:pb-0 ">
        <div className="w-full h-full flex">
          <h3 className="text-[40px] font-extrabold leading-[53px] uppercase font-title">{country}</h3>
        </div>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.title}>
              <p className='font-title font-extrabold text-[24px] leading-[53px] uppercase'>{item.title}</p>
              <p className='font-title font-normal text-[#716E6E] text-[18px] leading-[53px] uppercase'>{item.addressLines}</p>
              <p>
                {item.infor.map((infor) =>
                  <a href={infor.value} className="rounded-[38px] gap-2 py-[6px] px-[20px] bg-[#FCEE21]">
                    <span className='font-title font-normal text-[#716E6E] text-[10px] leading-[53px]'>{infor.name}</span>
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function IndexRoute() {

  return (
    <Container className="flex flex-col gap-6 xl:gap-12 pb-12 xl:pb-12">
      <div className="flex flex-col gap-2 xl:gap-4">
        <h1 className="text-4xl font-title font-extrabold xl:text-[110px] leading-normal xl:leading-[114px] tracking-0% text-center">THIS IS OUR</h1>
        <p className="text-4xl font-centuryBook italic xl:text-[125px] leading-normal xl:leading-[114px] text-center">Stores</p>
        <p className="text-base font-montserrat font-normal text-sm xl:text-[15px] leading-normal xl:leading-[26px] text-center max-w-3xl mx-auto">KIRA fragrances are available at our partner stockists below.
          Please check with each store on stock availability before your visit.</p>
      </div>
      <div className="flex flex-col gap-6 xl:gap-12">
        {locations.map((location) => (
          <Location key={location.country} country={location.country} items={location.items} />
        ))}

      </div>
    </Container>
  );
}
