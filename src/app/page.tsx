'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { authApi } from '@/api';
import UserProfile from '@/components/UserProfile';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      router.push('/auth/sign-in');
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 py-8 justify-content-center align-items-center d-flex flex-column">
      <Suspense fallback={<LoadingSpinner message="Loading profile..." />}>
        <UserProfile />
      </Suspense>

      <div className="d-flex gap-2 flex-wrap">
        <button 
          onClick={handleLogout}
          className="btn btn-primary"
        >
          Logout
        </button>
        <Link href="/users/edit" className="btn btn-primary">
          Edit Account
        </Link>
        
        <Link href="/tweets" className="btn btn-primary">
          Tweets
        </Link>
      </div>
    </div>
  );
}
