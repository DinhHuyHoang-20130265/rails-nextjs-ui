import { AxiosResponse } from 'axios';
import { apiClient, ApiResponse, setAuthToken } from '../client';
import { User, SignInForm, SignUpForm } from '@/types';

// Auth API Response Types
export interface AuthResponse {
  message: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

const getToken = (response: AxiosResponse<AuthResponse>) => {
  // Devise JWT sends the token in the Authorization header
  const authHeader = response.headers.authorization || response.headers.Authorization;
  if (!authHeader) {
    throw new Error('No authorization header found');
  }
  return authHeader.split(' ')[1];
}

// Authentication API Functions
export const authApi = {
  // Sign in user
  signIn: async (credentials: SignInForm): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/users/sign_in', {
        user: credentials
      });

      if (response.status === 200 && response.data) {
        const token = getToken(response);
        setAuthToken(token);
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
  },

  // Sign up new user
  signUp: async (userData: SignUpForm): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/users', { user: userData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send forgot password email
  sendForgotPasswordEmail: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/users/forgot_password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP for password reset
  verifyOtp: async (data: VerifyOtpRequest): Promise<{ valid: boolean }> => {
    try {
      const response = await apiClient.post<{ valid: boolean }>('/users/verify_otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/users/reset_password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  resendOtp: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/users/resend_otp', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user (for session validation)
  getCurrentUser: async (): Promise<{ user: User }> => {
    console.log('Getting current user');
    
    try {
      const response = await apiClient.get<{ user: User }>('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.delete<{ message: string }>('/users/sign_out');
      
      // Clear the token after successful sign out
      setAuthToken(null);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
