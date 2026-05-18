import {
  LEGACY_PIXABAY_IMAGE_URL_MAP,
  normalizeProductImageUri,
} from '@/constants/sample-product-images';

export function normalizeProductImages(images: string[]): string[] {
  return images.map(normalizeProductImageUri);
}

export function isLegacyPixabayDownloadUrl(uri: string): boolean {
  return uri in LEGACY_PIXABAY_IMAGE_URL_MAP;
}
