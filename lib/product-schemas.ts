import { z } from 'zod';

import { MAX_PRODUCT_IMAGES } from '@/constants/products';

function parsePositiveNumber(value: string, message: string) {
  const n = Number(value.trim());
  if (Number.isNaN(n) || n <= 0) {
    return false;
  }
  return n;
}

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(80, 'Title is too long'),
  description: z
    .string()
    .trim()
    .min(10, 'Add a short description (at least 10 characters)')
    .max(500, 'Description is too long'),
  amountZmw: z
    .string()
    .trim()
    .min(1, 'Enter an amount')
    .refine((v) => parsePositiveNumber(v, 'Amount must be greater than zero') !== false, {
      message: 'Amount must be greater than zero',
    }),
  interestRatePercent: z
    .string()
    .trim()
    .min(1, 'Enter the interest rate')
    .refine((v) => {
      const n = Number(v.trim());
      return !Number.isNaN(n) && n >= 0 && n <= 100;
    }, 'Interest rate must be between 0 and 100%'),
  termMonths: z
    .string()
    .trim()
    .min(1, 'Enter the tenure')
    .refine((v) => {
      const n = Number(v.trim());
      return Number.isInteger(n) && n > 0 && n <= 60;
    }, 'Tenure must be between 1 and 60 months'),
  availableForCash: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function toCreateProductInput(values: ProductFormValues, images: string[]) {
  return {
    title: values.title,
    description: values.description,
    amountZmw: Number(values.amountZmw),
    interestRatePercent: Number(values.interestRatePercent),
    termMonths: Number(values.termMonths),
    availableForCash: values.availableForCash,
    images: images.slice(0, MAX_PRODUCT_IMAGES),
  };
}

export function validateProductImages(images: string[]): string | undefined {
  if (images.length > MAX_PRODUCT_IMAGES) {
    return `You can add up to ${MAX_PRODUCT_IMAGES} photos`;
  }
  return undefined;
}
