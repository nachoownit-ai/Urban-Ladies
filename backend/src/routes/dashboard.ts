import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { DashboardStats } from '../types/index.js';

export const dashboardRouter = Router();

// Temporary mock data - will be replaced with real database queries
const mockStats: DashboardStats = {
  totalRevenue: 5240,
  appointmentsToday: 12,
  activeClients: 145,
  employeeOccupancy: 85,
  revenueChart: [
    { date: '2024-05-17', revenue: 450 },
    { date: '2024-05-18', revenue: 520 },
    { date: '2024-05-19', revenue: 480 },
    { date: '2024-05-20', revenue: 610 },
    { date: '2024-05-21', revenue: 550 },
    { date: '2024-05-22', revenue: 590 },
    { date: '2024-05-23', revenue: 640 },
  ],
  appointmentsByStatus: {
    pending: 3,
    confirmed: 8,
    completed: 45,
    cancelled: 2,
  },
};

dashboardRouter.get('/stats', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: mockStats,
  });
});
