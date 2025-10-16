'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import TweetList from '@/components/TweetList';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TweetsPage() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner message="Loading tweets..." />}>
        <TweetList />
      </Suspense>

      <p style={{ marginTop: '1rem' }}>
        <Link href="/" className="btn btn-primary">
          <i className="fa-solid fa-home me-2"></i>
          Home
        </Link>
      </p>
    </>
  );
}