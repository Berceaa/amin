import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../data/store';

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function parsePrice(value: string) {
  const normalized = value.replace(',', '.').match(/[\d.]+/);
  return normalized ? Number(normalized[0]) : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem('pawsentials-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('pawsentials-cart', JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (product: Product) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        }
        return [...current, { ...product, quantity: 1 }];
      });
      setIsOpen(true);
    };

    const removeFromCart = (productId: number) => {
      setItems((current) => current.filter((item) => item.id !== productId));
    };

    const increaseQuantity = (productId: number) => {
      setItems((current) => current.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)));
    };

    const decreaseQuantity = (productId: number) => {
      setItems((current) =>
        current
          .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0),
      );
    };

    const clearCart = () => setItems([]);
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

    return {
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
