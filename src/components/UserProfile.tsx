'use client';

import { useCurrentUser } from '@/hooks/useApi';

export default function UserProfile() {
  const { user: currentUser, error } = useCurrentUser();

  if (error) {
    return (
      <div className="alert alert-danger">
        Error loading user profile: {error.message}
      </div>
    );
  }

  return (
    <section className="gap-2 d-flex flex-column justify-content-center align-items-center">
      <h1>
        Hi, {currentUser?.display_name || 'User'} @{currentUser?.username}
      </h1>
      <p>You are logged in ✅</p>
    </section>
  );
}
