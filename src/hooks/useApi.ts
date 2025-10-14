import { useState } from 'react';
import useSWR from 'swr';
import { apiClient, ApiResponse, clearAuthToken, getAuthToken } from '@/api/client';
import { User, Tweet, Reply, PaginatedResponse } from '@/types';

// SWR Fetcher function
export const fetcher = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data;
};

// Auth hooks
export const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<User>>(
    getAuthToken() ? '/users/me' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, 
      shouldRetryOnError: false,
      errorRetryCount: 0, 
      onError: (error) => {
        if (error.status === 401) {
          console.log('User not authenticated - clearing token');
          clearAuthToken();
        }
      },
    }
  );

  return {
    user: data?.data || null,
    isLoading,
    error,
    mutate,
    isAuthenticated: !!data?.data && !error,
  };
};

// Tweets hooks
export const useTweets = (params: { page?: number; per_page?: number; sort?: string; direction?: string } = {}) => {
  const queryString = new URLSearchParams(params as any).toString();
  const url = queryString ? `/tweets?${queryString}` : '/tweets';
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<PaginatedResponse<Tweet>>>(
    // Only make the request if we're on the client and have a token
    getAuthToken() ? url : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    tweets: data?.data.tweets || [],
    pagination: data?.data.meta,
    isLoading,
    error,
    mutate,
  };
};

export const useTweet = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Tweet>>(
    // Only make the request if we're on the client, have a token, and have an id
    getAuthToken() && id ? `/tweets/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    tweet: data?.data || null,
    isLoading,
    error,
    mutate,
  };
};


export const useUser = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<User>>(
    // Only make the request if we're on the client, have a token, and have an id
    getAuthToken() && id ? `/users/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    user: data?.data || null,
    isLoading,
    error,
    mutate,
  };
};

// Replies hooks
export const useReplies = (tweetId: number, params: { page?: number; per_page?: number } = {}) => {
  const queryString = new URLSearchParams(params as any).toString();
  const url = queryString ? `/tweets/${tweetId}/replies?${queryString}` : `/tweets/${tweetId}/replies`;
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Reply[]>>(
    // Only make the request if we're on the client, have a token, and have a tweetId
    getAuthToken() && tweetId ? url : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    replies: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

// Mutation hooks for data modification
export const useCreateTweet = () => {
  const { mutate } = useTweets();
  
  const createTweet = async (data: { content: string }) => {
    // Only allow creation if we have a valid token
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    // Import tweetsApi here to avoid circular dependency
    const { tweetsApi } = await import('@/api');
    const result = await tweetsApi.createTweet(data);
    mutate(); // Refresh tweets list
    return result;
  };

  return { createTweet };
};

export const useUpdateTweet = () => {
  const { mutate } = useTweets();
  
  const updateTweet = async (data: { id: number; content: string }) => {
    // Only allow update if we have a valid token
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const { tweetsApi } = await import('@/api');
    const result = await tweetsApi.updateTweet(data);
    mutate(); // Refresh tweets list
    return result;
  };

  return { updateTweet };
};

export const useDeleteTweet = () => {
  const { mutate } = useTweets();
  
  const deleteTweet = async (id: number) => {
    // Only allow deletion if we have a valid token
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const { tweetsApi } = await import('@/api');
    const result = await tweetsApi.deleteTweet(id);
    mutate(); // Refresh tweets list
    return result;
  };

  return { deleteTweet };
};

// Generic mutation hook for API calls
export const useApiMutation = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (apiCall: () => Promise<ApiResponse<T>>) => {
    if (!getAuthToken()) {
      return {
        mutate: () => {},
      };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};
