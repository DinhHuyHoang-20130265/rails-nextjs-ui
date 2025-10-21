import { ForgotPasswordForm } from '@/types/forgot-password';
import { authApi } from '@/api';

export const validateEmail = async (email: string): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await authApi.sendForgotPasswordEmail(email);
    return { isValid: true };
  } catch (error: unknown) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'An error occurred while sending the reset code.'
    };
  }
};

export const validateOtp = async (email: string, otp: string): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await authApi.verifyOtp({ email, otp });
    return { isValid: true };
    } catch (error: unknown) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'An error occurred while verifying the code.'
    };
  }
};

export const validatePasswordReset = (formData: ForgotPasswordForm): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (formData.newPassword.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }
  
  if (formData.newPassword !== formData.confirmPassword) {
    errors.push('Passwords do not match. Please try again.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
