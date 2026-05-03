import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../data/store';
import { api, mapCart } from '../api/client';

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  increaseQuantity: (productId: number) => Promise<void>;
  decreaseQuantity: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = async () => {
    try {
      const cart = await api.getCart();
      setItems(mapCart(cart));
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = async (product: Product) => {
      const cart = await api.addToCart(product.id, 1);
      setItems(mapCart(cart));
      setIsOpen(true);
    };

    const removeFromCart = async (productId: number) => {
      const cart = await api.removeFromCart(productId);
      setItems(mapCart(cart));
    };

    const increaseQuantity = async (productId: number) => {
      const cart = await api.addToCart(productId, 1);
      setItems(mapCart(cart));
    };

    const decreaseQuantity = async (productId: number) => {
      const existing = items.find((item) => item.id === productId);

      if (!existing) return;

      if (existing.quantity <= 1) {
        const cart = await api.removeFromCart(productId);
        setItems(mapCart(cart));
        return;
      }

      /*
        Your backend currently supports add/remove/clear, not "set quantity".
        So this updates the frontend visually for now.
        If you want perfect backend sync, we should add a /cart/update endpoint later.
      */
      setItems((current) =>
          current.map((item) =>
              item.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
          ),
      );
    };

    const clearCart = async () => {
      const cart = await api.clearCart();
      setItems(mapCart(cart));
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);

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
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}