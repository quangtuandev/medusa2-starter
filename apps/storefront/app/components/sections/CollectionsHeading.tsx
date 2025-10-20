import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

export interface CollectionsHeadingProps
  extends HTMLAttributes<HTMLHeadingElement> {}

export const CollectionsHeading: FC<CollectionsHeadingProps> = ({
  className,
  ...props
}) => (
  <h1
    className={clsx(
      "max-w-full break-words text-4xl font-bold md:text-6xl font-ballet",
      className
    )}
    {...props}
  />
);
