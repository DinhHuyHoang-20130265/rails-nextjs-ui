'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SortDirection, SortOption, TweetFilters } from '@/types';

interface TweetsViewState {
  filters: TweetFilters;
  showTweetForm: boolean;
  setFilters: (partial: Partial<TweetFilters>) => void;
  setShowTweetForm: (show: boolean) => void;
}

export const useTweetsViewStore = create<TweetsViewState>()(
  persist(
    (set, get) => ({
      filters: {
        sort: 'date' as SortOption,
        direction: 'desc' as SortDirection,
        page: 1,
        per_page: 10,
      },
      showTweetForm: false,
      setFilters: (partial) => {
        const next = { ...get().filters, ...partial };
        set({ filters: next });
      },
      setShowTweetForm: (show) => set({ showTweetForm: show }),
    }),
    {
      name: 'tweets-view-store',
      version: 1,
      partialize: (state) => ({
        filters: state.filters,
        showTweetForm: state.showTweetForm,
      }),
    }
  )
);


