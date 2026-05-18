import { SAMPLE_PRODUCT_IMAGES } from '@/constants/sample-product-images';
import type { LenderProduct } from '@/types/product';

/** Bump when sample catalog changes so mock storage can refresh sample-only data. */
export const SAMPLE_PRODUCTS_VERSION = 2;

type SampleProductSeed = Pick<
  LenderProduct,
  | 'title'
  | 'description'
  | 'amountZmw'
  | 'interestRatePercent'
  | 'termMonths'
  | 'availableForCash'
  | 'images'
  | 'status'
> & {
  key: string;
};

export const SAMPLE_PRODUCT_SEEDS: SampleProductSeed[] = [
  {
    key: 'rice',
    title: '25kg rice bag',
    description:
      'Bulk white rice for hostel cooking. Pick up on campus after your loan or cash purchase is approved.',
    amountZmw: 420,
    interestRatePercent: 5,
    termMonths: 2,
    availableForCash: true,
    images: [SAMPLE_PRODUCT_IMAGES.rice],
    status: 'active',
  },
  {
    key: 'phone',
    title: 'Android smartphone',
    description:
      'Dual-SIM handset for mobile money, WhatsApp, and online learning. Charger included.',
    amountZmw: 1800,
    interestRatePercent: 15,
    termMonths: 6,
    availableForCash: true,
    images: [SAMPLE_PRODUCT_IMAGES.phone],
    status: 'active',
  },
  {
    key: 'shoes',
    title: 'Nike running shoes (size 42)',
    description:
      'Lightweight trainers in good condition — ideal for sports society and daily campus walks.',
    amountZmw: 350,
    interestRatePercent: 10,
    termMonths: 3,
    availableForCash: false,
    images: [SAMPLE_PRODUCT_IMAGES.shoes],
    status: 'active',
  },
  {
    key: 'fridge',
    title: 'Hostel mini fridge',
    description:
      'Compact fridge for shared rooms. Keeps drinks and meals cold; collection from seller on campus.',
    amountZmw: 2200,
    interestRatePercent: 12,
    termMonths: 8,
    availableForCash: true,
    images: [SAMPLE_PRODUCT_IMAGES.fridge],
    status: 'paused',
  },
];

export function buildSampleProducts(lenderId: string, timestamp: string): LenderProduct[] {
  return SAMPLE_PRODUCT_SEEDS.map((seed) => {
    const { key, ...product } = seed;
    return {
      id: `sample_${key}`,
      lenderId,
      ...product,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

export function isSampleProductId(id: string): boolean {
  return id.startsWith('sample_');
}
