import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button, Screen, Text, TextField } from '@/components/ui';
import { registerSchema, type RegisterFormValues } from '@/lib/auth-schemas';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError, UserRole } from '@/types/auth';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'borrower', label: 'Borrower' },
  { value: 'lender', label: 'Lender' },
  { value: 'rep', label: 'Student rep' },
];

export default function RegisterScreen() {
  const theme = useTheme();
  const register = useAuthStore((s) => s.register);
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      studentId: '',
      role: 'borrower',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const { confirmPassword: _, ...input } = values;
      await register(input);
      router.replace('/(tabs)');
    } catch (err) {
      const message = (err as ApiError).message ?? 'Registration failed. Please try again.';
      Alert.alert('Sign up failed', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen contentContainerStyle={styles.scroll}>
      <AuthHeader
        title="Join nexcredit"
        subtitle="Create an account to lend and borrow with transparency"
      />

      <View style={styles.form}>
        <View style={styles.row}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="First name"
                placeholder="Jane"
                containerStyle={styles.half}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Last name"
                placeholder="Banda"
                containerStyle={styles.half}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
              />
            )}
          />
        </View>

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

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Phone"
              placeholder="+260 97X XXX XXX"
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
          name="studentId"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Student ID (optional)"
              placeholder="BC / student number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.studentId?.message}
            />
          )}
        />

        <View>
          <Text variant="label" color="secondary" style={styles.roleLabel}>
            I am a
          </Text>
          <View style={styles.roleRow}>
            {ROLES.map((role) => {
              const active = selectedRole === role.value;
              return (
                <Pressable
                  key={role.value}
                  onPress={() => setValue('role', role.value, { shouldValidate: true })}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: active
                        ? theme.colors.primary
                        : theme.colors.inputBackground,
                      borderColor: active ? theme.colors.primary : theme.colors.border,
                    },
                  ]}>
                  <Text variant="label" color={active ? 'inverse' : 'default'}>
                    {role.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.role?.message ? (
            <Text variant="caption" color="error" style={styles.roleError}>
              {errors.role.message}
            </Text>
          ) : null}
        </View>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Confirm password"
              placeholder="Repeat password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button label="Create account" onPress={onSubmit} loading={submitting} fullWidth />

        <View style={styles.footer}>
          <Text variant="bodySmall" color="secondary">
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Text variant="label" color="primary">
              Sign in
            </Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 48,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  roleLabel: {
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  roleError: {
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
});
