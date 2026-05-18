import { forwardRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    error,
    hint,
    containerStyle,
    leftAccessory,
    rightAccessory,
    style,
    editable = true,
    ...props
  },
  ref,
) {
  const theme = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text variant="label" color="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: hasError ? theme.colors.error : theme.colors.border,
          },
          !editable && styles.disabled,
        ]}>
        {leftAccessory}
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors.textMuted}
          editable={editable}
          style={[
            styles.input,
            theme.typography.body,
            { color: theme.colors.text },
            style,
          ]}
          {...props}
        />
        {rightAccessory}
      </View>

      {error ? (
        <Text variant="caption" color="error" style={styles.feedback}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="muted" style={styles.feedback}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 6,
  },
  label: {
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  feedback: {
    marginTop: 2,
  },
});
