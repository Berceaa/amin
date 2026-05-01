import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/store';

const categoryIcons: Record<string, string> = {
  Dogs: '🐶',
  Cats: '🐱',
  Fish: '🐠',
  'Small Pets': '🐰',
  Birds: '🦜',
};

export default function ProductsPage() {
  const { t } = useI18n();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? (t('productsPage.all') as string);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');

  const translatedCategories = useMemo(
    () => [t('productsPage.all') as string, t('nav.dogs') as string, t('nav.cats') as string, t('nav.fish') as string, t('nav.smallPets') as string, t('nav.birds') as string],
    [t],
  );

  const normalizedMap = new Map<string, string>([
    [t('nav.dogs') as string, 'Dogs'],
    [t('nav.cats') as string, 'Cats'],
    [t('nav.fish') as string, 'Fish'],
    [t('nav.smallPets') as string, 'Small Pets'],
    [t('nav.birds') as string, 'Birds'],
  ]);

  const filteredProducts = products.filter((product) => {
    const categoryMatches =
      selectedCategory === (t('productsPage.all') as string) || normalizedMap.get(selectedCategory) === product.category;
    const queryMatches = `${product.title} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatches && queryMatches;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
        <PawTrail className="mb-5" size="sm" />
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Catalog</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">{t('productsPage.title') as string}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t('productsPage.desc') as string}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('productsPage.searchPlaceholder') as string}
            className="w-full rounded-full border border-orange-100 bg-[#fffaf6] px-5 py-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-orange-300"
          />
          <div className="flex flex-wrap gap-2">
            {translatedCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`wag-hover rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category ? 'bg-[#f27128] text-white' : 'border border-orange-100 bg-white text-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <article key={product.id} className="pet-card overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-sm">
            <img src={product.image} alt={product.title} className="pet-media h-60 w-full object-cover" />
            <div className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="pet-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  {categoryIcons[product.category] ?? '🐾'}
                </div>
                <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{product.tag}</div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{product.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{t('productsPage.from') as string}</p>
                  <p className="text-xl font-black text-[#f27128]">{product.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="page-link paw-button premium-cta rounded-full bg-[#f27128] px-4 py-2 text-sm font-semibold text-white"
                >
                  {t('productsPage.addToCart') as string}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
