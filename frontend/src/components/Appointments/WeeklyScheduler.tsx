import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { appointmentsAPI } from '../../api/client.js';

interface Appointment {
  id: string;
  client_name: string;
  start_time: string;
  end_time: string;
  employee_name: string;
  appointment_date: string;
  status: 'reserved' | 'completed' | 'cancelled';
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  return `${String(hour).padStart(2, '0')}:00`;
});

export function WeeklyScheduler() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '09:45',
    employee_name: 'Rubi',
  });

  // Cargar citas al montar y cuando cambie la fecha
  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const data = await appointmentsAPI.getAll();
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Error loading appointments:', err);
      setError('Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Lunes
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const getAppointmentForSlot = (date: Date, hour: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.find(
      (apt) =>
        apt.appointment_date === dateStr &&
        apt.start_time === hour &&
        apt.status !== 'cancelled'
    );
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim()) {
      setError('El nombre del cliente es requerido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await appointmentsAPI.create({
        client_name: formData.client_name,
        employee_name: formData.employee_name,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      // Recargar citas
      await loadAppointments();

      setFormData({
        client_name: '',
        appointment_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '09:45',
        employee_name: 'Rubi',
      });
      setShowNewForm(false);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError('Error al crear la cita: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await appointmentsAPI.update(id, { status: 'cancelled' });
      await loadAppointments();
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError('Error al cancelar la cita');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-gray-500">Semana del {weekDates[0].getDate()} al {weekDates[6].getDate()}</p>
          </div>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          + Nueva Cita
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-20 px-4 py-3 text-left text-sm font-semibold text-gray-900">Hora</th>
              {weekDates.map((date, i) => (
                <th
                  key={i}
                  className="flex-1 min-w-[150px] px-4 py-3 text-center text-sm font-semibold text-gray-900 border-l border-gray-200"
                >
                  <div>{DAYS[i]}</div>
                  <div className="text-xs text-gray-500 font-normal">{date.getDate()} May</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 z-10">
                  {hour}
                </td>
                {weekDates.map((date, dayIdx) => {
                  const appointment = getAppointmentForSlot(date, hour);
                  const dateStr = date.toISOString().split('T')[0];

                  return (
                    <td
                      key={`${hour}-${dayIdx}`}
                      className="px-2 py-2 border-l border-gray-200 min-w-[150px]"
                    >
                      {appointment ? (
                        <div className="bg-blue-100 border-2 border-blue-300 rounded p-2 cursor-pointer hover:shadow-md transition-shadow group relative">
                          <div className="font-semibold text-blue-900 text-sm">{appointment.client_name}</div>
                          <div className="text-xs text-blue-700">
                            {appointment.start_time}-{appointment.end_time}
                          </div>
                          <div className="text-xs text-blue-600">{appointment.employee_name}</div>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Cancelar cita"
                            disabled={isLoading}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setFormData({ ...formData, appointment_date: dateStr, start_time: hour });
                            setShowNewForm(true);
                          }}
                          className="bg-green-50 border-2 border-green-200 rounded p-3 text-center text-green-700 text-xs font-medium cursor-pointer hover:bg-green-100 transition-colors"
                        >
                          Disponible
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="text-gray-700">Reservada</span>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
              <button
                onClick={() => setShowNewForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Ej: María García"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inicio
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empleada
                </label>
                <select
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  disabled={isLoading}
                >
                  <option>Rubi</option>
                  <option>Laura</option>
                  <option>Sofia</option>
                  <option>Angela</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Crear Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
