import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import {
  AuthCard,
  AuthDivider,
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthScreen,
} from '@/components/auth';
import { Button, Text } from '@/components/ui';
import { loginSchema, parseLoginIdentifier, type LoginFormValues } from '@/lib/auth-schemas';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

export default function LoginScreen() {
  const theme = useTheme();
  const login = useAuthStore((s) => s.login);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const parsed = parseLoginIdentifier(values.identifier);
      await login({ ...parsed, password: values.password });
      router.replace('/(tabs)');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Sign in failed. Please try again.';
      Alert.alert('Sign in failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  const handleFaceId = () => {
    Alert.alert('Face ID', 'Biometric sign-in will be available in a future update.');
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Welcome Back"
        subtitle="Access your premium credit suite"
        logoWidth={100}
      />

      <AuthCard>
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Phone or email"
              placeholder="Enter your details"
              leftIcon="person-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.identifier?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Password"
              placeholder="••••••••"
              leftIcon="lock-closed-outline"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              labelRight={
                <Link href="/(auth)/forgot-password" asChild>
                  <Text variant="caption" color="primary" style={styles.forgot}>
                    Forgot Password?
                  </Text>
                </Link>
              }
            />
          )}
        />

        <Button
          label="Sign In"
          onPress={onSubmit}
          loading={submitting}
          fullWidth
          size="lg"
          style={styles.signInBtn}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />}
        />
      </AuthCard>

      <AuthDivider label="Or secure with" />

      <Button
        label="Sign in with FaceID"
        variant="outline"
        fullWidth
        size="lg"
        onPress={handleFaceId}
        leftIcon={<Ionicons name="scan-outline" size={22} color={theme.colors.primary} />}
        style={styles.faceIdBtn}
      />

      <View style={styles.signUpRow}>
        <Text variant="bodySmall" color="secondary">
          New to NexCredit?{' '}
        </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text variant="label" color="primary">
              Create an account
            </Text>
          </Pressable>
        </Link>
      </View>

      <AuthFooter variant="login" />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  forgot: {
    fontWeight: '600',
  },
  signInBtn: {
    borderRadius: 16,
    marginTop: 4,
  },
  faceIdBtn: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
});
