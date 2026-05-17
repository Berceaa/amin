import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import { useI18n, type Language } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/store';
import { api, formatSubCategory, mapProduct } from '../api/client';

const categoryIcons: Record<string, string> = {
  Dogs: '🐶',
  Cats: '🐱',
  'Cats & Dogs': '🐾',
};

const vatLabels: Record<Language, string> = {
  ro: 'TVA inclus',
  en: 'incl. VAT',
  pl: 'z VAT',
  zh: '含增值税',
};

const allSubcategoryLabels: Record<Language, string> = {
  ro: 'Toate subcategoriile',
  en: 'All subcategories',
  pl: 'Wszystkie podkategorie',
  zh: '全部子分类',
};

export default function ProductsPage() {
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const allCategory = t('productsPage.all') as string;
  const allSubcategories = allSubcategoryLabels[language];

  const initialCategory = searchParams.get('category') ?? allCategory;
  const initialSearch = searchParams.get('search') ?? '';
  const initialSubCategory = searchParams.get('subcategory') ?? allSubcategories;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [query, setQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') ?? allCategory);
    setSelectedSubCategory(searchParams.get('subcategory') ?? allSubcategories);
    setQuery(searchParams.get('search') ?? '');
  }, [searchParams, allCategory, allSubcategories]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await api.getProducts();
        setProducts(result.map(mapProduct));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(
      () => [
        allCategory,
        'Dogs',
        'Cats',
        'Cats & Dogs',
      ],
      [allCategory],
  );

  const subCategories = useMemo(() => {
    const sourceProducts =
        selectedCategory === allCategory
            ? products
            : products.filter((product) => product.category === selectedCategory);

    const values = Array.from(
        new Set(sourceProducts.map((product) => product.subCategory).filter(Boolean)),
    ).sort();

    return [allSubcategories, ...values];
  }, [products, selectedCategory, allCategory, allSubcategories]);

  const updateUrlFilters = (next: {
    category?: string;
    subcategory?: string;
    search?: string;
  }) => {
    const category = next.category ?? selectedCategory;
    const subcategory = next.subcategory ?? selectedSubCategory;
    const search = next.search ?? query;

    const params = new URLSearchParams();

    if (category && category !== allCategory) {
      params.set('category', category);
    }

    if (subcategory && subcategory !== allSubcategories) {
      params.set('subcategory', subcategory);
    }

    if (search.trim()) {
      params.set('search', search.trim());
    }

    setSearchParams(params);
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatches =
        selectedCategory === allCategory ||
        selectedCategory === product.category;

    const subCategoryMatches =
        selectedSubCategory === allSubcategories ||
        selectedSubCategory === product.subCategory;

    const queryMatches = `${product.title} ${product.description} ${product.subCategory} ${product.productCode}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatches && subCategoryMatches && queryMatches;
  });

  return (
      <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
          <PawTrail className="mb-5" size="sm" />

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">
            Catalog
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-900">
            {t('productsPage.title') as string}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {t('productsPage.desc') as string}
          </p>

          <div className="mt-8 grid gap-4">
            <input
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  updateUrlFilters({ search: value });
                }}
                placeholder={t('productsPage.searchPlaceholder') as string}
                className="w-full rounded-full border border-orange-100 bg-[#fffaf6] px-5 py-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-orange-300"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                  <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedSubCategory(allSubcategories);
                        updateUrlFilters({
                          category,
                          subcategory: allSubcategories,
                        });
                      }}
                      className={`wag-hover rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedCategory === category
                              ? 'bg-[#f27128] text-white'
                              : 'border border-orange-100 bg-white text-slate-700'
                      }`}
                  >
                    {category}
                  </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {subCategories.map((subcategory) => (
                  <button
                      key={subcategory}
                      type="button"
                      onClick={() => {
                        setSelectedSubCategory(subcategory);
                        updateUrlFilters({ subcategory });
                      }}
                      className={`wag-hover rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedSubCategory === subcategory
                              ? 'bg-slate-900 text-white'
                              : 'border border-orange-100 bg-white text-slate-700'
                      }`}
                  >
                    {subcategory === allSubcategories ? subcategory : formatSubCategory(subcategory)}
                  </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
            <p className="mt-10 rounded-2xl bg-white p-6 text-center font-semibold text-slate-600">
              Loading products...
            </p>
        )}

        {error && (
            <p className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-center font-semibold text-red-600">
              {error}
            </p>
        )}

        {!loading && !error && (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                  <article
                      key={product.id}
                      className="pet-card overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-sm"
                  >
                    <Link to={`/products/${product.id}`} className="block">
                      <img
                          src={product.image}
                          alt={product.title}
                          className="pet-media h-60 w-full object-cover"
                      />
                    </Link>

                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <div className="pet-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                          {categoryIcons[product.category] ?? '🐾'}
                        </div>

                        <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">
                          {product.tag}
                        </div>
                      </div>

                      <Link to={`/products/${product.id}`} className="block">
                        <h2 className="text-xl font-bold text-slate-900 transition hover:text-[#f27128]">
                          {product.title}
                        </h2>
                      </Link>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {product.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                            {t('productsPage.from') as string} ({vatLabels[language]})
                          </p>

                          <p className="text-xl font-black text-[#f27128]">
                            {product.price}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Link
                              to={`/products/${product.id}`}
                              className="rounded-full border border-orange-200 px-4 py-2 text-center text-sm font-semibold text-[#f27128] transition hover:bg-orange-50"
                          >
                            Details
                          </Link>

                          <button
                              type="button"
                              disabled={product.stock <= 0}
                              onClick={() => addToCart(product)}
                              className="page-link paw-button premium-cta rounded-full bg-[#f27128] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {product.stock > 0 ? (t('productsPage.addToCart') as string) : 'Unavailable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
              ))}

              {filteredProducts.length === 0 && (
                  <p className="rounded-2xl bg-white p-6 text-center font-semibold text-slate-600 md:col-span-2 xl:col-span-3">
                    No products found.
                  </p>
              )}
            </div>
        )}
      </main>
  );
}