import { useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { clearAuthToken, getAuthToken } from '@/api/client';
import { User, Tweet, Reply, PaginatedResponse } from '@/types';
import { TweetQueryParams, tweetsApi } from '@/api/tweets/tweets';
import { authApi } from '@/api/auth/auth';
import { repliesApi, ReplyQueryParams } from '@/api/replies/replies';
import { usersApi, UpdateUserRequest } from '@/api/users/users';

// Auth hooks
export const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>(
    getAuthToken() ? 'current-user' : null,
    () => authApi.getCurrentUser(),
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
    user: data?.user || null,
    isLoading,
    error,
    mutate,
    isAuthenticated: !!data?.user && !error,
  };
};

// Tweets hooks
export const useTweets = (params: TweetQueryParams = {}) => {
  // Create a stable key for the infinite query that includes filter params
  const filterKey = JSON.stringify({ sort: params.sort, direction: params.direction, per_page: params.per_page });
  
  const { data, error, isLoading, mutate, size, setSize, isValidating } = useSWRInfinite<PaginatedResponse<Tweet>>(
    // Only make the request if we're on the client and have a token
    (index, previousPageData) => {
      if (!getAuthToken()) return null;
      
      // If reached the end, return null to stop fetching
      if (previousPageData && !previousPageData.meta?.has_more) return null;
      
      // For the first page, use the provided params
      if (index === 0) {
        return ['tweets', filterKey, { ...params, page: 1 }];
      }
      
      // For subsequent pages, increment the page number
      return ['tweets', filterKey, { ...params, page: index + 1 }];
    },
    ([, , params]) => tweetsApi.getTweets(params as TweetQueryParams),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );
  // Flatten all tweets from all pages
  const tweets = data ? data.flatMap(page => page.data) : [];
  
  // Get pagination info from the last page
  const pagination = data && data.length > 0 ? data[data.length - 1].meta : null;

  return {
    tweets,
    pagination,
    isLoading,
    error,
    mutate,
    size,
    setSize,
    isValidating,
  };
};

export const useTweet = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<Tweet>(
    // Only make the request if we're on the client, have a token, and have an id
    getAuthToken() && id ? ['tweet', id] : null,
    () => tweetsApi.getTweet(id),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    tweet: data || null,
    isLoading,
    error,
    mutate,
  };
};


// Replies hooks
export const useReplies = (tweetId: number, params: ReplyQueryParams) => {
  const filterKey = JSON.stringify({ per_page: params.per_page });
  const { data, error, isLoading, mutate, size, setSize, isValidating } = useSWRInfinite<PaginatedResponse<Reply>>(
    // Only make the request if we're on the client, have a token, and have a tweetId
    (index, previousPageData) => {
      if (!getAuthToken()) return null;
      if (previousPageData && !previousPageData.meta?.has_more) return null;
      return ['replies', tweetId, filterKey, { ...params, page: index + 1 }];
    },
    ([, , , params]) => repliesApi.getReplies(tweetId, params as ReplyQueryParams),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );
  const replies = data ? data.flatMap(page => page.data) : [];

  return {
    replies,
    pagination: data && data.length > 0 ? data[data.length - 1].meta : null,
    isLoading,
    error,
    mutate,
    size,
    setSize,
    isValidating,
  };
};

// Mutation hooks for data modification
export const useCreateTweet = () => {
  const { mutate } = useTweets();
  
  const createTweet = async (data: { content: string }) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const result = await tweetsApi.createTweet(data);
    mutate(); // Refresh tweets list
    return result;
  };

  return { createTweet };
};

export const useUpdateTweet = () => {
  const { mutate } = useTweets();
  
  const updateTweet = async (data: { id: number; content: string }) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const result = await tweetsApi.updateTweet(data);
    mutate(); // Refresh tweets list
    return result;
  };

  return { updateTweet };
};

export const useDeleteTweet = () => {
  const { mutate } = useTweets();
  
  const deleteTweet = async (id: number) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const result = await tweetsApi.deleteTweet(id);
    mutate(); // Refresh tweets list
    return result;
  };

  return { deleteTweet };
};

export const useCreateReply = (tweetId: number) => {
  const { mutate } = useReplies(tweetId, { page: 1, per_page: 5 });
  
  const createReply = async (data: { content: string }) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    const result = await repliesApi.createReply(tweetId, data);
    mutate(); // Refresh replies list
    return result;
  };

  return { createReply };
};

export const useUpdateReply = (tweetId: number) => {
  const { mutate } = useReplies(tweetId, { page: 1, per_page: 5 });
  
  const updateReply = async (data: { id: number; content: string }) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    const result = await repliesApi.updateReply(tweetId, data);
    mutate(); // Refresh replies list
    return result;
  };

  return { updateReply };
};

export const useDeleteReply = (tweetId: number) => {
  const { mutate } = useReplies(tweetId, { page: 1, per_page: 5 });
  
  const deleteReply = async (id: number) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    const result = await repliesApi.deleteReply(tweetId, id);
    mutate(); // Refresh replies list
    return result;
  };

  return { deleteReply };
};

// User mutation hooks
export const useUpdateUser = () => {
  const { mutate: mutateCurrentUser } = useCurrentUser();
  
  const updateUser = async (userData: UpdateUserRequest) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const result = await usersApi.updateUser(userData);
    
    // Refresh current user cache
    mutateCurrentUser();
    
    return result;
  };

  return { updateUser };
};

// Generic mutation hook for API calls
export const useApiMutation = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (apiCall: () => Promise<T>) => {
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
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
