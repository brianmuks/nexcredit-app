import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button, Screen, Text, TextField } from '@/components/ui';
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
      const message = (err as ApiError).message ?? 'Could not send reset link.';
      Alert.alert('Request failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen>
      <AuthHeader
        title="Reset password"
        subtitle={
          sent
            ? 'Check your email for a reset link.'
            : 'Enter your email and we will send you a reset link'
        }
      />

      {!sent ? (
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email"
                placeholder="you@university.ac.zm"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Button label="Send reset link" onPress={onSubmit} loading={submitting} fullWidth />
        </View>
      ) : (
        <Button label="Back to sign in" onPress={() => router.replace('/(auth)/login')} fullWidth />
      )}

      <Link href="/(auth)/login" asChild>
        <Text variant="label" color="primary" align="center" style={styles.back}>
          Back to sign in
        </Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  back: {
    marginTop: 24,
  },
});
