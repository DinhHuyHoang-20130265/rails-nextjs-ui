'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SignInForm } from '@/types';
import { authApi } from '@/api';
import { showToast } from '@/helpers/showToast';
import { ApiError } from '@/api/client'

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInForm>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      await authApi.signIn(formData);
      showToast('Sign in successful', 'success');
      router.push('/');
    } catch (error: unknown) {
      console.log(error);
      setErrors(error instanceof Error ? 
        (error as unknown as ApiError).errors?.map((error: string) => "- " + error) ?? [] : 
        ['Invalid username or password. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.username && formData.password;
  };

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base" style={{ height: 'fit-content' }}>
        Sign in
      </h2>
      
      <section className="w-50">
        <form onSubmit={handleSubmit}>
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0 p-0">
                {errors.map((error, index) => (
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
              value={formData.username}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
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