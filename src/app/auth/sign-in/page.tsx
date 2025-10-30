'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useActionState } from 'react';
import { authApi } from '@/api';
import { showToast } from '@/helpers/showToast';
import { ApiError } from '@/api/client'

interface SignInState {
  ok: boolean;
  errors: string[];
}

export default function SignInPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    // Check for success message from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    if (message === 'password-reset-success') {
      setSuccessMessage('Password reset successful! You can now sign in with your new password.');
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function signInAction(prevState: SignInState, formData: FormData): Promise<SignInState> {
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!username || !password) {
      return { ok: false, errors: ['- Username and password are required.'] };
    }

    try {
      await authApi.signIn({ username, password });
      showToast('Sign in successful', 'success');
      router.push('/');
      return { ok: true, errors: [] };
    } catch (error: unknown) {
      const apiErrors = 
        (error as unknown as ApiError).errors?.map((err: string) => `- ${err}`) ?? 
        ['- Invalid username or password. Please try again.'];
      return { ok: false, errors: apiErrors };
    }
  }

  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signInAction, { ok: false, errors: [] });

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base" style={{ height: 'fit-content' }}>
        Sign in
      </h2>
      
      <section className="w-50">
        <form action={formAction}>
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          
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
              autoFocus
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="form-control"
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-3">
          <p className="small">
            Do not have an account?{" "}
            <Link href="/auth/sign-up" className="text-decoration-none">
              Sign up
            </Link>
          </p>
          <p className="small">
            <Link href="/auth/forgot-password" className="text-decoration-none">
              Forgot your password?
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}