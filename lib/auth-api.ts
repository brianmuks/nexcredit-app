import { apiRequest, setStoredToken } from '@/lib/api-client';
import type {
  AuthResponse,
  PhoneOtpRequestInput,
  PhoneOtpVerifyInput,
  RegisterInput,
  User,
} from '@/types/auth';

/**
 * Mock auth when the API is not ready.
 * - Defaults to ON in development (__DEV__)
 * - Set EXPO_PUBLIC_USE_MOCK_AUTH=false in .env to call the real API while developing
 * - Set EXPO_PUBLIC_USE_MOCK_AUTH=true to force mock in production builds (not recommended)
 */
export const isMockAuthEnabled =
  process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true' ||
  (__DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false');

const USE_MOCK = isMockAuthEnabled;

function mockAuthResponse(partial: Partial<User>): AuthResponse {
  const user: User = {
    id: 'mock-user-1',
    firstName: partial.firstName ?? 'Demo',
    lastName: partial.lastName ?? 'User',
    phone: partial.phone ?? '+260970000000',
    role: partial.role ?? 'borrower',
    campus: partial.campus,
    isBcVerified: false,
  };
  return { token: 'mock-jwt-token', user };
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
        firstName: registration.firstName,
        lastName: registration.lastName,
        phone: registration.phone,
        campus: registration.campus,
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
