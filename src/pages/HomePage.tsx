import heroDog from '../assets/hero-dog.png';
import paw from '../assets/paw.png';
import paw2 from '../assets/paw-2.png';
import paw3 from '../assets/paw-3.png';
import { Link } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import PremiumPetEffects from '../components/PremiumPetEffects';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/store';

type CardItem = { title: string; text: string };

const featuredIcons = ['🐶', '🐱', '🐾', '🦴'];
const serviceIcons = ['✂️', '🩺', '🏪'];

export default function HomePage() {
  const { t } = useI18n();
  const { addToCart } = useCart();
  const featured = t('cards.featured') as unknown as CardItem[];
  const services = t('cards.services') as unknown as CardItem[];
  const membership = t('cards.membership') as string[];
  const stats = t('hero.stats') as string[];

  return (
    <main>
      <section className="premium-hero relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(242,113,40,0.18),_transparent_30%),linear-gradient(180deg,#fff8f2_0%,#fffaf6_100%)]">
        <PremiumPetEffects density="light" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-6 lg:py-24">
          <div className="relative">
            <div className="premium-light premium-light-left" />
            <div className="premium-light premium-light-right" />
            <PawTrail className="mb-6" />
            <p className="soft-pop premium-pill mb-4 inline-flex rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f27128]">
              {t('hero.eyebrow') as string}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-5xl xl:text-6xl">
              {t('hero.title') as string}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t('hero.description') as string}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="page-link paw-button premium-cta rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(242,113,40,0.28)]">
                {t('hero.primary') as string}
              </Link>
              <Link to="/contact" className="page-link wag-hover rounded-full border border-orange-200 bg-white px-6 py-3 font-semibold text-slate-800">
                {t('hero.secondary') as string}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {stats.map((item) => (
                <div key={item} className="page-link wag-hover rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
              <div className="premium-mascot-card absolute -bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-[1.6rem] border border-white/70 bg-white/75 px-5 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl md:flex">
                <span className="text-2xl">🐾</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f27128]">Pet care concierge</p>
                  <p className="text-sm font-semibold text-slate-700">Premium pickup, grooming and tailored nutrition</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pet-badge absolute -top-3 right-10 z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-orange-100 bg-white text-3xl shadow-xl lg:flex">
              🐶
            </div>
            <div className="pet-badge pet-badge-delay absolute bottom-8 left-0 z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-orange-100 bg-white text-2xl shadow-xl lg:flex">
              🐱
            </div>
            <div className="pet-float absolute -left-4 top-12 hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{t('hero.cards.delivery') as string}</p>
              <p className="mt-2 max-w-[180px] text-sm text-slate-600">{t('hero.cards.repeat') as string}</p>
            </div>
            <div className="pet-float-delay absolute -right-4 bottom-12 hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">Care</p>
              <p className="mt-2 max-w-[180px] text-sm text-slate-600">{t('hero.cards.wellness') as string}</p>
            </div>

            <div className="relative rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <img src={paw} alt="paw decoration" className="paw-step absolute left-5 top-5 h-10 w-10 opacity-40" />
              <img src={paw2} alt="paw decoration" className="paw-step paw-delay-2 absolute right-8 top-12 h-12 w-12 opacity-40" />
              <img src={paw3} alt="paw decoration" className="paw-step paw-delay-3 absolute bottom-6 left-10 h-12 w-12 opacity-40" />
              <PawTrail className="absolute bottom-8 right-8 hidden rotate-12 md:flex" size="sm" />
              <div className="rounded-[1.5rem] bg-[#fff5ee] p-6">
                <img src={heroDog} alt="Happy dog" className="pet-float-slow mx-auto max-h-[460px] w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContentSection title={t('sections.featured') as string} description={t('sections.featuredDesc') as string}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item, index) => (
            <InfoCard key={item.title} title={item.title} text={item.text} icon={featuredIcons[index % featuredIcons.length]} />
          ))}
        </div>
      </ContentSection>

      <ContentSection title={t('sections.services') as string} description={t('sections.servicesDesc') as string}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.1fr]">
          {services.map((item, index) => (
            <InfoCard key={item.title} title={item.title} text={item.text} icon={serviceIcons[index % serviceIcons.length]} />
          ))}
        </div>
      </ContentSection>

      <ContentSection title={t('sections.products') as string} description={t('sections.productsDesc') as string}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <article key={product.id} className="pet-card overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-sm">
              <img src={product.image} alt={product.title} className="pet-media h-56 w-full object-cover" />
              <div className="p-6">
                <div className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{product.tag}</div>
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-black text-[#f27128]">{product.price}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="paw-button rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-orange-300 hover:text-[#f27128]"
                  >
                    {t('productsPage.addToCart') as string}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-6">
        <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-[#f27128] px-6 py-10 text-white shadow-[0_30px_70px_rgba(242,113,40,0.35)] lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <PawTrail className="absolute right-6 top-6 opacity-70" size="sm" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">{t('sections.membership') as string}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight">{t('sections.membershipDesc') as string}</h2>
          </div>
          <div className="space-y-3">
            {membership.map((item) => (
              <div key={item} className="page-link wag-hover rounded-2xl bg-white/12 px-4 py-3 text-sm font-medium backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto my-16 max-w-7xl px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm">
          <PawTrail className="mx-auto mb-5 justify-center" size="sm" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">{t('sections.contact') as string}</p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">{t('sections.contactDesc') as string}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="paw-button rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white">{t('nav.contact') as string}</Link>
            <Link to="/products" className="page-link wag-hover rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800">{t('nav.products') as string}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContentSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-6">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Pawsentials</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">{title}</h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function InfoCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <article className="pet-card rounded-[1.75rem] border border-orange-100 bg-white p-6 shadow-sm">
      <div className="pet-icon mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
