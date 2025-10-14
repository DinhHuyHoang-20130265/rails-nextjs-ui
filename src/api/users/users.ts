import { apiClient, ApiResponse } from '../client';
import { User } from '@/types';

// Users API Response Types
export interface UpdateUserRequest {
  id: number;
  username?: string;
  display_name?: string;
  email?: string;
}

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}


// Users API Functions
export const usersApi = {
  // Get single user by ID
  getUser: async (id: number): Promise<ApiResponse<User>> => {
    
    const user = await apiClient.get<User>(`/users/${id}`);
    if (!user) {
      throw {
        message: 'User not found',
        status: 404,
        errors: ['User does not exist'],
      };
    }
    
    return {
      data: user.data,
      success: true,
    };
  },

  // Update user profile
  updateUser: async (userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    
    const user = await apiClient.put<User>(`/users/${userData.id}`, userData);
    if (!user) {
      throw {
        message: 'User not found',
        status: 404,
        errors: ['User does not exist'],
      };
    }
    
    return {
      data: user.data,
      success: true,
      message: 'Profile updated successfully',
    };
  },

};
