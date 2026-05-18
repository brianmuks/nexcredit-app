import { palette, feedback } from './colors';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { fontFamily, typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export type SemanticColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderFocus: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryMuted: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  inputBackground: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
  success: string;
  warning: string;
  error: string;
};

const lightSemantic: SemanticColors = {
  background: palette.neutral[200],
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.neutral[300],
  borderFocus: palette.primary[500],
  text: palette.secondary[700],
  textSecondary: palette.tertiary[500],
  textMuted: palette.tertiary[400],
  textInverse: palette.white,
  primary: palette.primary[500],
  primaryMuted: palette.primary[100],
  onPrimary: palette.white,
  secondary: palette.secondary[700],
  onSecondary: palette.white,
  tertiary: palette.tertiary[500],
  inputBackground: palette.neutral[100],
  tabBar: palette.secondary[700],
  tabActive: palette.primary[500],
  tabInactive: palette.tertiary[500],
  success: feedback.success,
  warning: feedback.warning,
  error: feedback.error,
};

const darkSemantic: SemanticColors = {
  background: palette.secondary[950],
  surface: palette.secondary[900],
  surfaceElevated: palette.secondary[800],
  border: palette.secondary[700],
  borderFocus: palette.primary[400],
  text: palette.neutral[100],
  textSecondary: palette.tertiary[300],
  textMuted: palette.tertiary[400],
  textInverse: palette.secondary[900],
  primary: palette.primary[500],
  primaryMuted: palette.primary[900],
  onPrimary: palette.white,
  secondary: palette.neutral[200],
  onSecondary: palette.secondary[900],
  tertiary: palette.tertiary[300],
  inputBackground: palette.secondary[800],
  tabBar: palette.secondary[800],
  tabActive: palette.primary[500],
  tabInactive: palette.tertiary[400],
  success: feedback.success,
  warning: feedback.warning,
  error: feedback.error,
};

export type AppTheme = {
  mode: ThemeMode;
  colors: SemanticColors;
  palette: typeof palette;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
};

export function createTheme(mode: ThemeMode = 'light'): AppTheme {
  return {
    mode,
    colors: mode === 'light' ? lightSemantic : darkSemantic,
    palette,
    typography,
    fontFamily,
    spacing,
    radii,
    shadows,
  };
}

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export { palette, feedback, spacing, radii, shadows, typography, fontFamily };
export type { ColorScale } from './colors';
export type { TypographyVariant } from './typography';
