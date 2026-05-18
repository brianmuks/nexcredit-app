import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { AppTheme, ThemeMode, createTheme } from '@/theme';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type AppThemeProviderProps = {
  children: ReactNode;
  /** Override system preference (e.g. force light on auth screens). */
  forcedMode?: ThemeMode;
};

export function AppThemeProvider({ children, forcedMode }: AppThemeProviderProps) {
  const systemScheme = useSystemColorScheme();
  const [overrideMode, setOverrideMode] = useState<ThemeMode | null>(null);

  const mode: ThemeMode =
    forcedMode ?? overrideMode ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const theme = useMemo(() => createTheme(mode), [mode]);

  const setMode = useCallback((next: ThemeMode) => setOverrideMode(next), []);

  const toggleMode = useCallback(
    () => setOverrideMode((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  );

  const value = useMemo(
    () => ({ theme, mode, setMode, toggleMode }),
    [theme, mode, setMode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
