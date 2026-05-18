import { useContext } from 'react';

import { ThemeContext } from '@/providers/AppThemeProvider';
import type { AppTheme } from '@/theme';

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }
  return ctx.theme;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within AppThemeProvider');
  }
  return ctx;
}
