import { useI18n } from "@app/hooks/useI18n";
import { Link } from "react-router";
import { FC } from "react";
import clsx from "clsx";
import MorphingShape from "@app/components/generativeart/MorphingShape";

export const ShopLink: FC<{ className?: string }> = ({ className }) => {
  const { t } = useI18n();

  return (
    <>
      <div className={clsx("flex items-center flex-col", className)}>
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20">
            <img
              className="animate-rotate-bounce absolute top-0 left-0"
              src="/assets/images/home/cup.svg"
              alt="Cup"
            />
            <img
              className="animate-rotate-bounce-reverse absolute top-0 left-0"
              src="/assets/images/home/cup-bg.svg"
              alt="Cup"
            />
          </div>

          <Link
            to="/collections"
            className="text-4xl font-normal font-title text-white drop-shadow-4xl hover:font-black transition-all duration-300 ease-in-out hover:text-[#F4EB3C] hover:drop-shadow-none hover:rotate-bounce"
          >
            {t("shop")}
          </Link>
        </div>

      </div>
    </>
  );
};
