'use client';

import { useState } from 'react';
import { ForgotPasswordState, ForgotPasswordActions } from '@/types/forgot-password';
import { formatOtpInput } from '../helpers/utils';

export const useForgotPassword = (): { state: ForgotPasswordState; actions: ForgotPasswordActions } => {
  const [state, setState] = useState<ForgotPasswordState>({
    stage: 'email',
    formData: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    errors: [],
    isSubmitting: false,
    isResending: false,
    countdown: 0,
  });

  const actions: ForgotPasswordActions = {
    setStage: (stage) => setState(prev => ({ ...prev, stage })),
    setFormData: (formData) => setState(prev => ({ ...prev, formData })),
    setErrors: (errors) => setState(prev => ({ ...prev, errors })),
    setIsSubmitting: (isSubmitting) => setState(prev => ({ ...prev, isSubmitting })),
    setIsResending: (isResending) => setState(prev => ({ ...prev, isResending })),
    setCountdown: (countdown) => setState(prev => ({ ...prev, countdown })),
    
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          [name]: value,
        },
        // Clear errors when user starts typing
        errors: prev.errors.length > 0 ? [] : prev.errors,
      }));
    },
    
    handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = formatOtpInput(e.target.value);
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          otp: value,
        },
        // Clear errors when user starts typing
        errors: prev.errors.length > 0 ? [] : prev.errors,
      }));
    },
  };

  return { state, actions };
};
