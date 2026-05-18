import { z } from 'zod';

import { CAMPUSES } from '@/constants/campuses';

const campusValues = CAMPUSES.map((c) => c.value) as [string, ...string[]];

export const phoneLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(9, 'Enter a valid phone number')
    .max(15, 'Phone number is too long'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .min(9, 'Enter a valid phone number')
    .max(15, 'Phone number is too long'),
  campus: z.enum(campusValues, { message: 'Select your campus' }),
});

export const phoneOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type PhoneOtpFormValues = z.infer<typeof phoneOtpSchema>;

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
}
