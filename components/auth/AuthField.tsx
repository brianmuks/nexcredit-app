import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

export type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  labelRight?: React.ReactNode;
};

export function AuthField({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  labelRight,
  secureTextEntry,
  style,
  ...props
}: AuthFieldProps) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text variant="caption" style={styles.label}>
          {label.toUpperCase()}
        </Text>
        {labelRight}
      </View>

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
        ]}>
        {leftIcon ? (
          <Ionicons name={leftIcon} size={20} color={theme.colors.textMuted} />
        ) : null}

        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={isPassword ? hidden : false}
          style={[styles.input, theme.typography.body, { color: theme.colors.text }, style]}
          {...props}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={theme.colors.textMuted}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            accessibilityRole={onRightIconPress ? 'button' : undefined}>
            <Ionicons name={rightIcon} size={20} color={theme.colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
  },
});
