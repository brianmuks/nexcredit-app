import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/lib/api-client';
import {
  fetchCurrentUser,
  forgotPasswordApi,
  loginApi,
  registerApi,
  requestPhoneOtpApi,
  verifyPhoneOtpApi,
} from '@/lib/auth-api';
import type { LoginInput, RegisterInput, User } from '@/types/auth';

const USER_KEY = 'auth_user';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string | null;
  pendingRegistration: RegisterInput | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  requestPhoneOtp: (phone: string) => Promise<void>;
  verifyPhoneOtp: (code: string) => Promise<void>;
  setPendingRegistration: (input: RegisterInput | null) => void;
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingPhone: null,
  pendingRegistration: null,

  setUser: async (user) => {
    await persistUser(user);
    set({ user, isAuthenticated: !!user });
  },

  setPendingRegistration: (input) => {
    set({
      pendingRegistration: input,
      pendingPhone: input?.phone ?? get().pendingPhone,
    });
  },

  login: async (input) => {
    const { token, user } = await loginApi(input);
    await setStoredToken(token);
    await persistUser(user);
    set({ user, isAuthenticated: true, pendingPhone: null, pendingRegistration: null });
  },

  register: async (input) => {
    const { token, user } = await registerApi(input);
    await setStoredToken(token);
    await persistUser(user);
    set({ user, isAuthenticated: true, pendingPhone: null, pendingRegistration: null });
  },

  requestPhoneOtp: async (phone) => {
    await requestPhoneOtpApi({ phone });
    set({ pendingPhone: phone });
  },

  verifyPhoneOtp: async (code) => {
    const { pendingPhone, pendingRegistration } = get();
    if (!pendingPhone) {
      throw new Error('No phone verification in progress');
    }

    const { token, user } = await verifyPhoneOtpApi(
      { phone: pendingPhone, code },
      pendingRegistration ?? undefined,
    );
    await setStoredToken(token);
    await persistUser(user);
    set({
      user,
      isAuthenticated: true,
      pendingPhone: null,
      pendingRegistration: null,
    });
  },

  logout: async () => {
    await clearStoredToken();
    await persistUser(null);
    set({
      user: null,
      isAuthenticated: false,
      pendingPhone: null,
      pendingRegistration: null,
    });
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
