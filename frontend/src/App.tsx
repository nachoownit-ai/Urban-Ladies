import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { TopBar } from './components/Layout/TopBar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SalesHistoryPage } from './pages/SalesHistoryPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/sales" element={<SalesHistoryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
