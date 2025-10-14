import { authApi } from '@/api';

export const sendResetEmail = async (email: string): Promise<void> => {
  await authApi.sendForgotPasswordEmail(email);
};

export const resendOtp = async (email: string): Promise<void> => {
  await authApi.resendOtp(email);
};

export const resetPassword = async (email: string, newPassword: string, otp: string): Promise<void> => {
  await authApi.resetPassword({ email, newPassword, otp });
};

export const redirectToLogin = (): void => {
  window.location.href = '/auth/sign-in?message=password-reset-success';
};
