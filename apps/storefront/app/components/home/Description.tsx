import React, { FC } from 'react'
import { useI18n } from '@app/hooks/useI18n';

interface DescriptionProps {
    className?: string;
    description?: string;
}

export const Description: FC<DescriptionProps> = ({ className, description }) => {
    const { t } = useI18n();

    return (
        <div className={className}><div className="z-[12] min-h-[180px]">
            <p className="max-w-4xl text-center font-body font-normal text-[#000] text-lg">
                {description || t('home.default.description')}
            </p>
        </div>
        </div>
    );
};