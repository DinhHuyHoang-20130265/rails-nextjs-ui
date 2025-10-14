import { apiClient, ApiResponse } from '../client';
import { Tweet, TweetFilters, PaginatedResponse } from '@/types';

// Tweets API Response Types
export interface CreateTweetRequest {
  content: string;
}

export interface UpdateTweetRequest {
  id: number;
  content: string;
}

export interface TweetQueryParams {
  sort?: string;
  direction?: string;
  page?: number;
  per_page?: number;
}

// Tweets API Functions
export const tweetsApi = {
  // Get all tweets with pagination and sorting
  getTweets: async (params: TweetQueryParams = {}): Promise<ApiResponse<PaginatedResponse<Tweet>>> => {
    const response = await apiClient.get<PaginatedResponse<Tweet>>(`/tweets`, { params });
    return {
      data: response.data,
      success: true,
    };
  },

  // Get single tweet by ID
  getTweet: async (id: number): Promise<ApiResponse<Tweet>> => {
    const response = await apiClient.get<Tweet>(`/tweets/${id}`);
    return {
      data: response.data,
      success: true,
    };
  },

  // Create new tweet
  createTweet: async (tweetData: CreateTweetRequest): Promise<ApiResponse<Tweet>> => {
    const response = await apiClient.post<Tweet>(`/tweets`, tweetData);
    return {
      data: response.data,
      success: true,
    };
  },

  // Update existing tweet
  updateTweet: async (tweetData: UpdateTweetRequest): Promise<ApiResponse<Tweet>> => {
    // TODO: Replace with real API call
    const response = await apiClient.put<Tweet>(`/tweets/${tweetData.id}`, tweetData);

    // Simulate API delay
    return {
      data: response.data,
      success: true,
    };
  },



  // Delete tweet
  deleteTweet: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    // TODO: Replace with real API call
    const response = await apiClient.delete<{ message: string }>(`/tweets/${id}`);

    // Simulate API delay
    return {
      data: response.data,
      success: true,
    };
  },



  // Load more tweets (for infinite scroll)
  loadMoreTweets: async (params: TweetQueryParams): Promise<ApiResponse<PaginatedResponse<Tweet>>> => {
    const response = await apiClient.get<PaginatedResponse<Tweet>>(`/tweets`, { params });
    return {
      data: response.data,
      success: true,
    };
  },
};
