'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignUpForm } from '@/types';
import { authApi } from '@/api';
import { showToast } from '@/helpers/showToast';

// Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit
const passwordRegex = /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}\z/;

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpForm>({
    username: '',
    display_name: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await authApi.signUp(formData);

      showToast('Sign up successful, please sign in to continue', 'success');
      // Redirect to home
      router.push('/auth/sign-in');
    } catch (error: any) {
      showToast('Sign up failed, please try again', 'error');
      setErrors(error.errors ? error.errors.map((error: any) => "- " + error) :
        ['An error occurred during sign up. Please try again.']);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.display_name &&
      formData.username &&
      passwordRegex.test(formData.password) &&
      formData.password === formData.password_confirmation
    );
  };

  return (
    <div className="container-fluid w-50">
      <h2 className="lh-base" style={{ height: 'fit-content' }}>
        Sign up
      </h2>

      <section className="w-50">
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="display_name" className="form-label">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
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
              value={formData.username}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
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
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required
              minLength={6}
              className="form-control"
            />
          </div>

          <div className="actions pt-2 pb-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
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