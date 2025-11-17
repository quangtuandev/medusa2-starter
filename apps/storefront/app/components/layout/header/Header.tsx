import { LogoStoreName } from "@app/components/LogoStoreName/LogoStoreName";
import { IconButton } from "@app/components/common/buttons";
import { Container } from "@app/components/common/container/Container";
import { URLAwareNavLink } from "@app/components/common/link";
import { useCart } from "@app/hooks/useCart";
import { useRootLoaderData } from "@app/hooks/useRootLoaderData";
import { useSiteDetails } from "@app/hooks/useSiteDetails";
import { ChevronDownIcon, Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { type FC, useState } from "react";
import { HeaderSideNav } from "./HeaderSideNav";
import { useActiveSection } from "./useActiveSection";
import { ProductSearch } from "@app/components/product/Search";
import { CollectionMenuList } from "@app/components/collection/collection-menu-list";

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
  const { headerNavigationItems } = useSiteDetails();
  const { cart, toggleCartDrawer } = useCart();
  const { activeSection } = useActiveSection(headerNavigationItems);
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader?.hasPublishedProducts;
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);
  if (!headerNavigationItems) return <>Loading...</>;

  const openSubmenu = () => {
    setSubmenuOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 mkt-header bg-white mt-8">
      <nav aria-label="Top">
        <div className="bg-transparent">
          <div className="">
            <Container>
              <div
                className={clsx(
                  "flex sm:h-[var(--mkt-header-height-desktop)] flex-nowrap items-center justify-between gap-2 py-2 px-4 bg-white border-[4px] border-[#FFE977] rounded-full xl:px-[96px]"
                )}
              >
                <div className="flex flex-wrap-reverse justify-between w-full items-center">
                  <LogoStoreName className="h-8 lg:h-14" primary />
                  {headerNavigationItems && (
                    <>
                      {headerNavigationItems
                        .slice(0, 6)
                        .map(({ id, new_tab, ...navItemProps }, index) => (
                          <>
                            <URLAwareNavLink
                              key={id}
                              {...navItemProps}
                              newTab={new_tab}
                              className={({ isActive }) =>
                                clsx(
                                  "my-4 hidden xl:flex items-center whitespace-nowrap font-normal font-body font-regular text-[24px] leading-none tracking-normal"
                                )
                              }
                              prefetch="viewport"
                            >
                              {navItemProps.label}
                              {index == 0 && (
                                <IconButton
                                  aria-label="open navigation menu"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openSubmenu();
                                  }}
                                  className="hover:!bg-primary-50 focus:!bg-primary-50 text-white"
                                  icon={ChevronDownIcon}
                                />
                              )}
                            </URLAwareNavLink>
                          </>
                        ))}
                    </>
                  )}

                  <div className="hidden xl:flex items-center justify-end">
                    <div className="flex items-center gap-x-3 text-sm">
                      <IconButton
                        aria-label="open shopping cart"
                        className="hover:!bg-transparent hidden sm:mr-0.5 sm:inline-flex"
                        iconProps={{
                          className:
                            "hover:!bg-transparent hover:text-gray-700 focus:text-gray-700",
                        }}
                        icon={(iconProps) => (
                          <div className="relative">
                            <ShoppingCartIcon
                              {...iconProps}
                              className={clsx(iconProps.className)}
                            />
                            {!!cart &&
                              hasProducts &&
                              cart.items &&
                              cart.items.length > 0 && (
                                <span className="absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-xs font-bold">
                                  <span>
                                    {cart.items.reduce(
                                      (acc, item) => acc + item.quantity,
                                      0
                                    )}{" "}
                                    <span className="sr-only">
                                      items in cart, view bag
                                    </span>
                                  </span>
                                </span>
                              )}
                          </div>
                        )}
                        onClick={() => toggleCartDrawer(true)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <IconButton
                      aria-label="search"
                      onClick={() => setSearchOpen(true)}
                      className="hover:!bg-primary-50 focus:!bg-primary-50 !text-[#8F9192] bg-[#FFE977] rounded-full p-2 w-[64px]"
                      icon={MagnifyingGlassIcon}
                    />
                    {!!headerNavigationItems?.length && (
                      <IconButton
                        aria-label="open navigation menu"
                        onClick={() => setSideNavOpen(true)}
                        className="hover:!bg-primary-50 focus:!bg-primary-50 sm:inline-flex text-white md:hidden"
                        icon={Bars3Icon}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </nav>
      <ProductSearch open={searchOpen} setOpen={setSearchOpen} />
      <HeaderSideNav
        activeSection={activeSection}
        open={sideNavOpen}
        setOpen={setSideNavOpen}
      />
      <CollectionMenuList open={submenuOpen} setOpen={setSubmenuOpen} />
    </header>
  );
};
