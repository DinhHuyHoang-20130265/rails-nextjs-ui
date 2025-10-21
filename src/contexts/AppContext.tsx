'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User, Tweet } from '@/types';
import { useCurrentUser, useTweets } from '@/hooks/useApi';

interface AppContextType {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  // Tweets state
  tweets: Tweet[];
  setTweets: (tweets: Tweet[]) => void;
  addTweet: (tweet: Tweet) => void;
  updateTweet: (tweet: Tweet) => void;
  deleteTweet: (tweetId: number) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Use SWR hooks for data fetching
  const { user: currentUser, isLoading: userLoading, mutate: mutateUser } = useCurrentUser();
  const { tweets, isLoading: tweetsLoading, mutate: mutateTweets } = useTweets();
  
  const isLoading = userLoading || tweetsLoading;
  const isAuthenticated = !!currentUser;

  // Tweet management functions
  const addTweet = () => {
    // Optimistically update the cache
    mutateTweets();
  };

  const updateTweet = () => {
    // Optimistically update the cache
    mutateTweets();
  };

  const deleteTweet = () => {
    // Optimistically update the cache
    mutateTweets();
  };

  // User management functions
  const setCurrentUser = () => {
    mutateUser?.();
  };

  // SWR handles data loading automatically, no need for useEffect

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    tweets,
    setTweets: () => mutateTweets(), // SWR mutate function
    addTweet,
    updateTweet,
    deleteTweet,
    isLoading,
    setIsLoading: () => {}, // Not needed with SWR
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
