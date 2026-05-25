import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type PeriodFilter = 'week' | 'month' | '3months';

export function ReportsPanel() {
  const [period, setPeriod] = useState<PeriodFilter>('month');

  // Datos por período
  const allData = {
    week: {
      sales: [
        { date: '19/5', ventas: 180, gastos: 85 },
        { date: '20/5', ventas: 200, gastos: 95 },
        { date: '21/5', ventas: 220, gastos: 100 },
        { date: '22/5', ventas: 210, gastos: 105 },
        { date: '23/5', ventas: 190, gastos: 110 },
      ],
      totalSales: 1000,
      totalExpenses: 495,
    },
    month: {
      sales: [
        { date: '18/5', ventas: 120, gastos: 80 },
        { date: '19/5', ventas: 150, gastos: 90 },
        { date: '20/5', ventas: 180, gastos: 85 },
        { date: '21/5', ventas: 200, gastos: 95 },
        { date: '22/5', ventas: 220, gastos: 100 },
        { date: '23/5', ventas: 190, gastos: 110 },
      ],
      totalSales: 1340,
      totalExpenses: 1605,
    },
    '3months': {
      sales: [
        { date: '23/3', ventas: 280, gastos: 200 },
        { date: '06/4', ventas: 310, gastos: 220 },
        { date: '20/4', ventas: 340, gastos: 250 },
        { date: '04/5', ventas: 380, gastos: 280 },
        { date: '18/5', ventas: 420, gastos: 320 },
        { date: '23/5', ventas: 390, gastos: 310 },
      ],
      totalSales: 3780,
      totalExpenses: 2480,
    },
  };

  const currentData = allData[period];
  const salesByDay = currentData.sales;
  const totalSales = currentData.totalSales;
  const totalExpenses = currentData.totalExpenses;

  // Datos de servicios más vendidos
  const topServices = [
    { name: 'Corte de Cabello', ventas: 15, ingresos: 375 },
    { name: 'Tinte Completo', ventas: 8, ingresos: 480 },
    { name: 'Manicura', ventas: 12, ingresos: 240 },
    { name: 'Peinado y Maquillaje', ventas: 5, ingresos: 225 },
    { name: 'Tratamiento Capilar', ventas: 7, ingresos: 280 },
  ];

  // Datos de gastos por categoría
  const expensesByCategory = [
    { name: 'Suministros', value: 245, fill: '#ef4444' },
    { name: 'Servicios', value: 235, fill: '#f97316' },
    { name: 'Alquiler', value: 800, fill: '#eab308' },
    { name: 'Mantenimiento', value: 220, fill: '#22c55e' },
    { name: 'Publicidad', value: 105, fill: '#06b6d4' },
  ];

  // Rendimiento por empleada
  const employeePerformance = [
    { nombre: 'Rubi', ventas: 15, target: 20 },
    { nombre: 'Ángela', ventas: 12, target: 20 },
    { nombre: 'Laura', ventas: 8, target: 20 },
    { nombre: 'Sofía', ventas: 7, target: 20 },
  ];

  const netProfit = totalSales - totalExpenses;

  const getPeriodLabel = () => {
    if (period === 'week') return 'Esta Semana';
    if (period === 'month') return 'Último Mes';
    return 'Últimos 3 Meses';
  };

  return (
    <div className="space-y-6">
      {/* Filtros de período */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Período</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setPeriod('week')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              period === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              period === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Último Mes
          </button>
          <button
            onClick={() => setPeriod('3months')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              period === '3months'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Últimos 3 Meses
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
          <p className="text-3xl font-bold text-green-600 mt-2">€{totalSales}</p>
          <p className="text-xs text-gray-500 mt-2">{getPeriodLabel()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Gastos Totales</p>
          <p className="text-3xl font-bold text-red-600 mt-2">€{totalExpenses}</p>
          <p className="text-xs text-gray-500 mt-2">{getPeriodLabel()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Ganancia Neta</p>
          <p className={`text-3xl font-bold mt-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            €{netProfit}
          </p>
          <p className="text-xs text-gray-500 mt-2">Ingresos - Gastos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Margen</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{((netProfit / totalSales) * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2">Rentabilidad</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas vs Gastos por día */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#22c55e" strokeWidth={2} name="Ventas" />
              <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} name="Gastos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Servicios más vendidos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Servicios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topServices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#3b82f6" name="Cantidad" />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por categoría */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: €${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rendimiento empleadas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Empleadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas" />
              <Bar dataKey="target" fill="#d1d5db" name="Objetivo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de resumen */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resumen de Empleadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empleada</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ventas</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Objetivo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">% Logrado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              {employeePerformance.map((emp, idx) => {
                const percentage = (emp.ventas / emp.target) * 100;
                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.nombre}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{emp.ventas}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{emp.target}</td>
                    <td className="px-6 py-4 text-sm text-center font-bold text-gray-900">{percentage.toFixed(0)}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        percentage >= 100 ? 'bg-green-100 text-green-800' :
                        percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {percentage >= 100 ? '✓ Cumple' : percentage >= 75 ? 'En progreso' : 'Por mejorar'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
