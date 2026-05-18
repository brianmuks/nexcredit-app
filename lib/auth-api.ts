import { apiRequest, setStoredToken } from '@/lib/api-client';
import type {
  AuthResponse,
  LoginInput,
  PhoneOtpRequestInput,
  PhoneOtpVerifyInput,
  RegisterInput,
  User,
} from '@/types/auth';

/** Wire to Flask backend when available. Falls back to mock in __DEV__ without API. */
const USE_MOCK = __DEV__ && !process.env.EXPO_PUBLIC_API_URL;

function mockAuthResponse(partial: Partial<User>): AuthResponse {
  const user: User = {
    id: 'mock-user-1',
    email: partial.email ?? 'demo@unza.ac.zm',
    firstName: partial.firstName ?? 'Demo',
    lastName: partial.lastName ?? 'User',
    phone: partial.phone ?? '+260970000000',
    role: partial.role ?? 'borrower',
    isBcVerified: false,
  };
  return { token: 'mock-jwt-token', user };
}

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return mockAuthResponse({
      email: input.email,
      phone: input.phone,
    });
  }

  const data = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await setStoredToken(data.token);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return mockAuthResponse({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.role,
    });
  }

  const data = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await setStoredToken(data.token);
  return data;
}

export async function requestPhoneOtpApi(input: PhoneOtpRequestInput): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return;
  }

  await apiRequest('/auth/phone/request-otp', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyPhoneOtpApi(
  input: PhoneOtpVerifyInput,
  registration?: RegisterInput,
): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    if (registration) {
      return mockAuthResponse({
        email: registration.email,
        firstName: registration.firstName,
        lastName: registration.lastName,
        phone: registration.phone,
        role: registration.role,
      });
    }
    return mockAuthResponse({ phone: input.phone });
  }

  const data = await apiRequest<AuthResponse>('/auth/phone/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ ...input, registration }),
  });
  await setStoredToken(data.token);
  return data;
}

export async function forgotPasswordApi(email: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return;
  }

  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function fetchCurrentUser(): Promise<User | null> {
  if (USE_MOCK) {
    return null;
  }

  try {
    return await apiRequest<User>('/auth/me', { auth: true });
  } catch {
    return null;
  }
}
