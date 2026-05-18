import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import {
  AuthCard,
  AuthFooter,
  AuthScreen,
  OtpInput,
  SecurityBanner,
} from '@/components/auth';
import { Button, Text } from '@/components/ui';
import { phoneOtpSchema, type PhoneOtpFormValues } from '@/lib/auth-schemas';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

const RESEND_SECONDS = 60;

export default function VerifyPhoneScreen() {
  const theme = useTheme();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const verifyPhoneOtp = useAuthStore((s) => s.verifyPhoneOtp);
  const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PhoneOtpFormValues>({
    resolver: zodResolver(phoneOtpSchema),
    defaultValues: { code: '' },
  });

  const code = watch('code');

  useEffect(() => {
    if (!pendingPhone) {
      router.replace('/(auth)/login');
    }
  }, [pendingPhone]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const onSubmit = handleSubmit(async ({ code: otp }) => {
    setSubmitting(true);
    try {
      await verifyPhoneOtp(otp);
      router.replace('/(tabs)');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Invalid code. Please try again.';
      Alert.alert('Verification failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  const handleResend = async () => {
    if (!pendingPhone || secondsLeft > 0) return;
    try {
      await requestPhoneOtp(pendingPhone);
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      Alert.alert('Could not resend', (err as ApiError).message ?? 'Try again later.');
    }
  };

  const maskedPhone = pendingPhone
    ? pendingPhone.replace(/(\d{3})\d+(\d{2})/, '$1•••••$2')
    : 'your number';

  return (
    <AuthScreen showBack>
      <View style={styles.brandRow}>
        <Text variant="h3">NexCredit</Text>
      </View>

      <Text variant="h1" style={styles.title}>
        Verify Phone
      </Text>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        We&apos;ve sent a 6-digit code to {maskedPhone}.
      </Text>

      <AuthCard>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <OtpInput
              value={value}
              onChange={onChange}
              error={Boolean(errors.code)}
            />
          )}
        />

        {errors.code?.message ? (
          <Text variant="caption" color="error" align="center">
            {errors.code.message}
          </Text>
        ) : null}

        <Button
          label="Verify & Proceed"
          onPress={onSubmit}
          loading={submitting}
          disabled={code.length < 6}
          fullWidth
          size="lg"
          style={styles.verifyBtn}
          rightIcon={<Ionicons name="lock-closed" size={16} color={theme.colors.onPrimary} />}
        />

        <PressableResend secondsLeft={secondsLeft} onResend={handleResend} />
      </AuthCard>

      <SecurityBanner message="NexCredit uses bank-grade 256-bit encryption." />

      <View style={[styles.sessionCard, { backgroundColor: theme.colors.secondary }]}>
        <Text variant="caption" color="inverse" style={styles.sessionLabel}>
          SECURE SESSION
        </Text>
        <Text variant="h3" color="inverse">
          Verification Active
        </Text>
      </View>

      <AuthFooter variant="verify" />
    </AuthScreen>
  );
}

function PressableResend({
  secondsLeft,
  onResend,
}: {
  secondsLeft: number;
  onResend: () => void;
}) {
  return (
    <View style={styles.resend}>
      <Text variant="bodySmall" color="secondary" align="center">
        {secondsLeft > 0 ? 'Resend code in ' : 'Didn\u2019t get a code? '}
        <Pressable onPress={onResend} disabled={secondsLeft > 0}>
          <Text variant="label" color="primary">
            {secondsLeft > 0 ? `0:${String(secondsLeft).padStart(2, '0')}` : 'Resend now'}
          </Text>
        </Pressable>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
  },
  verifyBtn: {
    borderRadius: 16,
  },
  resend: {
    marginTop: 4,
  },
  sessionCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    minHeight: 100,
    justifyContent: 'flex-end',
  },
  sessionLabel: {
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.8,
  },
});
