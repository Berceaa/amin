export type BackendProduct = {
    productId: number;
    productCode: string;
    productName: string;
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

    return {
        id: product.productId,
        productCode: product.productCode,
        title: product.productName,
        category: categoryMap[product.productCategory],
        subCategory: product.productSubCategory,
        price: `${product.price.toFixed(2)} lei`,
        priceValue: product.price,
        description: product.productSubCategory.replaceAll('_', ' ').toLowerCase(),
        image: product.imageUrl || 'https://placehold.co/600x420/fff4ec/f27128?text=Pet+Product',
        tag: product.productSubCategory.replaceAll('_', ' '),
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