import { CartDrawer } from "@app/components/cart/CartDrawer";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { useMatches } from "react-router";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import Cursor from "../common/Cursor";
export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  const hiddenHeaderFooterPaths = ["/", "/pick-a-card", "/stories"];
  const hiddenFooterPaths = ["/", "/pick-a-card", "/", "/stories", "/products"];
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isHiddenHeaderFooter = hiddenHeaderFooterPaths.includes(currentMatch?.pathname || "");
  const isHiddenFooter = hiddenFooterPaths.includes(currentMatch?.pathname || "");

  return (
    <div
      className={clsx(
        "page-layout flex min-h-screen flex-col bg-white",
        className
      )}
    >
      <Cursor />
      <CartDrawer />
      {!isHiddenHeaderFooter && <Header />}
      <main className="flex-auto">
        <div className="w-full">{children}</div>
      </main>
      {!isHiddenFooter && <Footer />}
    </div>
  );
};
