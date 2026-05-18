import { TextStyle } from 'react-native';

/** Font family keys — loaded via @expo-google-fonts in root layout. */
export const fontFamily = {
  headline: 'HankenGrotesk_700Bold',
  headlineMedium: 'HankenGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  label: 'Inter_500Medium',
} as const;

export type TypographyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'label' | 'caption';

export const typography: Record<TypographyVariant, TextStyle> = {
  display: {
    fontFamily: fontFamily.headline,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamily.headline,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.headline,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: fontFamily.headlineMedium,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: fontFamily.label,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    lineHeight: 16,
  },
};
