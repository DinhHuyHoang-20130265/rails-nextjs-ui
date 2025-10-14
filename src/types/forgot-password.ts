export interface ForgotPasswordForm {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export type ForgotPasswordStage = 'email' | 'otp' | 'reset';

export interface ForgotPasswordState {
  stage: ForgotPasswordStage;
  formData: ForgotPasswordForm;
  errors: string[];
  isSubmitting: boolean;
  isResending: boolean;
  countdown: number;
}

export interface ForgotPasswordActions {
  setStage: (stage: ForgotPasswordStage) => void;
  setFormData: (formData: ForgotPasswordForm) => void;
  setErrors: (errors: string[]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsResending: (isResending: boolean) => void;
  setCountdown: (countdown: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface StageProps {
  state: ForgotPasswordState;
  actions: ForgotPasswordActions;
}
