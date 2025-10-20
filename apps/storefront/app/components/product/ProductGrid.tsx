import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import type { FC } from "react";
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
  className = "grid grid-cols-1 gap-y-6 @md:grid-cols-2 gap-x-[6vw] @2xl:!grid-cols-3 ",
}) => {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  if (!products) return <ProductGridSkeleton length={5} />;

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
