import { create } from 'zustand';
import { User, AuthResponse } from '../types/index.js';
import { authAPI } from '../api/client.js';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: (() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
    // Default user for development
    return { id: '1', email: 'admin@urbanladies.com', name: 'Admin', role: 'admin' };
  })(),
  token: localStorage.getItem('token') || 'dev-token',
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(email, password, name);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const user = await authAPI.me();
      set({ user, token });
    } catch {
      set({ user: null, token: null });
    }
  },
}));
