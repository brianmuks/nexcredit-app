export type UserRole = 'borrower' | 'lender' | 'rep';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  campus?: string;
  studentId?: string;
  isBcVerified?: boolean;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  phone: string;
  campus: string;
  role?: UserRole;
};

export type PhoneOtpRequestInput = {
  phone: string;
};

export type PhoneOtpVerifyInput = {
  phone: string;
  code: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  message: string;
  status?: number;
};
