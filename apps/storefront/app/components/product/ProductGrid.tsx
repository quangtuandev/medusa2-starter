import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { useEffect, useState, type FC } from "react";
import { NavLink, useNavigation } from "react-router";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import {
  ProductListHeader,
  type ProductListHeaderProps,
} from "./ProductListHeader";
import { ProductListItem } from "./ProductListItem";

export interface ProductListProps extends Partial<ProductListHeaderProps> {
  products?: StoreProduct[];
  className?: string;
}

export const ProductGrid: FC<ProductListProps> = ({
  heading,
  actions,
  products,
  className = "grid grid-cols-2 gap-2 lg:gap-y-6 @md:grid-cols-2 lg:gap-x-[6vw] @2xl:!grid-cols-3 ",
}) => {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  if (!products) return <ProductGridSkeleton length={5} />;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMobileDevice =
      window.innerWidth <= 768 || // Tablet and below
      'ontouchstart' in window || // Touch device
      navigator.maxTouchPoints > 0 || // Touch device
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    setIsMobile(isMobileDevice);
  }, []);
  return (
    <div
      className={clsx("@container", {
        "animate-pulse": isLoading,
      })}
    >
      <ProductListHeader heading={heading} actions={actions} />

      <div className={className}>
        {products?.map((product) => (
          <NavLink
            prefetch="viewport"
            key={product.id}
            to={`/products/${product.handle}`}
            viewTransition
            className="transition-transform duration-300 hover:scale-110"
          >
            {({ isTransitioning }) => (
              <ProductListItem
                isTransitioning={isTransitioning}
                product={product}
                isMobile={isMobile}
                forcedZoom={isMobile ? 0.2 : undefined}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// required for lazy loading this component
export default ProductGrid;
