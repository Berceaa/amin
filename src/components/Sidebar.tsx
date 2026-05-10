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

const categories = [
  { to: '/products?category=Dogs', key: 'nav.dogs', icon: '🐶' },
  { to: '/products?category=Cats', key: 'nav.cats', icon: '🐱' },
  { to: '/products?category=Fish', key: 'nav.fish', icon: '🐠' },
  { to: '/products?category=Small%20Pets', key: 'nav.smallPets', icon: '🐹' },
  { to: '/products?category=Birds', key: 'nav.birds', icon: '🦜' },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation overlay"
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-orange-100 bg-white/95 px-5 py-6 shadow-[18px_0_45px_rgba(15,23,42,0.12)] transition-transform duration-300 lg:w-72 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] bg-orange-50 px-4 py-4">
          <img src={logo} alt="Pawsentials" className="h-10 w-auto" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full border border-orange-100 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:text-[#f27128] lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-[#f27128] text-white shadow-[0_12px_26px_rgba(242,113,40,0.22)]'
                    : 'text-slate-700 hover:bg-orange-50 hover:text-[#f27128]'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{t(item.key) as string}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 border-t border-orange-100 pt-6">
          <p className="px-4 text-xs font-black uppercase tracking-[0.22em] text-[#f27128]">
            {t('nav.categories') as string}
          </p>

          <div className="mt-3 space-y-1">
            {categories.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#f27128]"
              >
                <span>{item.icon}</span>
                <span>{t(item.key) as string}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-4">
          <p className="text-sm font-black text-slate-900">Pickup only</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Online order, fast in-store pickup.
          </p>
        </div>
      </aside>
    </>
  );
}