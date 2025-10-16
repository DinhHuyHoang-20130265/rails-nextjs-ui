import { apiClient } from '../client';
import { User } from '@/types';

// Users API Response Types
export interface UpdateUserRequest {
  id: number;
  username?: string;
  display_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  current_password?: string;
}

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}


// Users API Functions
export const usersApi = {
  // Get single user by ID
  getUser: async (id: number): Promise<User> => {
    const user = await apiClient.get<User>(`/users/${id}`);
    return user.data;
  },

  // Update user profile
  updateUser: async (userData: UpdateUserRequest): Promise<User> => {
    const user = await apiClient.patch<User>(`/users/${userData.id}`, { user: userData });
    return user.data;
  },

};
