export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'employee';
  salon_id: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  appointmentsToday: number;
  activeClients: number;
  employeeOccupancy: number;
  revenueChart: Array<{ date: string; revenue: number }>;
  appointmentsByStatus: Record<string, number>;
}
