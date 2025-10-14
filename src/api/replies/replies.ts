import { apiClient, ApiResponse } from '../client';
import { Reply } from '@/types';

// Replies API Response Types
export interface CreateReplyRequest {
  content: string;
  parent_id: number;
}

export interface UpdateReplyRequest {
  id: number;
  content: string;
}

export interface ReplyQueryParams {
  tweet_id: number;
  page?: number;
  per_page?: number;
}

// Mock data for demo
let mockReplies: Reply[] = [
  {
    id: 1,
    content: 'Great tweet! 👍',
    user_id: 2,
    parent_id: 1,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    user: {
      id: 2,
      username: 'dev_user',
      display_name: 'Developer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 2,
    content: 'Thanks for sharing this!',
    user_id: 3,
    parent_id: 1,
    created_at: new Date(Date.now() - 900000).toISOString(),
    updated_at: new Date(Date.now() - 900000).toISOString(),
    user: {
      id: 3,
      username: 'reply_user',
      display_name: 'Reply User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// Replies API Functions
export const repliesApi = {
  // Get replies for a specific tweet
  getReplies: async (params: ReplyQueryParams): Promise<ApiResponse<Reply[]>> => {
    // TODO: Replace with real API call
    console.log('Get replies request:', params);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const replies = mockReplies.filter(reply => reply.parent_id === params.tweet_id);
    
    // Apply pagination
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedReplies = replies.slice(startIndex, endIndex);
    
    return {
      data: paginatedReplies,
      success: true,
    };
  },

  // Create new reply
  createReply: async (replyData: CreateReplyRequest): Promise<ApiResponse<Reply>> => {
    // TODO: Replace with real API call
    console.log('Create reply request:', replyData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation
    if (!replyData.content.trim()) {
      throw {
        message: 'Content is required',
        status: 400,
        errors: ['Reply content cannot be empty'],
      };
    }
    
    const newReply: Reply = {
      id: Date.now(),
      content: replyData.content,
      user_id: 1, // Mock current user ID
      parent_id: replyData.parent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 1,
        username: 'demo_user',
        display_name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    
    mockReplies.unshift(newReply); // Add to beginning
    
    return {
      data: newReply,
      success: true,
      message: 'Reply posted successfully',
    };
  },

  // Update existing reply
  updateReply: async (replyData: UpdateReplyRequest): Promise<ApiResponse<Reply>> => {
    // TODO: Replace with real API call
    console.log('Update reply request:', replyData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const replyIndex = mockReplies.findIndex(r => r.id === replyData.id);
    if (replyIndex === -1) {
      throw {
        message: 'Reply not found',
        status: 404,
        errors: ['Reply does not exist'],
      };
    }
    
    // Mock validation
    if (!replyData.content.trim()) {
      throw {
        message: 'Content is required',
        status: 400,
        errors: ['Reply content cannot be empty'],
      };
    }
    
    // Update reply
    mockReplies[replyIndex] = {
      ...mockReplies[replyIndex],
      content: replyData.content,
      updated_at: new Date().toISOString(),
    };
    
    return {
      data: mockReplies[replyIndex],
      success: true,
      message: 'Reply updated successfully',
    };
  },

  // Delete reply
  deleteReply: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    // TODO: Replace with real API call
    console.log('Delete reply request:', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const replyIndex = mockReplies.findIndex(r => r.id === id);
    if (replyIndex === -1) {
      throw {
        message: 'Reply not found',
        status: 404,
        errors: ['Reply does not exist'],
      };
    }
    
    // Remove reply
    mockReplies.splice(replyIndex, 1);
    
    return {
      data: { message: 'Reply deleted successfully' },
      success: true,
      message: 'Reply has been deleted',
    };
  },

  // Load more replies (for pagination)
  loadMoreReplies: async (params: ReplyQueryParams): Promise<ApiResponse<Reply[]>> => {
    // This is essentially the same as getReplies but with different pagination
    return repliesApi.getReplies(params);
  },
};
