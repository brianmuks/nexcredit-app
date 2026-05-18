import * as SecureStore from 'expo-secure-store';

import type { ApiError } from '@/types/auth';

export const TOKEN_KEY = 'auth_token';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
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
