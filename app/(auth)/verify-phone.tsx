import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
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
const COMPACT_HEIGHT = 700;

export default function VerifyPhoneScreen() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const isCompact = height < COMPACT_HEIGHT;
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
  const canSubmit = code.length === 6;

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
      <View style={styles.header}>
        <Text variant="label" color="primary">
          NexCredit
        </Text>
        <Text variant={isCompact ? 'h2' : 'h1'} style={styles.title}>
          Verify Phone
        </Text>
        <Text variant="body" color="secondary">
          We&apos;ve sent a 6-digit code to {maskedPhone}.
        </Text>
      </View>

      <AuthCard style={styles.card}>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <OtpInput value={value} onChange={onChange} error={Boolean(errors.code)} />
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
          disabled={!canSubmit}
          fullWidth
          size="lg"
          style={styles.verifyBtn}
          rightIcon={
            <Ionicons
              name="lock-closed"
              size={16}
              color={canSubmit ? theme.colors.onPrimary : theme.colors.textMuted}
            />
          }
        />

        <PressableResend secondsLeft={secondsLeft} onResend={handleResend} />
      </AuthCard>

      <SecurityBanner message="NexCredit uses bank-grade 256-bit encryption." />

      {!isCompact ? (
        <View style={[styles.sessionCard, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text variant="caption" color="primary" style={styles.sessionLabel}>
            SECURE SESSION
          </Text>
          <Text variant="h3" color="default">
            Verification Active
          </Text>
        </View>
      ) : null}

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
        {secondsLeft > 0 ? `Resend code in 0:${String(secondsLeft).padStart(2, '0')}` : "Didn't get a code?"}
      </Text>
      {secondsLeft <= 0 ? (
        <Pressable onPress={onResend} style={styles.resendAction}>
          <Text variant="label" color="primary" align="center">
            Resend now
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 20,
  },
  title: {
    marginTop: 4,
  },
  card: {
    gap: 16,
  },
  verifyBtn: {
    borderRadius: 16,
  },
  resend: {
    gap: 4,
    alignItems: 'center',
  },
  resendAction: {
    paddingVertical: 4,
  },
  sessionCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    gap: 4,
  },
  sessionLabel: {
    letterSpacing: 1,
    fontWeight: '600',
  },
});
