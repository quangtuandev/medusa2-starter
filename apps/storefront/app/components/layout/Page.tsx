import { CartDrawer } from "@app/components/cart/CartDrawer";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { useMatches } from "react-router";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import Cursor from "../common/Cursor";
import { LiveChatIcon } from "../contact/livechat";
import { useCart } from "@app/hooks/useCart";
export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  const hiddenHeaderPaths = ["/", "/pick-a-card", "/stories"];
  const hiddenFooterPaths = ["/", "/pick-a-card", "/", "/stories", "/products"];
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isHiddenHeader = hiddenHeaderPaths.includes(currentMatch?.pathname || "");
  const isHiddenFooter = hiddenFooterPaths.includes(currentMatch?.pathname || "");
  const { toggleCartDrawer } = useCart();

  return (
    <div
      className={clsx(
        "page-layout flex min-h-screen flex-col bg-white",
        className
      )}
    >
      <Cursor />
      <CartDrawer />
      {!isHiddenHeader && <Header />}
      <main className="flex-auto">
        <div className="w-full">{children}</div>
      </main>
      {!isHiddenFooter && <Footer />}
      {!isHiddenHeader && (
        <>
          <LiveChatIcon
            config={{
              facebook: 'https://m.me/@kiraparfum',
              zalo: 'https://zalo.me/your-phone-number'
            }}
          />
          <div className="fixed bottom-6 right-6 z-50">
            <button onClick={() => toggleCartDrawer(true)} className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
              <span>
                <img src="/assets/images/cart.svg" alt="Chat" className="w-32 h-32" />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
