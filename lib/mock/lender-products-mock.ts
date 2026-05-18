import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  buildSampleProducts,
  isSampleProductId,
  SAMPLE_PRODUCTS_VERSION,
} from '@/constants/sample-products';
import { normalizeProductImages } from '@/lib/product-image-uri';
import type {
  CreateProductInput,
  LenderProduct,
  UpdateProductInput,
} from '@/types/product';

const STORAGE_PREFIX = 'mock_lender_products_';
const SAMPLE_VERSION_KEY = 'mock_lender_products_sample_version_';

const MOCK_DELAY_MS = 350;

function storageKey(lenderId: string) {
  return `${STORAGE_PREFIX}${lenderId}`;
}

function delay(ms = MOCK_DELAY_MS) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeProduct(product: LenderProduct): LenderProduct {
  const images = normalizeProductImages(product.images ?? []);
  return {
    ...product,
    images,
    availableForCash: product.availableForCash ?? false,
  };
}

async function readAll(lenderId: string): Promise<LenderProduct[]> {
  const raw =
    (await AsyncStorage.getItem(storageKey(lenderId))) ??
    (await AsyncStorage.getItem(`lender_products_${lenderId}`));
  if (!raw) return [];
  const products = (JSON.parse(raw) as LenderProduct[]).map(normalizeProduct);
  await writeAll(lenderId, products);
  return products;
}

async function writeAll(lenderId: string, products: LenderProduct[]) {
  await AsyncStorage.setItem(storageKey(lenderId), JSON.stringify(products));
}

function sortByUpdated(products: LenderProduct[]) {
  return [...products].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

async function getSampleVersion(lenderId: string): Promise<number> {
  const raw = await AsyncStorage.getItem(`${SAMPLE_VERSION_KEY}${lenderId}`);
  return raw ? Number(raw) : 0;
}

async function setSampleVersion(lenderId: string, version: number) {
  await AsyncStorage.setItem(`${SAMPLE_VERSION_KEY}${lenderId}`, String(version));
}

async function seedSamples(lenderId: string): Promise<LenderProduct[]> {
  const seeded = buildSampleProducts(lenderId, nowIso());
  await writeAll(lenderId, seeded);
  await setSampleVersion(lenderId, SAMPLE_PRODUCTS_VERSION);
  return seeded;
}

async function seedIfEmpty(lenderId: string): Promise<LenderProduct[]> {
  const existing = await readAll(lenderId);

  if (existing.length === 0) {
    return seedSamples(lenderId);
  }

  const sampleVersion = await getSampleVersion(lenderId);
  const onlySamples =
    existing.length > 0 && existing.every((product) => isSampleProductId(product.id));

  if (onlySamples && sampleVersion < SAMPLE_PRODUCTS_VERSION) {
    return seedSamples(lenderId);
  }

  return existing;
}

export async function mockListLenderProducts(lenderId: string): Promise<LenderProduct[]> {
  await delay(300);
  return sortByUpdated(await seedIfEmpty(lenderId));
}

export async function mockCreateLenderProduct(
  lenderId: string,
  input: CreateProductInput,
): Promise<LenderProduct> {
  await delay(400);
  const timestamp = nowIso();
  const product: LenderProduct = {
    id: createId(),
    lenderId,
    ...input,
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const products = await readAll(lenderId);
  products.push(product);
  await writeAll(lenderId, products);
  return product;
}

export async function mockUpdateLenderProduct(
  lenderId: string,
  productId: string,
  input: UpdateProductInput,
): Promise<LenderProduct> {
  await delay(350);
  const products = await readAll(lenderId);
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const updated: LenderProduct = {
    ...products[index],
    ...input,
    updatedAt: nowIso(),
  };
  products[index] = updated;
  await writeAll(lenderId, products);
  return updated;
}

export async function mockDeleteLenderProduct(
  lenderId: string,
  productId: string,
): Promise<void> {
  await delay(300);
  const products = await readAll(lenderId);
  await writeAll(
    lenderId,
    products.filter((p) => p.id !== productId),
  );
}
