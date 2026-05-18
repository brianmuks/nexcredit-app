import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthScreen,
  CampusPicker,
  PromoCard,
  SecurityBanner,
} from '@/components/auth';
import { Button, Text } from '@/components/ui';
import type { CampusValue } from '@/constants/campuses';
import {
  registerSchema,
  splitFullName,
  type RegisterFormValues,
} from '@/lib/auth-schemas';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/auth';

export default function RegisterScreen() {
  const setPendingRegistration = useAuthStore((s) => s.setPendingRegistration);
  const requestPhoneOtp = useAuthStore((s) => s.requestPhoneOtp);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
    },
  });

  const campus = watch('campus');

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const { firstName, lastName } = splitFullName(values.fullName);
      const registration = {
        firstName,
        lastName,
        email: values.email,
        phone: values.phone,
        campus: values.campus,
        role: 'borrower' as const,
      };

      setPendingRegistration(registration);
      await requestPhoneOtp(values.phone);
      router.push('/(auth)/verify-phone');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Could not continue. Please try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreen showBack>
      <AuthHeader
        title="Create Account"
        subtitle="Elevate your financial lifestyle today."
        logoWidth={72}
        compact
        showLogo
      />

      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Full name"
              placeholder="Jane Banda"
              leftIcon="person-outline"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Phone number"
              placeholder="+260 97X XXX XXX"
              leftIcon="call-outline"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Email address"
              placeholder="jane.b@university.edu"
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

        <CampusPicker
          value={campus as CampusValue | undefined}
          onChange={(v) => setValue('campus', v, { shouldValidate: true })}
          error={errors.campus?.message}
        />

        <SecurityBanner />

        <Button
          label="Continue"
          onPress={onSubmit}
          loading={submitting}
          fullWidth
          size="lg"
          style={styles.continueBtn}
        />

        <View style={styles.loginRow}>
          <Text variant="bodySmall" color="secondary">
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text variant="label" color="primary">
                Login
              </Text>
            </Pressable>
          </Link>
        </View>

        <PromoCard />
      </View>

      <AuthFooter variant="register" />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  continueBtn: {
    borderRadius: 16,
    marginTop: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
