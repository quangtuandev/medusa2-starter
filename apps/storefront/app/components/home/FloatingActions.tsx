import { LiveChatIcon } from '@app/components/contact/livechat';
import { useCart } from '@app/hooks/useCart';

/**
 * Homepage v2 floating actions: chat on the left, cart (with the item badge) on
 * the right. Page.tsx already renders the site-wide versions everywhere except
 * the homepage, so these two replace them here.
 */
export const FloatingActions = () => {
  const { cart, toggleCartDrawer } = useCart();

  const itemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) ?? 0;

  return (
    <>
      <LiveChatIcon config={{ facebook: 'https://m.me/@kiraparfum' }} />

      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 sm:right-6">
        <button
          type="button"
          onClick={() => toggleCartDrawer(true)}
          aria-label={`Open cart (${itemCount} items)`}
          className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <img src="/assets/images/cart.svg" alt="" className="xl:w-32 xl:h-32 w-20 h-20" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-kira-brand px-1.5 font-body text-xs font-bold text-white">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
