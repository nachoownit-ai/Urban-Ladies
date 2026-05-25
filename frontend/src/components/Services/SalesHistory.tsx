import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

const SERVICES = [
  { name: 'Corte de Cabello', price: 25 },
  { name: 'Manicura', price: 20 },
  { name: 'Tinte Completo', price: 60 },
  { name: 'Peinado y Maquillaje', price: 45 },
  { name: 'Tratamiento Capilar', price: 40 },
  { name: 'Alisado', price: 75 },
  { name: 'Permanente', price: 50 },
];

const EMPLOYEES = ['Rubi', 'Angela', 'Laura', 'Sofia'];

const initialSales = [
  { id: '1', serviceName: 'Corte de Cabello', clientName: 'Isabel Michoa', date: '2026-05-23', price: 25, employee: 'Rubi' },
  { id: '2', serviceName: 'Manicura', clientName: 'Pepa Mesa', date: '2026-05-23', price: 20, employee: 'Angela' },
  { id: '3', serviceName: 'Tinte Completo', clientName: 'Sofia Martinez', date: '2026-05-22', price: 60, employee: 'Laura' },
  { id: '4', serviceName: 'Corte de Cabello', clientName: 'Maria Garcia', date: '2026-05-22', price: 25, employee: 'Rubi' },
  { id: '5', serviceName: 'Peinado y Maquillaje', clientName: 'Patricia Gonzalez', date: '2026-05-21', price: 45, employee: 'Sofia', notes: 'Boda' },
  { id: '6', serviceName: 'Manicura', clientName: 'Lucia Fernandez', date: '2026-05-21', price: 20, employee: 'Angela' },
  { id: '7', serviceName: 'Tratamiento Capilar', clientName: 'Veronica Lopez', date: '2026-05-20', price: 40, employee: 'Rubi' },
  { id: '8', serviceName: 'Corte de Cabello', clientName: 'Laura Guerrero', date: '2026-05-20', price: 25, employee: 'Rubi' },
  { id: '9', serviceName: 'Tinte Completo', clientName: 'Elena Sanchez', date: '2026-05-18', price: 60, employee: 'Laura' },
  { id: '10', serviceName: 'Manicura', clientName: 'Marta Gomez', date: '2026-05-17', price: 20, employee: 'Angela' },
];

export function SalesHistory() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState(initialSales);
  const [formData, setFormData] = useState({
    clientName: '',
    serviceName: SERVICES[0].name,
    employee: EMPLOYEES[0],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const getDateRange = (filter) => {
    const today = new Date();
    const startDate = new Date(today);

    if (filter === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (filter === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (filter === '3months') {
      startDate.setMonth(today.getMonth() - 3);
    }

    return startDate;
  };

  const getServicePrice = (serviceName) => {
    const service = SERVICES.find(s => s.name === serviceName);
    return service ? service.price : 0;
  };

  const handleAddSale = () => {
    if (!formData.clientName || !formData.serviceName) {
      alert('Por favor, completa cliente y servicio');
      return;
    }

    const newSale = {
      id: Date.now().toString(),
      serviceName: formData.serviceName,
      clientName: formData.clientName,
      date: formData.date,
      price: getServicePrice(formData.serviceName),
      employee: formData.employee,
      notes: formData.notes || undefined,
    };

    setSales([newSale, ...sales]);
    setFormData({
      clientName: '',
      serviceName: SERVICES[0].name,
      employee: EMPLOYEES[0],
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowForm(false);
  };

  const handleDeleteSale = (id) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  const filterSales = () => {
    const startDate = getDateRange(periodFilter);
    return sales
      .filter(sale => new Date(sale.date) >= startDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredSales = filterSales();

  const stats = {
    totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.price, 0),
    totalSales: filteredSales.length,
    avgSale: filteredSales.length > 0
      ? (filteredSales.reduce((sum, sale) => sum + sale.price, 0) / filteredSales.length).toFixed(2)
      : 0,
  };

  const dailyRevenue = filteredSales.reduce((acc, sale) => {
    const date = sale.date;
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.revenue += sale.price;
      existing.sales += 1;
    } else {
      acc.push({ date, revenue: sale.price, sales: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const serviceBreakdown = filteredSales.reduce((acc, sale) => {
    const existing = acc.find(item => item.name === sale.serviceName);
    if (existing) {
      existing.sales += 1;
      existing.revenue += sale.price;
    } else {
      acc.push({ name: sale.serviceName, sales: 1, revenue: sale.price });
    }
    return acc;
  }, []);

  const getPeriodLabel = () => {
    if (periodFilter === 'week') return 'Ultima Semana';
    if (periodFilter === 'month') return 'Ultimo Mes';
    return 'Ultimos 3 Meses';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Historial de Ventas</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            <Plus size={18} />
            {showForm ? 'Cancelar' : 'Nueva Venta'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servicio *</label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  {SERVICES.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.name} - €{service.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleada</label>
                <select
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  {EMPLOYEES.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <input
                  type="text"
                  placeholder="Ej: Boda, Evento..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
            <button
              onClick={handleAddSale}
              className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Guardar Venta (€{getServicePrice(formData.serviceName)})
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setPeriodFilter('week')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ultima Semana
          </button>
          <button
            onClick={() => setPeriodFilter('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ultimo Mes
          </button>
          <button
            onClick={() => setPeriodFilter('3months')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === '3months'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ultimos 3 Meses
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Ingresos Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.totalRevenue}</p>
          <p className="text-xs text-gray-500 mt-2">{getPeriodLabel()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Total Ventas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSales}</p>
          <p className="text-xs text-gray-500 mt-2">Servicios vendidos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Venta Promedio</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.avgSale}</p>
          <p className="text-xs text-gray-500 mt-2">Por servicio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `€${value}`}
                labelFormatter={(label) => new Date(label).toLocaleDateString('es-ES')}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: '#1e3a5f' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Servicio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#1e3a5f" name="Cantidad" />
              <Bar dataKey="revenue" fill="#4f7ab8" name="Ingresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detalle de Ventas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Servicio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empleada</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Notas</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Accion</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(sale.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.serviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.employee}</td>
                    <td className="px-6 py-4 text-sm text-center font-bold text-green-600">€{sale.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sale.notes ? (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          {sale.notes}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar venta"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Sin ventas en este periodo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          {filteredSales.length} venta{filteredSales.length !== 1 ? 's' : ''} registrada{filteredSales.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
