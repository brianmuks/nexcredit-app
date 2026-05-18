import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button, Screen, Text, TextField } from '@/components/ui';
import { loginSchema, type LoginFormValues } from '@/lib/auth-schemas';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      router.replace('/(tabs)');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Login failed. Please try again.';
      Alert.alert('Sign in failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to check loans and manage your ledger"
      />

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
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <Text variant="label" color="primary" style={styles.forgotLink}>
            Forgot password?
          </Text>
        </Link>

        <Button label="Sign in" onPress={onSubmit} loading={submitting} fullWidth />

        <View style={styles.footer}>
          <Text variant="bodySmall" color="secondary">
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Text variant="label" color="primary">
              Create account
            </Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
});
