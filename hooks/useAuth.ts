import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
  const verifyPhoneOtp = useAuthStore((s) => s.verifyPhoneOtp);
  const logout = useAuthStore((s) => s.logout);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const hydrate = useAuthStore((s) => s.hydrate);

  return {
    user,
    isAuthenticated,
    isLoading,
    pendingPhone,
    login,
    register,
    requestPhoneOtp,
    verifyPhoneOtp,
    logout,
    forgotPassword,
    hydrate,
  };
}
