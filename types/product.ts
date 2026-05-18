export type ProductStatus = 'active' | 'paused' | 'archived';

export type LenderProduct = {
  id: string;
  lenderId: string;
  title: string;
  description: string;
  amountZmw: number;
  interestRatePercent: number;
  termMonths: number;
  /** Buyer can purchase outright in cash at the listed price. */
  availableForCash: boolean;
  /** Local file URIs or remote URLs (max 5). */
  images: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = {
  title: string;
  description: string;
  amountZmw: number;
  interestRatePercent: number;
  termMonths: number;
  availableForCash: boolean;
  images: string[];
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  status?: ProductStatus;
};
