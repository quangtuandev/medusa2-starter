import clsx from "clsx";
export const ComingCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {

    return (
        <div className={clsx("flex overflow-hidden w-full h-full", className)} to="/collections">
            <img src="/assets/images/home/coming-collection.gif" className="scale-110 object-cover" alt="Coming Collection" />
        </div>
    );
};

