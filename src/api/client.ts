export type BackendProduct = {
    productId: number;
    productCode: string;
    productName: string;
    description?: string | null;
    imageUrl: string;
    price: number;
    stock: number;
    productCategory: 'CAT' | 'DOG' | 'CAT_AND_DOG';
    productSubCategory: string;
};

export type FrontendProduct = {
    id: number;
    productCode: string;
    title: string;
    category: 'Cats' | 'Dogs' | 'Cats & Dogs';
    subCategory: string;
    price: string;
    priceValue: number;
    description: string;
    image: string;
    tag: string;
    stock: number;
};

export type AuthUser = {
    id: number;
    email: string;
    role: 'admin' | 'customer' | 'ADMIN' | 'CUSTOMER';
    name?: string;
    phone?: string;
    company?: string;
    taxNumber?: string;
};

export type BackendCartItem = {
    product: BackendProduct;
    quantity: number;
    totalPrice: number;
};

export type BackendCart = {
    items: BackendCartItem[];
    totalPrice: number;
};

export type BackendOrder = {
    orderId: number;
    customerEmail: string;
    totalAmount: number;
    createdAt: string;
    items: {
        orderItemId: number;
        productName: string;
        priceAtPurchase: number;
        quantity: number;
        totalPrice: number;
    }[];
};

const API_BASE = '/api';

const PRODUCT_IMAGE_FALLBACK =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
            <rect width="600" height="420" rx="28" fill="#fff4ec"/>
            <text x="50%" y="43%" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="#f27128">🐾</text>
            <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#f27128">Pet Product</text>
        </svg>
    `);

function normalizeImageUrl(imageUrl?: string | null) {
    const value = imageUrl?.trim();

    if (!value) {
        return PRODUCT_IMAGE_FALLBACK;
    }

    const imgurMatch = value.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/i);
    if (imgurMatch) {
        return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }

    if (/^https?:\/\/i\.imgur\.com\/[a-zA-Z0-9]+$/i.test(value)) {
        return `${value}.jpg`;
    }

    if (/^(https?:|data:|blob:)/i.test(value)) {
        return value;
    }

    if (value.startsWith('/api/')) {
        return value;
    }

    const cleanPath = value.startsWith('/') ? value : `/${value}`;
    return `/api${cleanPath}`;
}

export function formatSubCategory(value?: string | null) {
    if (!value) return 'General';

    return value
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Something went wrong');
    }

    return response.json() as Promise<T>;
}

export function mapProduct(product: BackendProduct): FrontendProduct {
    const categoryMap: Record<BackendProduct['productCategory'], FrontendProduct['category']> = {
        CAT: 'Cats',
        DOG: 'Dogs',
        CAT_AND_DOG: 'Cats & Dogs',
    };

    const subCategory = product.productSubCategory || '';
    const formattedSubCategory = formatSubCategory(subCategory);

    return {
        id: product.productId,
        productCode: product.productCode,
        title: product.productName,
        category: categoryMap[product.productCategory],
        subCategory,
        price: `${Number(product.price).toFixed(2)} lei`,
        priceValue: Number(product.price),
        description: product.description?.trim() || formattedSubCategory,
        image: normalizeImageUrl(product.imageUrl),
        tag: formattedSubCategory,
        stock: product.stock,
    };
}

export function mapCart(cart: BackendCart) {
    return cart.items.map((item) => ({
        ...mapProduct(item.product),
        quantity: item.quantity,
    }));
}

export const api = {
    getProducts: () => request<BackendProduct[]>('/products'),

    getProduct: (productId: number) => request<BackendProduct>(`/products/${productId}`),

    login: (email: string, password: string) =>
        request<AuthUser>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (email: string, password: string) =>
        request<AuthUser>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    getCart: () => request<BackendCart>('/cart'),

    addToCart: (productId: number, quantity: number) =>
        request<BackendCart>('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        }),

    removeFromCart: (productId: number) =>
        request<BackendCart>(`/cart/remove/${productId}`, {
            method: 'DELETE',
        }),

    clearCart: () =>
        request<BackendCart>('/cart/clear', {
            method: 'DELETE',
        }),

    checkout: (customerEmail: string) =>
        request<BackendOrder>('/orders/checkout', {
            method: 'POST',
            body: JSON.stringify({ customerEmail }),
        }),

    getAdminOrders: () => request<BackendOrder[]>('/admin/orders'),

    createProduct: (product: Omit<BackendProduct, 'productId'>) =>
        request<BackendProduct>('/admin/products', {
            method: 'POST',
            body: JSON.stringify(product),
        }),

    updateProduct: (productId: number, product: Omit<BackendProduct, 'productId'>) =>
        request<BackendProduct>(`/admin/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        }),

    deleteProduct: (productId: number) =>
        fetch(`${API_BASE}/admin/products/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        }),
};