import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useI18n } from '../context/I18nContext';

const items = [
  { to: '/', key: 'nav.home', icon: '🏠' },
  { to: '/products', key: 'nav.products', icon: '🛍️' },
  { to: '/how-to-purchase', key: 'nav.howToPurchase', icon: '🧾' },
  { to: '/transport-delivery', key: 'nav.delivery', icon: '📦' },
  { to: '/contact-us', key: 'nav.contactUs', icon: '☎️' },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation overlay"
        className={`fixed inset-0 z-[9998] bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-[9999] flex h-screen w-[280px] max-w-[calc(100vw-2rem)] flex-col border-r border-orange-300 bg-[#f27128] px-5 py-6 text-white shadow-[18px_0_45px_rgba(15,23,42,0.18)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] bg-white/15 px-4 py-4">
          <img src={logo} alt="Pawsentials" className="h-10 w-auto" />

          {isOpen && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-full border border-white/30 bg-white px-3 py-2 text-sm font-black text-[#f27128] transition hover:bg-orange-50"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? '!bg-white !text-[#f27128] shadow-[0_12px_26px_rgba(15,23,42,0.18)]'
                    : '!text-white hover:bg-white/15'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-lg ${isActive ? 'text-[#f27128]' : 'text-white'}`}>
                    {item.icon}
                  </span>

                  <span className={`${isActive ? 'text-[#f27128]' : 'text-white'}`}>
                    {t(item.key) as string}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-white/20 bg-white/15 p-4">
          <p className="text-sm font-black text-white">Pickup only</p>
          <p className="mt-1 text-xs leading-5 text-orange-50">
            Online order, fast in-store pickup.
          </p>
        </div>
      </aside>
    </>,
    document.body,
  );
}