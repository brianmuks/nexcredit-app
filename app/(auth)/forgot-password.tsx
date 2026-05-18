import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthCard, AuthField, AuthFooter, AuthHeader, AuthScreen } from '@/components/auth';
import { Button, Text } from '@/components/ui';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth-schemas';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

export default function ForgotPasswordScreen() {
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      Alert.alert('Request failed', (err as ApiError).message ?? 'Try again later.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreen showBack>
      <AuthHeader
        title="Reset password"
        subtitle={
          sent
            ? 'Check your email for a reset link.'
            : 'Enter your email and we will send you a reset link'
        }
        logoWidth={80}
      />

      {!sent ? (
        <AuthCard>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthField
                label="Email"
                placeholder="you@university.edu"
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Button
            label="Send reset link"
            onPress={onSubmit}
            loading={submitting}
            fullWidth
            size="lg"
            style={styles.btn}
          />
        </AuthCard>
      ) : (
        <Button
          label="Back to sign in"
          onPress={() => router.replace('/(auth)/login')}
          fullWidth
          size="lg"
        />
      )}

      <AuthFooter variant="login" />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 16,
  },
});
