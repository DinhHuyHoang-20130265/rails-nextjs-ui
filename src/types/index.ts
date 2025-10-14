// User interface matching Rails User model
export interface User {
  id: number;
  username: string;
  display_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Tweet interface matching Rails Tweet model
export interface Tweet {
  id: number;
  content: string;
  user_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  parent?: Tweet;
  replies?: Tweet[];
  reply_count?: number;
}

// Reply interface (inherits from Tweet in Rails)
export interface Reply extends Tweet {
  parent_id: number; // Required for replies
}

// Form interfaces
export interface TweetForm {
  content: string;
}

export interface ReplyForm {
  content: string;
  parent_id: number;
}

export interface UserForm {
  username: string;
  display_name?: string;
  password: string;
  password_confirmation?: string;
}

// Authentication interfaces
export interface SignInForm {
  username: string;
  password: string;
}

export interface SignUpForm {
  username: string;
  display_name?: string;
  password: string;
  password_confirmation: string;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  tweets: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

// Sorting options matching Rails controller
export type SortOption = 'date' | 'most_replies' | 'display_name';
export type SortDirection = 'asc' | 'desc';

export interface TweetFilters {
  sort?: SortOption;
  direction?: SortDirection;
  page?: number;
  per_page?: number;
}
