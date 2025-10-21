'use client';

import Link from 'next/link';
import { StageProps } from '@/types/forgot-password';
import { validateEmail } from '../helpers/validation';
import { authApi } from '@/api';
import { startCountdown } from '../helpers/utils';

export default function EmailStage({ state, actions }: StageProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    actions.setIsSubmitting(true);
    actions.setErrors([]);

    try {
      const validation = await validateEmail(state.formData.email);
      
      if (!validation.isValid) {
        actions.setErrors([validation.error!]);
        actions.setIsSubmitting(false);
        return;
      }

      await authApi.sendForgotPasswordEmail(state.formData.email);
      
      // Move to OTP stage
      actions.setStage('otp');
      actions.setCountdown(60); // 60 seconds countdown
      
      // Start countdown
      startCountdown(60, actions.setCountdown, () => {});
      
    } catch (error) {
      console.log(error);
      actions.setErrors(['An error occurred while sending the reset code. Please try again.']);
    } finally {
      actions.setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base mb-4">Reset Password</h2>
      
      <section className="w-50">
        <p className="text-muted mb-4">
          Enter the email address associated with your account and we will send you a verification code.{" "}
        </p>

        <form onSubmit={handleSubmit}>
          {state.errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {state.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.formData.email}
              onChange={actions.handleInputChange}
              required
              className="form-control"
              placeholder="Enter your email address"
              autoFocus
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!state.formData.email || state.isSubmitting}
            >
              {state.isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <p className="small">
            Remember your password?{" "}
            <Link href="/auth/sign-in" className="text-decoration-none">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
