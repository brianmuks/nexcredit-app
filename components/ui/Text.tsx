import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { TypographyVariant } from '@/theme';

export type TextColor =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'primary'
  | 'error'
  | 'success';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
};

export function Text({
  variant = 'body',
  color = 'default',
  align,
  style,
  ...props
}: TextProps) {
  const theme = useTheme();

  const colorMap: Record<TextColor, string> = {
    default: theme.colors.text,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    inverse: theme.colors.textInverse,
    primary: theme.colors.primary,
    error: theme.colors.error,
    success: theme.colors.success,
  };

  return (
    <RNText
      style={[
        theme.typography[variant],
        { color: colorMap[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    />
  );
}

export const textStyles = StyleSheet.create({});
