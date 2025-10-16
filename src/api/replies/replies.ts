import { apiClient, ApiResponse } from '../client';
import { PaginatedResponse, Reply } from '@/types';

// Replies API Response Types
export interface CreateReplyRequest {
  content: string;
}

export interface UpdateReplyRequest {
  id: number;
  content: string;
}

export interface ReplyQueryParams {
  page?: number;
  per_page?: number;
}


// Replies API Functions
export const repliesApi = {
  // Get replies for a specific tweet
  getReplies: async (tweetId: number, params: ReplyQueryParams): Promise<PaginatedResponse<Reply>> => {
    const response = await apiClient.get<PaginatedResponse<Reply>>(`tweets/${tweetId}/replies`, { params });
    return response.data;
  },

  // Create new reply
  createReply: async (tweetId: number, replyData: CreateReplyRequest): Promise<Reply> => {
    const response = await apiClient.post<Reply>(`tweets/${tweetId}/replies`, {reply: replyData});
    return response.data;
  },

  // Update existing reply
  updateReply: async (tweetId: number, replyData: UpdateReplyRequest): Promise<Reply> => {
    const response = await apiClient.put<Reply>(`tweets/${tweetId}/replies/${replyData.id}`, {reply: replyData});
    return response.data;
  },

  // Delete reply
  deleteReply: async (tweetId: number, id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`tweets/${tweetId}/replies/${id}`);
    return response.data;
  },

  // Load more replies (for pagination)
  loadMoreReplies: async (tweetId: number, params: ReplyQueryParams): Promise<PaginatedResponse<Reply>> => {
    // This is essentially the same as getReplies but with different pagination
    const response = await apiClient.get<PaginatedResponse<Reply>>(`tweets/${tweetId}/replies`, { params });
    return response.data;
  },
};
