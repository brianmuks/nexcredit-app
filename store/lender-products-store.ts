import { create } from 'zustand';

import {
  createLenderProduct,
  deleteLenderProduct,
  fetchLenderProducts,
  updateLenderProduct,
} from '@/lib/products-api';
import type { CreateProductInput, LenderProduct, UpdateProductInput } from '@/types/product';

type LenderProductsState = {
  products: LenderProduct[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchProducts: (lenderId: string) => Promise<void>;
  createProduct: (lenderId: string, input: CreateProductInput) => Promise<LenderProduct>;
  updateProduct: (
    lenderId: string,
    productId: string,
    input: UpdateProductInput,
  ) => Promise<LenderProduct>;
  deleteProduct: (lenderId: string, productId: string) => Promise<void>;
  clear: () => void;
};

export const useLenderProductsStore = create<LenderProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  isMutating: false,
  error: null,

  fetchProducts: async (lenderId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await fetchLenderProducts(lenderId);
      set({ products, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load products';
      set({ error: message, isLoading: false });
    }
  },

  createProduct: async (lenderId, input) => {
    set({ isMutating: true, error: null });
    try {
      const product = await createLenderProduct(lenderId, input);
      set({
        products: [product, ...get().products],
        isMutating: false,
      });
      return product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create product';
      set({ isMutating: false, error: message });
      throw err;
    }
  },

  updateProduct: async (lenderId, productId, input) => {
    set({ isMutating: true, error: null });
    try {
      const updated = await updateLenderProduct(lenderId, productId, input);
      set({
        products: get().products.map((p) => (p.id === productId ? updated : p)),
        isMutating: false,
      });
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update product';
      set({ isMutating: false, error: message });
      throw err;
    }
  },

  deleteProduct: async (lenderId, productId) => {
    set({ isMutating: true, error: null });
    try {
      await deleteLenderProduct(lenderId, productId);
      set({
        products: get().products.filter((p) => p.id !== productId),
        isMutating: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not delete product';
      set({ isMutating: false, error: message });
      throw err;
    }
  },

  clear: () => {
    set({ products: [], isLoading: false, isMutating: false, error: null });
  },
}));
