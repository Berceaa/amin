import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import LanguageSwitcher from './LanguageSwitcher';
import CartDrawer from './CartDrawer';
import PawTrail from './PawTrail';
import MiniMascot from './MiniMascot';
import Sidebar from './Sidebar';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const categoryKeys = ['dogs', 'cats', 'smallPets', 'fish', 'birds'] as const;

export default function Layout() {
  const { t } = useI18n();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const promo = t('promo') as string;
  const searchPlaceholder = t('nav.search') as string;
  const location = useLocation();

  return (
    <div className="premium-shell min-h-screen bg-[#fffaf6] text-slate-900 lg:pl-72">
      <Sidebar />
      <div className="premium-promo bg-[#f27128] px-4 py-2 text-center text-sm font-medium text-white">{promo}</div>

      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 lg:px-6">
          <Link to="/" className="premium-logo-glow wag-hover flex items-center gap-3">
            <img src={logo} alt="Pawsentials" className="h-10 w-auto" />
          </Link>

          <div className="hidden min-w-[220px] flex-1 lg:block">
            <div className="premium-search rounded-full border border-orange-100 bg-[#fff7f1] px-4 py-3 text-sm text-slate-500 shadow-inner">
              {searchPlaceholder}
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink className={navClassName} to="/products">{t('nav.products') as string}</NavLink>
            <NavLink className={navClassName} to="/contact-us">{t('nav.contactUs') as string}</NavLink>
            {user ? (
              <NavLink className={navClassName} to="/login">{t('nav.account') as string}</NavLink>
            ) : (
              <>
                <NavLink className={navClassName} to="/login">{t('nav.login') as string}</NavLink>
                <NavLink className={navClassName} to="/register">{t('nav.register') as string}</NavLink>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={openCart}
              className={`premium-icon-button relative rounded-full border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-orange-300 hover:text-[#f27128] ${itemCount > 0 ? 'cart-bounce premium-glow-ring' : 'wag-hover'}`}
            >
              <span className="mr-2">🛒</span>
              {t('cart.title') as string}
              {itemCount > 0 && (
                <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[#f27128] px-1.5 py-0.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              to={user ? '/checkout' : '/login'}
              className="page-link paw-button premium-cta rounded-full bg-[#f27128] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(242,113,40,0.28)] transition hover:-translate-y-0.5"
            >
              {user ? 'Checkout' : (t('nav.login') as string)}
            </Link>
          </div>
        </div>

        <div className="border-t border-orange-100 bg-[#fffaf6]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
            <span className="mr-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{t('nav.categories') as string}</span>
            {categoryKeys.map((item) => (
              <Link
                key={item}
                to={`/products?category=${encodeURIComponent(t(`nav.${item}`) as string)}`}
                className="page-link wag-hover rounded-full border border-orange-100 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-orange-300 hover:text-[#f27128]"
              >
                {t(`nav.${item}`) as string}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="relative isolate overflow-hidden">
        <div key={location.pathname} className="page-reveal relative z-10">
          <Outlet />
        </div>
      </main>

      <CartDrawer />
      <MiniMascot />

      <footer className="relative mt-20 overflow-hidden border-t border-orange-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-6">
          <div>
            <img src={logo} alt="Pawsentials" className="h-10 w-auto" />
            <PawTrail className="mt-4" size="sm" />
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">{t('footer.blurb') as string}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">{t('footer.quickLinks') as string}</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link className="page-link wag-hover" to="/">Home</Link>
              <Link className="page-link wag-hover" to="/products">{t('nav.products') as string}</Link>
              <Link className="page-link wag-hover" to="/contact-us">{t('nav.contactUs') as string}</Link>
              <Link className="page-link wag-hover" to="/login">{t('nav.login') as string}</Link>
              <Link className="page-link wag-hover" to="/register">{t('nav.register') as string}</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">{t('footer.help') as string}</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>contact@pawsentials.ro</p>
              <p>+40 741 000 111</p>
              <p>Bucharest, Romania</p>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-100 px-4 py-4 text-center text-xs text-slate-500">
          © 2026 Pawsentials. {t('footer.rights') as string}
        </div>
      </footer>
    </div>
  );
}

function navClassName({ isActive }: { isActive: boolean }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-orange-50 text-[#f27128]' : 'text-slate-700 hover:bg-orange-50 hover:text-[#f27128]'
  }`;
}
