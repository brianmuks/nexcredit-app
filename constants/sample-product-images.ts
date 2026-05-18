/** Direct Pixabay CDN URLs (work in expo-image). */
export const SAMPLE_PRODUCT_IMAGES = {
  rice: 'https://cdn.pixabay.com/photo/2017/06/07/16/24/rice-2380808_1280.jpg',
  phone: 'https://cdn.pixabay.com/photo/2016/11/29/12/30/phone-1869510_1280.jpg',
  shoes: 'https://cdn.pixabay.com/photo/2020/10/11/05/36/nike-5644799_1280.jpg',
  fridge: 'https://cdn.pixabay.com/photo/2018/11/04/13/29/hospitality-3793946_1280.jpg',
} as const;

export type SampleProductImageKey = keyof typeof SAMPLE_PRODUCT_IMAGES;

/** Rewrites legacy Pixabay download links to direct CDN URLs. */
export const LEGACY_PIXABAY_IMAGE_URL_MAP: Record<string, string> = {
  'https://pixabay.com/images/download/x-3506194_1920.jpg': SAMPLE_PRODUCT_IMAGES.rice,
  'https://pixabay.com/images/download/x-1869510_1920.jpg': SAMPLE_PRODUCT_IMAGES.phone,
  'https://pixabay.com/images/download/x-1840619_1920.jpg': SAMPLE_PRODUCT_IMAGES.shoes,
  'https://pixabay.com/images/download/x-3793946_1920.jpg': SAMPLE_PRODUCT_IMAGES.fridge,
};

export function normalizeProductImageUri(uri: string): string {
  return LEGACY_PIXABAY_IMAGE_URL_MAP[uri] ?? uri;
}
