export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ForgotPasswordResult {
  message: string;
}

export interface VerifyOtpResult {
  resetToken: string;
}

export interface ResetPasswordResult {
  message: string;
}