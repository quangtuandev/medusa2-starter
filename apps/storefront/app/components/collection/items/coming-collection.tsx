import clsx from "clsx";
export const ComingCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {

    return (
        <div className={clsx("flex overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className)} to="/collections">
            <img src="/assets/images/home/coming-collection.gif" className="scale-110 object-cover" alt="Coming Collection" />
        </div>
    );
};

