'use client';

import { StageProps } from '@/types/forgot-password';
import { validatePasswordReset } from '../helpers/validation';
import { resetPassword, redirectToLogin } from '../helpers/api';

export default function ResetStage({ state, actions }: StageProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    actions.setIsSubmitting(true);
    actions.setErrors([]);

    try {
      const validation = validatePasswordReset(state.formData);
      
      if (!validation.isValid) {
        actions.setErrors(validation.errors);
        actions.setIsSubmitting(false);
        return;
      }

      await resetPassword(state.formData.email, state.formData.newPassword, state.formData.otp);
      
      // Redirect to login page
      redirectToLogin();
      
    } catch (error) {
      actions.setErrors(['An error occurred while resetting your password. Please try again.']);
    } finally {
      actions.setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base mb-4">Set New Password</h2>
      
      <section className="w-50">
        <p className="text-muted mb-4">
          Create a new password for <strong>{state.formData.email}</strong>
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
            <label htmlFor="newPassword" className="form-label">
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={state.formData.newPassword}
              onChange={actions.handleInputChange}
              required
              minLength={6}
              className="form-control"
              placeholder="Enter new password"
              autoFocus
            />
            <div className="form-text">Password must be at least 6 characters long.</div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={state.formData.confirmPassword}
              onChange={actions.handleInputChange}
              required
              minLength={6}
              className="form-control"
              placeholder="Confirm new password"
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!state.formData.newPassword || !state.formData.confirmPassword || state.isSubmitting}
            >
              {state.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <p className="small">
            Remember your password?{' '}
            <a href="/auth/sign-in" className="text-decoration-none">
              Sign in
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
