import type { LenderProduct, ProductStatus } from '@/types/product';

export type ProductStatusFilter = 'all' | ProductStatus;
export type ProductCashFilter = 'all' | 'cash' | 'loan_only';
export type ProductSortOption =
  | 'newest'
  | 'amount_high'
  | 'amount_low'
  | 'interest_low'
  | 'interest_high';

export type ProductFilters = {
  status: ProductStatusFilter;
  cash: ProductCashFilter;
  sort: ProductSortOption;
};

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  status: 'all',
  cash: 'all',
  sort: 'newest',
};

export function applyProductFilters(
  products: LenderProduct[],
  filters: ProductFilters,
): LenderProduct[] {
  let result = [...products];

  if (filters.status !== 'all') {
    result = result.filter((p) => p.status === filters.status);
  }

  if (filters.cash === 'cash') {
    result = result.filter((p) => p.availableForCash);
  } else if (filters.cash === 'loan_only') {
    result = result.filter((p) => !p.availableForCash);
  }

  switch (filters.sort) {
    case 'amount_high':
      result.sort((a, b) => b.amountZmw - a.amountZmw);
      break;
    case 'amount_low':
      result.sort((a, b) => a.amountZmw - b.amountZmw);
      break;
    case 'interest_low':
      result.sort((a, b) => a.interestRatePercent - b.interestRatePercent);
      break;
    case 'interest_high':
      result.sort((a, b) => b.interestRatePercent - a.interestRatePercent);
      break;
    case 'newest':
    default:
      result.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
  }

  return result;
}

export function countActiveProductFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.status !== 'all') count += 1;
  if (filters.cash !== 'all') count += 1;
  if (filters.sort !== 'newest') count += 1;
  return count;
}

export function hasActiveProductFilters(filters: ProductFilters): boolean {
  return countActiveProductFilters(filters) > 0;
}
