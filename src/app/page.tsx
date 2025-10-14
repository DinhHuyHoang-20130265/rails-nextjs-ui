'use client';

import { useCurrentUser } from '@/hooks/useApi';
import { authApi } from '@/api';

export default function Home() {
  const { user: currentUser, isLoading, error } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      window.location.href = '/auth/sign-in';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      window.location.href = '/auth/sign-in';
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid w-50 text-center h-100 justify-content-center align-items-center d-flex">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="gap-2 d-flex flex-column h-100 justify-content-center align-items-center">
      <h1>
        Hi, {currentUser?.display_name || 'User'} @{currentUser?.username}
      </h1>

      <p>You are logged in ✅</p>

      <div className="d-flex gap-2 flex-wrap">
        <button 
          onClick={handleLogout}
          className="btn btn-primary"
        >
          Logout
        </button>
        
        <a href="/auth/edit" className="btn btn-primary">
          Edit Account
        </a>
        
        <a href="/tweets" className="btn btn-primary">
          Tweets
        </a>
        
        <a href="/users" className="btn btn-primary">
          Users
        </a>
      </div>
    </section>
  );
}
