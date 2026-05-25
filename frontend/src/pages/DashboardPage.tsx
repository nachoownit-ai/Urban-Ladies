import { DashboardContent } from '../components/Dashboard/DashboardContent';

export function DashboardPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido a Urban Ladies PRO</p>
      </div>
      <DashboardContent />
    </main>
  );
}
