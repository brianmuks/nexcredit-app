import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { ApiError } from '@/types/auth';

export const TOKEN_KEY = 'auth_token';

const isWeb = Platform.OS === 'web';

function webStorage(): Storage | null {
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return globalThis.localStorage;
  }
  return null;
}

/** Production API — override with EXPO_PUBLIC_API_URL in .env for local backends. */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://www.funsa.online/api/v1';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function getStoredToken(): Promise<string | null> {
  if (isWeb) {
    return webStorage()?.getItem(TOKEN_KEY) ?? null;
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  if (isWeb) {
    webStorage()?.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  if (isWeb) {
    webStorage()?.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...init } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = await getStoredToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = {
      message:
        (body as { message?: string }).message ??
        (body as { error?: string }).error ??
        'Something went wrong. Please try again.',
      status: response.status,
    };
    throw error;
  }

  return body as T;
}
