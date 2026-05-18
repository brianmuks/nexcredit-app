import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={OTP_LENGTH}
        style={styles.hiddenInput}
        autoFocus
        accessibilityLabel="One-time passcode"
      />

      <View style={styles.row}>
        {digits.map((digit, index) => {
          const filled = Boolean(digit);
          const focused = value.length === index;

          return (
            <Pressable
              key={index}
              onPress={() => inputRef.current?.focus()}
              style={[
                styles.cell,
                {
                  borderColor: error
                    ? theme.colors.error
                    : focused
                      ? theme.colors.primary
                      : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}>
              <Text
                variant="body"
                align="center"
                color={filled ? 'default' : 'muted'}
                style={styles.digit}>
                {filled ? '•' : '–'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  cell: {
    flex: 1,
    maxWidth: 52,
    minWidth: 36,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600',
  },
});
