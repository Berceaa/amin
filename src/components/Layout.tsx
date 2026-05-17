import { useState, type FormEvent } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import LanguageSwitcher from './LanguageSwitcher';
import CartDrawer from './CartDrawer';
import PawTrail from './PawTrail';
import MiniMascot from './MiniMascot';
import Sidebar from './Sidebar';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { t } = useI18n();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  const promo = t('promo') as string;
  const searchPlaceholder = t('nav.search') as string;

  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = searchTerm.trim();

    if (!value) {
      navigate('/products');
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="premium-shell min-h-screen bg-[#fffaf6] text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="premium-promo bg-[#d95f1f] px-4 py-2 text-center text-sm font-medium text-white">
        {promo}
      </div>

      <header className="sticky top-0 z-30 border-b border-orange-300 bg-[#f27128] text-white shadow-[0_10px_30px_rgba(15,23,42,0.10)]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((current) => !current)}
            aria-label="Toggle menu"
            className="rounded-full border border-white/30 bg-white/15 px-3 py-2 text-xl text-white shadow-sm transition hover:bg-white/25"
          >
            ☰
          </button>

          <form onSubmit={handleSearchSubmit} className="hidden min-w-[260px] flex-1 md:block">
            <div className="flex items-center rounded-full border border-white/30 bg-white px-4 py-2.5 shadow-sm">
              <span className="mr-2 text-[#f27128]">🔎</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="ml-3 rounded-full bg-[#f27128] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#d95f1f]"
              >
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={openCart}
              className={`relative rounded-full border border-white/30 bg-white px-4 py-3 text-sm font-bold !text-[#f27128] shadow-sm transition hover:bg-orange-50 hover:!text-[#d95f1f] ${
                itemCount > 0 ? 'cart-bounce premium-glow-ring' : 'wag-hover'
              }`}
            >
              <span className="mr-2">🛒</span>
              {t('cart.title') as string}

              {itemCount > 0 && (
                <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[#f27128] px-1.5 py-0.5 text-xs font-bold text-white ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              to="/login"
              className="rounded-full border border-white/30 bg-white px-5 py-3 text-sm font-black !text-[#f27128] shadow-sm transition hover:bg-orange-50 hover:!text-[#d95f1f]"
            >
              {user ? (t('nav.account') as string) : (t('nav.login') as string)}
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="border-t border-white/20 px-4 pb-4 md:hidden">
          <div className="flex items-center rounded-full border border-white/30 bg-white px-4 py-2.5 shadow-sm">
            <span className="mr-2 text-[#f27128]">🔎</span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="ml-3 rounded-full bg-[#f27128] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#d95f1f]"
            >
              Search
            </button>
          </div>
        </form>
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
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              {t('footer.blurb') as string}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">
              {t('footer.quickLinks') as string}
            </h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link className="page-link wag-hover" to="/">
                Home
              </Link>

              <Link className="page-link wag-hover" to="/products">
                {t('nav.products') as string}
              </Link>

              <Link className="page-link wag-hover" to="/contact-us">
                {t('nav.contactUs') as string}
              </Link>

              <Link className="page-link wag-hover" to="/login">
                {t('nav.login') as string}
              </Link>

              <Link className="page-link wag-hover" to="/register">
                {t('nav.register') as string}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">
              {t('footer.help') as string}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>elworld9999@gmail.com</p>
              <p>+40 787 807 731</p>
              <p>Dragonul Rosu 7, Stand Nr.286Bucharest, Romania</p>
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