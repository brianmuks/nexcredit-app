export type UserRole = 'borrower' | 'lender' | 'rep';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  studentId?: string;
  isBcVerified?: boolean;
};

export type LoginInput = {
  email?: string;
  phone?: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  campus: string;
  role?: UserRole;
  password?: string;
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
