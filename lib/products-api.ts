import { apiRequest } from '@/lib/api-client';
import {
  mockCreateLenderProduct,
  mockDeleteLenderProduct,
  mockListLenderProducts,
  mockUpdateLenderProduct,
} from '@/lib/mock/lender-products-mock';
import type {
  CreateProductInput,
  LenderProduct,
  UpdateProductInput,
} from '@/types/product';

/**
 * Mock lender products when the API is not ready.
 * - Defaults to ON in development (__DEV__)
 * - Set EXPO_PUBLIC_USE_MOCK_PRODUCTS=false to hit the real API while developing
 */
export const isMockProductsEnabled =
  process.env.EXPO_PUBLIC_USE_MOCK_PRODUCTS === 'true' ||
  (__DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_PRODUCTS !== 'false');

const USE_MOCK = isMockProductsEnabled;

export async function fetchLenderProducts(lenderId: string): Promise<LenderProduct[]> {
  if (USE_MOCK) {
    return mockListLenderProducts(lenderId);
  }

  return apiRequest<LenderProduct[]>('/lender/products', { auth: true });
}

export async function createLenderProduct(
  lenderId: string,
  input: CreateProductInput,
): Promise<LenderProduct> {
  if (USE_MOCK) {
    return mockCreateLenderProduct(lenderId, input);
  }

  return apiRequest<LenderProduct>('/lender/products', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function updateLenderProduct(
  lenderId: string,
  productId: string,
  input: UpdateProductInput,
): Promise<LenderProduct> {
  if (USE_MOCK) {
    return mockUpdateLenderProduct(lenderId, productId, input);
  }

  return apiRequest<LenderProduct>(`/lender/products/${productId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function deleteLenderProduct(lenderId: string, productId: string): Promise<void> {
  if (USE_MOCK) {
    return mockDeleteLenderProduct(lenderId, productId);
  }

  await apiRequest(`/lender/products/${productId}`, {
    method: 'DELETE',
    auth: true,
  });
}
