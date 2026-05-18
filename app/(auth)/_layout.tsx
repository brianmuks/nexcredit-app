import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui';
import { AppThemeProvider } from '@/providers/AppThemeProvider';
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <AppThemeProvider forcedMode="light">
        <LoadingScreen />
      </AppThemeProvider>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <AppThemeProvider forcedMode="light">
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-phone" />
      </Stack>
    </AppThemeProvider>
  );
}
