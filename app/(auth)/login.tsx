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
import { phoneLoginSchema, type PhoneLoginFormValues } from '@/lib/auth-schemas';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

export default function LoginScreen() {
  const theme = useTheme();
  const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = handleSubmit(async ({ phone }) => {
    setSubmitting(true);
    try {
      await requestPhoneOtp(phone, null);
      router.push('/(auth)/verify-phone');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Could not send code. Please try again.';
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
        subtitle="Sign in with your mobile number"
        logoWidth={100}
      />

      <AuthCard>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Phone number"
              placeholder="+260 97X XXX XXX"
              leftIcon="call-outline"
              keyboardType="phone-pad"
              autoComplete="tel"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
            />
          )}
        />

        <Button
          label="Send code"
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
  signInBtn: {
    borderRadius: 16,
    marginTop: 4,
  },
  faceIdBtn: {
    borderRadius: 16,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
});
