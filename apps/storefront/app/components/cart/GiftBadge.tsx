import { useI18n } from '@app/hooks/useI18n';
import type { FC } from 'react';

export const GiftBadge: FC = () => {
  const { t } = useI18n();
  return (
    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-800">
      {t('cart.gift.badge')}
    </span>
  );
};
