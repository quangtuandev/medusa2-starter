import { URLAwareNavLink } from '@app/components/common/link';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { useI18n } from '@app/hooks/useI18n';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { type FC, Fragment } from 'react';

export interface HeaderSideNavProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  activeSection?: string | null;
}

export const HeaderSideNav: FC<HeaderSideNavProps> = ({ open, setOpen, activeSection }) => {
  const { headerNavigationItems } = useSiteDetails() as any;
  const { t } = useI18n();

  return (
    <Transition.Root show={!!open} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen bg-[url('/assets/images/menu/bg-mobile.webp')]">
                  <div className="flex h-full flex-col shadow-xl">
                    <div className="flex-1 px-4 py-6 sm:px-6">
                      <div className="flex justify-between">
                        <Dialog.Title className="text-lg font-bold text-gray-900">
                          <span className="font-title font-bold text-4xl uppercase text-black">This </span>
                          <span className="flex gap-2">
                            <span className="font-title font-bold text-4xl uppercase text-black leading-none ml-1">Is </span>
                            <span className="font-centuryBook italic font-normal text-4xl text-white leading-none mt-1">Our</span>
                          </span>
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            onClick={() => setOpen(false)}
                            className={clsx(
                              'inline-flex items-center justify-center w-[55px] h-[55px] rounded-full transition-all text-[#000000] duration-300 ease-in-out lg:bg-[#FDCEF8] bg-[#FFE977] shadow-[0px_4px_10px_0px_#00000040] absolute top-8 right-4 lg:right-11 z-[9999]'
                            )}
                          >
                            <img src="/assets/images/icons/close.svg" alt="Close" />
                          </button>

                        </div>
                      </div>

                      {!!headerNavigationItems?.length && (
                        <div className="flex flex-grow flex-col">
                          <div className="mt-5 flex flex-grow flex-col">
                            <nav className="flex-1 space-y-3" aria-label="Sidebar">
                              {headerNavigationItems.map(({ id, new_tab, ...navItemProps }) => (
                                <URLAwareNavLink
                                  key={id}
                                  {...navItemProps}
                                  newTab={new_tab}
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    clsx(
                                      'group flex items-center rounded-md px-4 py-3 text-sm font-normal leading-tight',
                                      isActive &&
                                        (!navItemProps.url.includes('#') ||
                                          activeSection === navItemProps.url.split('#')[1].split('?')[0])
                                        ? 'bg-[url("/assets/images/stories/background-story.webp")] bg-contain text-gray-900'
                                        : 'text-gray-600 hover:bg-[url("/assets/images/stories/background-story.webp")] bg-cover bg-center hover:text-gray-900',
                                    )
                                  }
                                  prefetch="viewport"
                                >
                                  <span className="font-title m-auto lg:text-[95px] text-[40px] font-bold uppercase lg:hidden block pointer-events-none text-center lg:absolute text-black lg:text-[#FFE977] lg:text-white lg:leading-[0] z-[9]">{t(navItemProps.label)}</span>
                                </URLAwareNavLink>
                              ))}
                            </nav>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
