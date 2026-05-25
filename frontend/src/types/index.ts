export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalRevenue: number;
  appointmentsToday: number;
  activeClients: number;
  employeeOccupancy: number;
  revenueChart: Array<{ date: string; revenue: number }>;
  appointmentsByStatus: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
