/**
 * NexCredit design tokens — color scales from brand guide.
 * Each scale: 50 (lightest) → 950 (darkest), 500 = base.
 */

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export const primary: ColorScale = {
  50: '#FEF3EF',
  100: '#FDE6DA',
  200: '#FACBB5',
  300: '#F7A78A',
  400: '#F47D55',
  500: '#F05A28',
  600: '#D94A1C',
  700: '#B33A15',
  800: '#8C2D12',
  900: '#66210E',
  950: '#3D1208',
};

export const secondary: ColorScale = {
  50: '#F4F5F5',
  100: '#E8EAEB',
  200: '#D1D5D6',
  300: '#A8B0B2',
  400: '#7A8588',
  500: '#5C676A',
  600: '#4A5457',
  700: '#2D3436',
  800: '#242A2C',
  900: '#1A1F20',
  950: '#0F1213',
};

export const tertiary: ColorScale = {
  50: '#F5F6F6',
  100: '#E9EBEC',
  200: '#D3D7D8',
  300: '#B0B7B9',
  400: '#8A9497',
  500: '#636E72',
  600: '#545D61',
  700: '#454C4F',
  800: '#363B3E',
  900: '#272A2C',
  950: '#181A1B',
};

export const neutral: ColorScale = {
  50: '#FFFFFF',
  100: '#FAFAFA',
  200: '#F5F5F5',
  300: '#E8E8E8',
  400: '#D4D4D4',
  500: '#A3A3A3',
  600: '#737373',
  700: '#525252',
  800: '#404040',
  900: '#262626',
  950: '#171717',
};

export const feedback = {
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const palette = {
  primary,
  secondary,
  tertiary,
  neutral,
  feedback,
  white: '#FFFFFF',
  black: '#000000',
} as const;
