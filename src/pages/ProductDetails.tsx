import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import { useCart } from '../context/CartContext';
import { useI18n, type Language } from '../context/I18nContext';
import { api, formatSubCategory, mapProduct } from '../api/client';
import type { Product } from '../data/store';

const vatLabels: Record<Language, string> = {
    ro: 'TVA inclus',
    en: 'incl. VAT',
    pl: 'z VAT',
    zh: '含增值税',
};

const categoryIcons: Record<string, string> = {
    Dogs: '🐶',
    Cats: '🐱',
    'Cats & Dogs': '🐾',
};

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const { t, language } = useI18n();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError('');

                const id = Number(productId);

                if (!id || Number.isNaN(id)) {
                    throw new Error('Invalid product id.');
                }

                const result = await api.getProduct(id);
                setProduct(mapProduct(result));
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to load product.');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
                <p className="rounded-2xl bg-white p-6 text-center font-semibold text-slate-600">
                    Loading product...
                </p>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
                <section className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center shadow-sm">
                    <h1 className="text-3xl font-black text-red-600">Product not found</h1>
                    <p className="mt-4 text-red-500">{error || 'This product could not be loaded.'}</p>

                    <Link
                        to="/products"
                        className="mt-6 inline-flex rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white"
                    >
                        Back to products
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <Link
                to="/products"
                className="inline-flex rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-[#f27128] transition hover:bg-orange-50"
            >
                ← Back to products
            </Link>

            <section className="mt-6 grid gap-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
                <div className="overflow-hidden rounded-[1.75rem] bg-[#fffaf6]">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full min-h-[360px] w-full object-cover"
                    />
                </div>

                <div>
                    <PawTrail className="mb-5" size="sm" />

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                            {categoryIcons[product.category] ?? '🐾'}
                        </div>

                        <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f27128]">
              {product.category}
            </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
              {formatSubCategory(product.subCategory)}
            </span>
                    </div>

                    <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900">
                        {product.title}
                    </h1>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        {product.description}
                    </p>

                    <div className="mt-8 rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                            {t('productsPage.from') as string} ({vatLabels[language]})
                        </p>

                        <p className="mt-2 text-4xl font-black text-[#f27128]">
                            {product.price}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                            Product code: <span className="font-semibold text-slate-700">{product.productCode}</span>
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={product.stock <= 0}
                            onClick={() => addToCart(product)}
                            className="page-link paw-button premium-cta rounded-full bg-[#f27128] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {product.stock > 0 ? (t('productsPage.addToCart') as string) : 'Unavailable'}
                        </button>

                        <Link
                            to="/contact-us"
                            className="rounded-full border border-orange-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-orange-300 hover:text-[#f27128]"
                        >
                            Ask about this product
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}