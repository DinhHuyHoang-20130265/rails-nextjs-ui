'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { ApiError, authApi } from '@/api';
import { showToast } from '@/helpers/showToast';

// Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

interface SignUpState {
  ok: boolean;
  errors: string[];
}

export default function SignUpPage() {
  const router = useRouter();

  async function signUpAction(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const display_name = String(formData.get('display_name') ?? '').trim();
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const password_confirmation = String(formData.get('password_confirmation') ?? '');

    const errs: string[] = [];
    if (!username) errs.push('- Username is required.');
    if (!passwordRegex.test(password)) errs.push('- Password must be 8+ chars, include upper, lower and digit.');
    if (password !== password_confirmation) errs.push('- Password confirmation does not match.');

    if (errs.length > 0) {
      return { ok: false, errors: errs };
    }

    try {
      await authApi.signUp({ display_name, username, password, password_confirmation });
      showToast('Sign up successful, please sign in to continue', 'success');
      router.push('/auth/sign-in');
      return { ok: true, errors: [] };
    } catch (error: unknown) {
      const apiErrors = (error as unknown as ApiError).errors?.map((e: string) => `- ${e}`) ?? ['- An error occurred during sign up. Please try again.'];
      showToast('Sign up failed, please try again', 'error');
      return { ok: false, errors: apiErrors };
    }
  }

  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(signUpAction, { ok: false, errors: [] });

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base" style={{ height: 'fit-content' }}>
        Sign up
      </h2>

      <section className="w-50">
        <form action={formAction}>
          {state.errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0 p-0">
                {state.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="display_name" className="form-label">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              className="form-control"
              autoFocus
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              minLength={1}
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <p className="small text-muted">
              8 characters minimum, one lowercase letter, one uppercase letter, and one digit
            </p>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password_confirmation" className="form-label">
              Password Confirmation *
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              required
              minLength={8}
              className="form-control"
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="mt-3">
          <p className="small">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-decoration-none">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}