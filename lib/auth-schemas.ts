import { z } from 'zod';

import { CAMPUSES } from '@/constants/campuses';

const campusValues = CAMPUSES.map((c) => c.value) as [string, ...string[]];

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Phone or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .min(9, 'Enter a valid phone number')
    .max(15, 'Phone number is too long'),
  email: z
    .string()
    .email('Enter a valid email address')
    .transform((v) => v.toLowerCase().trim()),
  campus: z.enum(campusValues, { message: 'Select your campus' }),
});

export const phoneOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .transform((v) => v.toLowerCase().trim()),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type PhoneOtpFormValues = z.infer<typeof phoneOtpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
}

export function parseLoginIdentifier(identifier: string): { email?: string; phone?: string } {
  const value = identifier.trim();
  if (value.includes('@')) {
    return { email: value.toLowerCase() };
  }
  return { phone: value };
}
