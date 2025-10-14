'use client';

import { useUsers } from '@/hooks/useApi';

export default function UsersPage() {
  const { users, isLoading, error } = useUsers();

  return (
    <div className="container-fluid w-50">
      <h1>Users</h1>

      {isLoading ? (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {users.map(user => (
            <div key={user.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fa-solid fa-user me-2"></i>
                    {user.display_name || 'No Display Name'}
                  </h5>
                  <p className="card-text">
                    <strong>Username:</strong> @{user.username}
                  </p>
                  <p className="card-text">
                    <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <a href={`/users/${user.id}`} className="btn btn-primary btn-sm">
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '1rem' }}>
        <a href="/" className="btn btn-primary">
          <i className="fa-solid fa-home me-2"></i>
          Home
        </a>
      </p>
    </div>
  );
}
