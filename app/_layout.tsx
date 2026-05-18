import {
  HankenGrotesk_500Medium,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AppThemeProvider } from '@/providers/AppThemeProvider';
import { useAuthStore } from '@/store/auth-store';
import { lightTheme } from '@/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  dark: false,
  colors: {
    primary: lightTheme.colors.primary,
    background: lightTheme.colors.background,
    card: lightTheme.colors.surface,
    text: lightTheme.colors.text,
    border: lightTheme.colors.border,
    notification: lightTheme.colors.primary,
  },
  fonts: {
    regular: { fontFamily: lightTheme.fontFamily.body, fontWeight: '400' as const },
    medium: { fontFamily: lightTheme.fontFamily.bodyMedium, fontWeight: '500' as const },
    bold: { fontFamily: lightTheme.fontFamily.bodySemiBold, fontWeight: '600' as const },
    heavy: { fontFamily: lightTheme.fontFamily.headline, fontWeight: '700' as const },
  },
};

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  const [loaded, error] = useFonts({
    HankenGrotesk_500Medium,
    HankenGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <NavigationThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
          </Stack>
        </NavigationThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
