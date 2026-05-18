import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const pendingRegistration = useAuthStore((s) => s.pendingRegistration);
  const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
  const verifyPhoneOtp = useAuthStore((s) => s.verifyPhoneOtp);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  return {
    user,
    isAuthenticated,
    isLoading,
    pendingPhone,
    pendingRegistration,
    requestPhoneOtp,
    verifyPhoneOtp,
    logout,
    hydrate,
  };
}
