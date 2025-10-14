'use client';

import { StageProps } from '@/types/forgot-password';
import { validateOtp } from '../helpers/validation';
import { resendOtp } from '../helpers/api';
import { startCountdown } from '../helpers/utils';

export default function OtpStage({ state, actions }: StageProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    actions.setIsSubmitting(true);
    actions.setErrors([]);

    try {
      const validation = await validateOtp(state.formData.email, state.formData.otp);
      
      if (!validation.isValid) {
        actions.setErrors([validation.error!]);
        actions.setIsSubmitting(false);
        return;
      }

      // Move to password reset stage
      actions.setStage('reset');
      
    } catch (error) {
      actions.setErrors(['An error occurred while verifying the code. Please try again.']);
    } finally {
      actions.setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    actions.setIsResending(true);
    actions.setErrors([]);

    try {
      await resendOtp(state.formData.email);
      actions.setCountdown(60); // Reset countdown
      
      // Start countdown
      startCountdown(60, actions.setCountdown, () => {});
      
    } catch (error) {
      actions.setErrors(['Failed to resend code. Please try again.']);
    } finally {
      actions.setIsResending(false);
    }
  };

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base mb-4">Enter Verification Code</h2>
      
      <section className="w-50">
        <p className="text-muted mb-4">
          We've sent a 6-digit verification code to <strong>{state.formData.email}</strong>
        </p>
        <p className="small text-muted mb-4">
          Please check your email and enter the code below. (For demo: use any 6-digit code ending in 1, 2, or 3)
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
            <label htmlFor="otp" className="form-label">
              Verification Code *
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={state.formData.otp}
              onChange={actions.handleOtpChange}
              required
              className="form-control text-center"
              placeholder="000000"
              maxLength={6}
              style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
              autoFocus
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={state.formData.otp.length !== 6 || state.isSubmitting}
            >
              {state.isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <p className="small text-muted">
            Didn't receive the code?{' '}
            {state.countdown > 0 ? (
              <span>Resend in {state.countdown}s</span>
            ) : (
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={handleResendOtp}
                disabled={state.isResending}
              >
                {state.isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </p>
          
          <p className="small mt-2">
            <a href="/auth/forgot-password" className="text-decoration-none">
              ← Back to email entry
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
