import { WeeklyScheduler } from '../components/Appointments/WeeklyScheduler';

export function AppointmentsPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Planificación Semanal</h1>
        <p className="text-gray-600 mt-2">Gestiona el calendario de citas del salón</p>
      </div>

      <WeeklyScheduler />
    </main>
  );
}
