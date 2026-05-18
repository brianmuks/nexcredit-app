import { create } from 'zustand';

export type CartProduct = {
  id: string;
  brand: string;
  title: string;
  priceAmount: string;
  priceNumber: number;
  imageUrl: string;
  monthlyLabel: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product) => {
    const { items } = get();
    const existing = items.find((i) => i.product.id === product.id);
    let next: CartItem[];
    if (existing) {
      next = items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
    } else {
      next = [...items, { product, quantity: 1 }];
    }
    set({
      items: next,
      totalItems: next.reduce((s, i) => s + i.quantity, 0),
      totalPrice: next.reduce((s, i) => s + i.product.priceNumber * i.quantity, 0),
    });
  },

  removeItem: (productId) => {
    const next = get().items.filter((i) => i.product.id !== productId);
    set({
      items: next,
      totalItems: next.reduce((s, i) => s + i.quantity, 0),
      totalPrice: next.reduce((s, i) => s + i.product.priceNumber * i.quantity, 0),
    });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    let next: CartItem[];
    if (quantity <= 0) {
      next = items.filter((i) => i.product.id !== productId);
    } else {
      next = items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      );
    }
    set({
      items: next,
      totalItems: next.reduce((s, i) => s + i.quantity, 0),
      totalPrice: next.reduce((s, i) => s + i.product.priceNumber * i.quantity, 0),
    });
  },

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

  getItemQuantity: (productId) => {
    const found = get().items.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  },
}));
