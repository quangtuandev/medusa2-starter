import clsx from "clsx";
export const ComingCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {

    return (
        <div className={clsx("flex overflow-hidden w-full h-full", className)} to="/collections">
            <img src="/assets/images/home/coming-collection.gif" className="object-cover w-full h-full" alt="Coming Collection" />
        </div>
    );
};

