import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  vendor?: string;
}

type PeriodFilter = 'week' | 'month' | '3months';

export function ExpensesPanel() {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Suministros',
    description: '',
    amount: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
  });

  const allExpenses: Expense[] = [
    { id: '1', category: 'Suministros', description: 'Champú profesional', date: '2026-05-23', amount: 45, vendor: 'Proveedor A' },
    { id: '2', category: 'Servicios', description: 'Internet mensual', date: '2026-05-23', amount: 60, vendor: 'Telecom' },
    { id: '3', category: 'Alquiler', description: 'Alquiler local', date: '2026-05-22', amount: 800, vendor: 'Propietario' },
    { id: '4', category: 'Suministros', description: 'Toallas', date: '2026-05-22', amount: 25, vendor: 'Proveedor B' },
    { id: '5', category: 'Mantenimiento', description: 'Reparación sillón', date: '2026-05-21', amount: 120, vendor: 'Técnico' },
    { id: '6', category: 'Servicios', description: 'Agua', date: '2026-05-21', amount: 35, vendor: 'Acueducto' },
    { id: '7', category: 'Suministros', description: 'Tinte profesional', date: '2026-05-20', amount: 90, vendor: 'Proveedor A' },
    { id: '8', category: 'Publicidad', description: 'Anuncios Instagram', date: '2026-05-20', amount: 50, vendor: 'Meta' },
    { id: '9', category: 'Suministros', description: 'Acondicionador', date: '2026-05-18', amount: 40, vendor: 'Proveedor C' },
    { id: '10', category: 'Servicios', description: 'Electricidad', date: '2026-05-17', amount: 75, vendor: 'CFE' },
    { id: '11', category: 'Mantenimiento', description: 'Limpieza profunda', date: '2026-05-16', amount: 100, vendor: 'Servicio' },
    { id: '12', category: 'Suministros', description: 'Utensilios', date: '2026-05-15', amount: 35, vendor: 'Proveedor D' },
    { id: '13', category: 'Servicios', description: 'Software punto venta', date: '2026-05-14', amount: 99, vendor: 'SoftCom' },
    { id: '14', category: 'Publicidad', description: 'Volantes', date: '2026-05-13', amount: 25, vendor: 'Imprenta' },
    { id: '15', category: 'Suministros', description: 'Mascarillas', date: '2026-04-20', amount: 20, vendor: 'Proveedor A' },
    { id: '16', category: 'Mantenimiento', description: 'Revisión equipos', date: '2026-04-18', amount: 80, vendor: 'Técnico' },
    { id: '17', category: 'Servicios', description: 'Teléfono', date: '2026-04-15', amount: 45, vendor: 'Movistar' },
    { id: '18', category: 'Publicidad', description: 'Flyers digital', date: '2026-04-10', amount: 30, vendor: 'Agencia' },
    { id: '19', category: 'Suministros', description: 'Gel', date: '2026-03-25', amount: 55, vendor: 'Proveedor B' },
    { id: '20', category: 'Servicios', description: 'Alquiler temporal', date: '2026-03-20', amount: 150, vendor: 'Espacio' },
  ];

  const getDateRange = (filter: PeriodFilter) => {
    const today = new Date(2026, 4, 23);
    let startDate = new Date(today);

    if (filter === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (filter === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (filter === '3months') {
      startDate.setMonth(today.getMonth() - 3);
    }

    return startDate;
  };

  const filterExpenses = () => {
    const startDate = getDateRange(periodFilter);
    return allExpenses.filter(expense => new Date(expense.date) >= startDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredExpenses = filterExpenses();

  const stats = {
    totalExpenses: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    totalTransactions: filteredExpenses.length,
    avgExpense: filteredExpenses.length > 0 ? (filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) / filteredExpenses.length).toFixed(2) : 0,
  };

  const dailyExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = expense.date;
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ date, amount: expense.amount });
    }
    return acc;
  }, [] as Array<{ date: string; amount: number }>).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({ name: expense.category, amount: expense.amount, count: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; amount: number; count: number }>);

  const getPeriodLabel = () => {
    if (periodFilter === 'week') return 'Última Semana';
    if (periodFilter === 'month') return 'Último Mes';
    return 'Últimos 3 Meses';
  };

  const handleAddExpense = () => {
    if (formData.description && formData.amount) {
      setShowNewForm(false);
      setFormData({
        category: 'Suministros',
        description: '',
        amount: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Panel de Gastos</h2>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
          >
            {showNewForm ? 'Cancelar' : '+ Nuevo Gasto'}
          </button>
        </div>

        {showNewForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option>Suministros</option>
                  <option>Servicios</option>
                  <option>Alquiler</option>
                  <option>Mantenimiento</option>
                  <option>Publicidad</option>
                  <option>Otros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (€)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Descripción del gasto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Nombre del proveedor"
                />
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
              <div className="flex items-end">
                <button
                  onClick={handleAddExpense}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Guardar Gasto
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setPeriodFilter('week')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Última Semana
          </button>
          <button
            onClick={() => setPeriodFilter('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Último Mes
          </button>
          <button
            onClick={() => setPeriodFilter('3months')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              periodFilter === '3months'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Últimos 3 Meses
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Gastos Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.totalExpenses}</p>
          <p className="text-xs text-gray-500 mt-2">{getPeriodLabel()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Total Transacciones</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTransactions}</p>
          <p className="text-xs text-gray-500 mt-2">Movimientos registrados</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Gasto Promedio</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.avgExpense}</p>
          <p className="text-xs text-gray-500 mt-2">Por transacción</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Expenses Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyExpenses}>
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
              <Line type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
              <Bar dataKey="count" fill="#1e3a5f" name="Cantidad" />
              <Bar dataKey="amount" fill="#ef4444" name="Monto" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detalle de Gastos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Proveedor</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Monto</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.vendor || '-'}</td>
                    <td className="px-6 py-4 text-sm text-center font-bold text-red-600">€{expense.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Sin gastos en este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''} registrado{filteredExpenses.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
