'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { usersApi, UpdateUserRequest } from '@/api/users/users';
import { useCurrentUser } from '@/hooks/useApi';
import { routerService } from '@/helpers/router';
import { showToast } from '@/helpers/showToast';

interface UserEditProps {
  userId?: number;
  onSave?: (user: User) => void;
  onCancel?: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ userId, onSave, onCancel }) => {
  const { user: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: '',
  });

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!userId && !currentUser) return;
      
      setIsLoading(true);
      try {
        let userData: User;
        if (userId && userId !== currentUser?.id) {
          // Load different user
          userData = await usersApi.getUser(userId);
        } else {
          // Use current user
          userData = currentUser!;
        }
        
        setUser(userData);
        setFormData({
          username: userData.username || '',
          display_name: userData.display_name || '',
          email: userData.email || '',
          password: '',
          password_confirmation: '',
          current_password: '',
        });
      } catch (error: any) {
        console.error('Error loading user:', error);
        showToast('Failed to load user data', 'error');
        if (onCancel) onCancel();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId, currentUser, onCancel]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.display_name) {
      newErrors.display_name = 'Display name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one digit';
    } else if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required for updating profile';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsSaving(true);
    try {
      const updateData: UpdateUserRequest = {
        id: user.id,
        username: formData.username.trim(),
        display_name: formData.display_name.trim() || undefined,
        email: formData.email.trim() || undefined,
        password: formData.password.trim() || undefined,
        password_confirmation: formData.password_confirmation.trim() || undefined,
        current_password: formData.current_password.trim() || undefined,
      };

      const updatedUser = await usersApi.updateUser(updateData);
      
      // Update current user cache if editing current user
      if (!userId || userId === currentUser?.id) {
        mutateCurrentUser();
      }
      
      showToast('Profile updated successfully', 'success');
      
      if (onSave) {
        onSave(updatedUser);
      } else {
        // Default navigation behavior
        routerService.push('/');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      const message = error?.response?.data?.message || 'Failed to update profile';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      routerService.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? 'border-red-500 border-2' : 'border'
            }`}
            placeholder="Enter username"
            disabled={isSaving}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Display Name Field */}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="display_name"
            value={formData.display_name}
            onChange={(e) => handleInputChange('display_name', e.target.value)}
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.display_name ? 'border-red-500 border-2' : 'border'
            }`}
            placeholder="Enter display name"
            disabled={isSaving}
          />
          {errors.display_name && (
            <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ?
                'border-red-500 border-2' : 'border'
            }`}
            placeholder="Enter email address"
            disabled={isSaving}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password"
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500 border-2' : 'border'
            }`}
            disabled={isSaving}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
            Password Confirmation
          </label>
          <input
            type="password"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
            placeholder="Enter password confirmation"
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password_confirmation ? 'border-red-500 border-2' : 'border'
            }`}
            disabled={isSaving}
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
          )}
        </div>

        {/* Current Password Field */}
        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="current_password"
            value={formData.current_password}
            onChange={(e) => handleInputChange('current_password', e.target.value)}
            placeholder="Enter current password"
            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.current_password ? 'border-red-500 border-2' : 'border'
            }`}
            disabled={isSaving}
          />
          {errors.current_password && (
            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
