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
  getTweets: async (params: TweetQueryParams = {}): Promise<PaginatedResponse<Tweet>> => {
    const response = await apiClient.get<PaginatedResponse<Tweet>>(`/tweets`, { params });
    return response.data;
  },

  // Get single tweet by ID
  getTweet: async (id: number): Promise<Tweet> => {
    const response = await apiClient.get<Tweet>(`/tweets/${id}`);
    return response.data;
  },

  // Create new tweet
  createTweet: async (tweetData: CreateTweetRequest): Promise<Tweet> => {
    const response = await apiClient.post<Tweet>(`/tweets`, tweetData);
    return response.data;
  },

  // Update existing tweet
  updateTweet: async (tweetData: UpdateTweetRequest): Promise<Tweet> => {
    const response = await apiClient.put<Tweet>(`/tweets/${tweetData.id}`, tweetData);
    return response.data;
  },

  // Delete tweet
  deleteTweet: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/tweets/${id}`);
    return response.data;
  },

  // Load more tweets (for infinite scroll)
  loadMoreTweets: async (params: TweetQueryParams): Promise<PaginatedResponse<Tweet>> => {
    const response = await apiClient.get<PaginatedResponse<Tweet>>(`/tweets`, { params });
    return response.data;
  },
};
