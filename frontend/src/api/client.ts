import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User } from '../types/index.js';

const API_BASE_URL = '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data.data;
  },
  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  },
};

export const appointmentsAPI = {
  create: async (appointment: any) => {
    const response = await apiClient.post('/appointments', appointment);
    return response.data.data;
  },
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data.data || [];
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },
  getAvailableSlots: async (date: string, employee?: string, duration?: number) => {
    const params: any = { date };
    if (employee) params.employee_name = employee;
    if (duration) params.duration = duration;
    const response = await apiClient.get('/appointments/available-slots', { params });
    return response.data.data || [];
  },
  markConfirmationCallMade: async (id: string) => {
    const response = await apiClient.post(`/appointments/${id}/confirm-call`);
    return response.data.data;
  },
  markReminderSent: async (id: string) => {
    const response = await apiClient.post(`/appointments/${id}/send-reminder`);
    return response.data.data;
  },
  recordReminderAttempt: async (id: string) => {
    const response = await apiClient.post(`/appointments/${id}/reminder-attempt`);
    return response.data.data;
  },
};
