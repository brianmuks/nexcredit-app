/**
 * @deprecated Prefer `useTheme()` from `@/hooks/useTheme` for new code.
 * Kept for compatibility with the Expo tabs template.
 */
import { lightTheme, darkTheme } from '@/theme';

export default {
  light: {
    text: lightTheme.colors.text,
    background: lightTheme.colors.background,
    tint: lightTheme.colors.primary,
    tabIconDefault: lightTheme.colors.tabInactive,
    tabIconSelected: lightTheme.colors.tabActive,
  },
  dark: {
    text: darkTheme.colors.text,
    background: darkTheme.colors.background,
    tint: darkTheme.colors.primary,
    tabIconDefault: darkTheme.colors.tabInactive,
    tabIconSelected: darkTheme.colors.tabActive,
  },
};
