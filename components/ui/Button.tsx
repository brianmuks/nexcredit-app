import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import type { SemanticColors } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style: styleProp,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(theme.colors, variant);
  const sizeStyles = sizeMap[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth ? styles.fullWidth : undefined,
        pressed && !isDisabled ? styles.pressed : undefined,
        isDisabled ? styles.disabled : undefined,
        styleProp,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variantStyles.spinnerColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text
            variant={size === 'sm' ? 'label' : 'body'}
            style={[styles.label, { color: variantStyles.text }, sizeStyles.text]}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

function getVariantStyles(colors: SemanticColors, variant: ButtonVariant) {
  switch (variant) {
    case 'secondary':
      return {
        container: { backgroundColor: colors.inputBackground, borderWidth: 0 },
        text: colors.text,
        spinnerColor: colors.text,
      };
    case 'inverted':
      return {
        container: { backgroundColor: colors.secondary, borderWidth: 0 },
        text: colors.onSecondary,
        spinnerColor: colors.onSecondary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.secondary,
        },
        text: colors.text,
        spinnerColor: colors.text,
      };
    case 'primary':
    default:
      return {
        container: { backgroundColor: colors.primary, borderWidth: 0 },
        text: colors.onPrimary,
        spinnerColor: colors.onPrimary,
      };
  }
}

const sizeMap = {
  sm: {
    container: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 40 },
    text: { fontSize: 14 },
  },
  md: {
    container: { paddingVertical: 14, paddingHorizontal: 20, minHeight: 48 },
    text: { fontSize: 16 },
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 56 },
    text: { fontSize: 16 },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: undefined,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
