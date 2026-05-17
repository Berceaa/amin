import { useEffect, useState, type FormEvent } from 'react';
import { api, type BackendOrder, type BackendProduct } from '../api/client';
import { useAuth } from '../context/AuthContext';

type ProductForm = Omit<BackendProduct, 'productId'>;

const emptyForm: ProductForm = {
    productCode: '',
    productName: '',
    description: '',
    imageUrl: '',
    price: 0,
    stock: 10,
    productCategory: 'DOG',
    productSubCategory: 'TOYS',
};

const subCategories = [
    'LITTER_ACCESSORIES',
    'GROOMING',
    'COLLARS',
    'TOYS',
    'TIES',
    'LITTER_BOX',
    'BOWELS_FEEDER',
    'CARRIERS_TRAVEL',
    'LITTER',
    'BED',
    'LEASH',
    'CLEAN',
    'SCRATCHING_POST',
    'TOWERS',
    'APPAREL',
    'HARNESS',
    'SEATBELT',
    'MUZZLE',
];

export default function AdminPage() {
    const { user } = useAuth();

    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [orders, setOrders] = useState<BackendOrder[]>([]);
    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const loadData = async () => {
        try {
            setError('');
            const [productResult, orderResult] = await Promise.all([
                api.getProducts(),
                api.getAdminOrders(),
            ]);

            setProducts(productResult);
            setOrders(orderResult);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load admin data.');
        }
    };

    useEffect(() => {
        if (isAdmin) {
            loadData();
        }
    }, [isAdmin]);

    if (!user) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
                <section className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-3xl font-black text-slate-900">Admin</h1>
                    <p className="mt-4 text-slate-600">Please login first.</p>
                </section>
            </main>
        );
    }

    if (!isAdmin) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
                <section className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-3xl font-black text-slate-900">Access denied</h1>
                    <p className="mt-4 text-slate-600">Only admins can view this page.</p>
                </section>
            </main>
        );
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const payload: ProductForm = {
                ...form,
                description: form.description?.trim() || '',
            };

            if (editingId) {
                await api.updateProduct(editingId, payload);
                setMessage('Product updated successfully.');
            } else {
                await api.createProduct(payload);
                setMessage('Product created successfully.');
            }

            setForm(emptyForm);
            setEditingId(null);
            await loadData();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to save product.');
        }
    };

    const editProduct = (product: BackendProduct) => {
        setEditingId(product.productId);
        setForm({
            productCode: product.productCode,
            productName: product.productName,
            description: product.description || '',
            imageUrl: product.imageUrl,
            price: product.price,
            stock: product.stock,
            productCategory: product.productCategory,
            productSubCategory: product.productSubCategory,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (productId: number) => {
        const confirmed = window.confirm('Delete this product?');

        if (!confirmed) return;

        try {
            await api.deleteProduct(productId);
            setMessage('Product deleted successfully.');
            await loadData();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to delete product.');
        }
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <section className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Admin</p>
                <h1 className="mt-3 text-4xl font-black text-slate-900">Admin Dashboard</h1>
                <p className="mt-4 text-slate-600">Add, edit, delete products and view order history.</p>
            </section>

            {message && (
                <p className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-[#f27128]">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                </p>
            )}

            <section className="mt-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black text-slate-900">
                    {editingId ? 'Edit product' : 'Add product'}
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Product code"
                        value={form.productCode}
                        onChange={(value) => setForm((current) => ({ ...current, productCode: value }))}
                    />

                    <Input
                        label="Product name"
                        value={form.productName}
                        onChange={(value) => setForm((current) => ({ ...current, productName: value }))}
                    />

                    <Input
                        label="Image URL"
                        value={form.imageUrl}
                        onChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))}
                    />

                    <Input
                        label="Price"
                        type="number"
                        value={String(form.price)}
                        onChange={(value) => setForm((current) => ({ ...current, price: Number(value) }))}
                    />

                    <Input
                        label="Stock"
                        type="number"
                        value={String(form.stock)}
                        onChange={(value) => setForm((current) => ({ ...current, stock: Number(value) }))}
                    />

                    <label className="block text-sm font-semibold text-slate-800">
                        <span className="mb-2 block">Category</span>
                        <select
                            value={form.productCategory}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    productCategory: event.target.value as ProductForm['productCategory'],
                                }))
                            }
                            className="w-full rounded-full border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-orange-300"
                        >
                            <option value="DOG">DOG</option>
                            <option value="CAT">CAT</option>
                            <option value="CAT_AND_DOG">CAT_AND_DOG</option>
                        </select>
                    </label>

                    <label className="block text-sm font-semibold text-slate-800">
                        <span className="mb-2 block">Subcategory</span>
                        <select
                            value={form.productSubCategory}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    productSubCategory: event.target.value,
                                }))
                            }
                            className="w-full rounded-full border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-orange-300"
                        >
                            {subCategories.map((subcategory) => (
                                <option key={subcategory} value={subcategory}>
                                    {subcategory}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-sm font-semibold text-slate-800 md:col-span-2">
                        <span className="mb-2 block">Description</span>
                        <textarea
                            value={form.description || ''}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            rows={5}
                            placeholder="Add a public product description for the product detail page."
                            className="w-full rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-orange-300"
                        />
                    </label>

                    <div className="flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            className="rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]"
                        >
                            {editingId ? 'Update product' : 'Create product'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm(emptyForm);
                                }}
                                className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="mt-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black text-slate-900">Products</h2>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-sm">
                        <thead>
                        <tr className="border-b border-orange-100 text-xs uppercase tracking-[0.15em] text-slate-400">
                            <th className="py-3">Code</th>
                            <th className="py-3">Name</th>
                            <th className="py-3">Description</th>
                            <th className="py-3">Category</th>
                            <th className="py-3">Subcategory</th>
                            <th className="py-3">Price</th>
                            <th className="py-3">Stock</th>
                            <th className="py-3">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map((product) => (
                            <tr key={product.productId} className="border-b border-orange-50">
                                <td className="py-3 font-semibold">{product.productCode}</td>
                                <td className="py-3">{product.productName}</td>
                                <td className="max-w-[260px] truncate py-3 text-slate-500">
                                    {product.description || '-'}
                                </td>
                                <td className="py-3">{product.productCategory}</td>
                                <td className="py-3">{product.productSubCategory}</td>
                                <td className="py-3">{product.price.toFixed(2)} lei</td>
                                <td className="py-3">{product.stock}</td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => editProduct(product)}
                                            className="rounded-full border border-orange-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#f27128]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteProduct(product.productId)}
                                            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black text-slate-900">Order history</h2>

                <div className="mt-6 space-y-4">
                    {orders.length === 0 && (
                        <p className="text-sm text-slate-500">No orders yet.</p>
                    )}

                    {orders.map((order) => (
                        <article key={order.orderId} className="rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-slate-900">Order #{order.orderId}</p>
                                    <p className="mt-1 text-sm text-slate-500">{order.customerEmail}</p>
                                    <p className="mt-1 text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>

                                <p className="text-xl font-black text-[#f27128]">
                                    {order.totalAmount.toFixed(2)} lei
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.orderItemId} className="flex justify-between gap-4 text-sm text-slate-600">
                                        <span>{item.productName} × {item.quantity}</span>
                                        <span>{item.totalPrice.toFixed(2)} lei</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

function Input({
                   label,
                   value,
                   onChange,
                   type = 'text',
               }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label className="block text-sm font-semibold text-slate-800">
            <span className="mb-2 block">{label}</span>
            <input
                required
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-full border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-orange-300"
            />
        </label>
    );
}