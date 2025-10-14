// API Configuration and Base Client
export { apiClient, API_CONFIG, type ApiResponse, type ApiError, clearAuthToken, setAuthToken, getAuthToken } from './client';

// Import APIs
import { authApi } from './auth/auth';
import { tweetsApi } from './tweets/tweets';
import { usersApi } from './users/users';
import { repliesApi } from './replies/replies';

// Re-export APIs
export { authApi, tweetsApi, usersApi, repliesApi };

// Export types
export type { 
  AuthResponse, 
  ForgotPasswordRequest, 
  VerifyOtpRequest, 
  ResetPasswordRequest 
} from './auth/auth';

export type { 
  CreateTweetRequest, 
  UpdateTweetRequest, 
  TweetQueryParams 
} from './tweets/tweets';

export type { 
  UpdateUserRequest, 
  UserQueryParams 
} from './users/users';

export type { 
  CreateReplyRequest, 
  UpdateReplyRequest, 
  ReplyQueryParams 
} from './replies/replies';

// Combined API object for easy access
export const api = {
  auth: authApi,
  tweets: tweetsApi,
  users: usersApi,
  replies: repliesApi,
};
