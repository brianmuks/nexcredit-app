import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/lib/api-client';
import { fetchCurrentUser, forgotPasswordApi, loginApi, registerApi } from '@/lib/auth-api';
import type { LoginInput, RegisterInput, User } from '@/types/auth';

const USER_KEY = 'auth_user';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
};

async function persistUser(user: User | null) {
  if (user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(USER_KEY);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: async (user) => {
    await persistUser(user);
    set({ user, isAuthenticated: !!user });
  },

  login: async (input) => {
    const { token, user } = await loginApi(input);
    await setStoredToken(token);
    await persistUser(user);
    set({ user, isAuthenticated: true });
  },

  register: async (input) => {
    const { token, user } = await registerApi(input);
    await setStoredToken(token);
    await persistUser(user);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await clearStoredToken();
    await persistUser(null);
    set({ user: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    await forgotPasswordApi(email);
  },

  hydrate: async () => {
    try {
      const token = await getStoredToken();
      const cached = await AsyncStorage.getItem(USER_KEY);

      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      if (cached) {
        const user = JSON.parse(cached) as User;
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }

      const user = await fetchCurrentUser();
      if (user) {
        await persistUser(user);
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }

      await clearStoredToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
