import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import PawTrail from './PawTrail';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function CartDrawer() {
  const { t } = useI18n();
  const { items, isOpen, closeCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, subtotal } = useCart();

  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[9998] bg-slate-950/35 transition-opacity duration-200"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-[9999] flex h-[100dvh] w-full max-w-md flex-col border-l border-orange-100 bg-white shadow-2xl"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-label={t('cart.title') as string}
        aria-hidden={!isOpen}
      >
        <div className="shrink-0 border-b border-orange-100 bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f27128]">Pawsentials</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">{t('cart.title') as string}</h2>
              <PawTrail className="mt-3" size="sm" />
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full border border-orange-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-[#f27128]"
            >
              ✕
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="rounded-full bg-orange-50 px-5 py-4 text-3xl">🛒</div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">{t('cart.emptyTitle') as string}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t('cart.emptyText') as string}</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer-scroll flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-4">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.title} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{item.tag}</p>
                            <h3 className="mt-1 text-sm font-bold text-slate-900">{item.title}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-semibold text-slate-500 transition hover:text-[#f27128]"
                          >
                            {t('cart.remove') as string}
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="h-8 w-8 rounded-full text-lg font-semibold text-slate-700 hover:bg-orange-50"
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="h-8 w-8 rounded-full text-lg font-semibold text-slate-700 hover:bg-orange-50"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-base font-black text-[#f27128]">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-orange-100 bg-white px-5 py-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{t('cart.subtotal') as string}</span>
                <span className="text-2xl font-black text-slate-900">{subtotal.toFixed(2)} lei</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{t('cart.shippingNote') as string}</p>
              <div className="mt-5 grid gap-3">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="rounded-full bg-[#f27128] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]"
                >
                  {t('cart.checkout') as string}
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-[#f27128]"
                >
                  {t('cart.clear') as string}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  );
}
