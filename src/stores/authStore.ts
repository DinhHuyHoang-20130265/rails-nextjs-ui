'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/api/auth/auth';
import { mutate } from 'swr';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  checkingAuth: boolean;
  signingIn: boolean;
  signingOut: boolean;
  setCurrentUser: (user: User | null) => void;
  signIn: (credentials: { username: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      checkingAuth: false,
      signingIn: false,
      signingOut: false,

      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: !!user });
      },

      signIn: async (credentials) => {
        set({ signingIn: true });
        try {
          const { user } = await authApi.signIn(credentials as any);
          set({ currentUser: user, isAuthenticated: true });
          await mutate('current-user');
          await mutate((key: unknown) => Array.isArray(key) && key[0] === 'tweets');
        } finally {
          set({ signingIn: false });
        }
      },

      signOut: async () => {
        set({ signingOut: true });
        try {
          await authApi.signOut();
          set({ currentUser: null, isAuthenticated: false });
          await mutate('current-user');
          await mutate((key: unknown) => Array.isArray(key) && (key[0] === 'tweets' || key[0] === 'replies'));
        } finally {
          set({ signingOut: false });
        }
      },

      refreshUser: async () => {
        await mutate('current-user');
      },
    }),
    {
      name: 'auth-store',
      version: 1,
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


