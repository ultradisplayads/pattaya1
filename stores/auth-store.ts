import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  fcm_tokens?: string[];
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Async actions
  loginAsync: (email: string, password: string) => Promise<void>;
  logoutAsync: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Synchronous actions
      login: (token: string, user: User) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
        // Store token in localStorage for API calls
        localStorage.setItem('jwt', token);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        // Clear token from localStorage
        localStorage.removeItem('jwt');
      },

      setUser: (user: User) => {
        set({ user });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        localStorage.setItem('jwt', token);
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Async actions
      loginAsync: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }

          const { jwt, user } = await response.json();
          get().login(jwt, user);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logoutAsync: async () => {
        try {
          set({ isLoading: true });
          
          // Call logout endpoint if needed
          const token = get().token;
          if (token) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().logout();
          set({ isLoading: false });
        }
      },

      refreshToken: async () => {
        try {
          const token = get().token;
          if (!token) return;

          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const { jwt, user } = await response.json();
            get().login(jwt, user);
          } else {
            get().logout();
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const token = get().token;
          if (!token) throw new Error('Not authenticated');

          const response = await fetch('/api/users/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Profile update failed');
          }

          const updatedUser = await response.json();
          get().setUser(updatedUser);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
