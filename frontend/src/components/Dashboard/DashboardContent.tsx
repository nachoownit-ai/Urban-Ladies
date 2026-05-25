import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Calendar, Users, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { StatsCard } from './StatsCard';

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

const COLORS = ['#1e3a5f', '#3b5998', '#4f7ab8', '#7fa3d1', '#a8c5e0', '#d1e0f0'];
const EMPLOYEES = ['Rubi', 'Angela', 'Laura', 'Sofia'];

export function DashboardContent() {
  const [sales] = useState(initialSales);
  const [viewRevenue, setViewRevenue] = useState(true);

  const metrics = useMemo(() => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(today);
    last30Days.setMonth(last30Days.getMonth() - 1);

    const thisWeek = sales.filter(s => new Date(s.date) >= last7Days);
    const thisMonth = sales.filter(s => new Date(s.date) >= last30Days);
    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate.toDateString() === today.toDateString();
    });

    const totalRevenue = thisMonth.reduce((sum, s) => sum + s.price, 0);
    const weeklySales = thisWeek.length;
    const uniqueClients = new Set(sales.map(s => s.clientName)).size;
    const avgSalePrice = thisMonth.length > 0 ? (totalRevenue / thisMonth.length).toFixed(2) : 0;

    return {
      totalRevenue,
      weeklySales,
      uniqueClients,
      avgSalePrice,
      todaySales: todaySales.length,
      thisMonthSales: thisMonth.length,
    };
  }, [sales]);

  const revenueByDay = useMemo(() => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const dayMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dayMap[dateStr] = 0;
    }

    sales
      .filter(s => new Date(s.date) >= last7Days)
      .forEach(s => {
        if (dayMap.hasOwnProperty(s.date)) {
          dayMap[s.date] += s.price;
        }
      });

    return Object.entries(dayMap)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .reverse();
  }, [sales]);

  const employeePerformance = useMemo(() => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setMonth(last30Days.getMonth() - 1);

    const filtered = sales.filter(s => new Date(s.date) >= last30Days);
    const performance: Record<string, { sales: number; revenue: number }> = {};

    EMPLOYEES.forEach(emp => {
      performance[emp] = {
        sales: 0,
        revenue: 0,
      };
    });

    filtered.forEach(s => {
      if (performance[s.employee]) {
        performance[s.employee].sales += 1;
        performance[s.employee].revenue += s.price;
      }
    });

    return Object.entries(performance).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [sales]);

  const serviceBreakdown = useMemo(() => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setMonth(last30Days.getMonth() - 1);

    const filtered = sales.filter(s => new Date(s.date) >= last30Days);
    const breakdown: Record<string, { name: string; sales: number; revenue: number }> = {};

    filtered.forEach(s => {
      if (!breakdown[s.serviceName]) {
        breakdown[s.serviceName] = { name: s.serviceName, sales: 0, revenue: 0 };
      }
      breakdown[s.serviceName].sales += 1;
      breakdown[s.serviceName].revenue += s.price;
    });

    return Object.values(breakdown);
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ingresos (Mes)"
          value={`€${metrics.totalRevenue}`}
          icon={<DollarSign size={24} />}
          color="primary"
        />
        <StatsCard
          title="Ventas Hoy"
          value={metrics.todaySales}
          icon={<Calendar size={24} />}
          color="blue"
        />
        <StatsCard
          title="Clientes Totales"
          value={metrics.uniqueClients}
          icon={<Users size={24} />}
          color="green"
        />
        <StatsCard
          title="Venta Promedio"
          value={`€${metrics.avgSalePrice}`}
          icon={<TrendingUp size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos - Ultimos 7 dias</h3>
            <button
              onClick={() => setViewRevenue(!viewRevenue)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title={viewRevenue ? 'Ocultar' : 'Mostrar'}
            >
              {viewRevenue ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {viewRevenue ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `€${value}`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('es-ES')}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  dot={{ fill: '#1e3a5f' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              Grafico oculto
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Empleadas - Top Rendimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#1e3a5f" name="Cantidad" />
              <Bar dataKey="revenue" fill="#4f7ab8" name="Ingresos (E)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribucion de Servicios</h3>
          {serviceBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {serviceBreakdown.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              Sin datos disponibles
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen - Ultimo Mes</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Ventas</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.thisMonthSales}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Ingresos Total</span>
              <span className="text-2xl font-bold text-green-600">€{metrics.totalRevenue}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Venta Promedio</span>
              <span className="text-2xl font-bold text-blue-600">€{metrics.avgSalePrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clientes Unicos</span>
              <span className="text-2xl font-bold text-purple-600">{metrics.uniqueClients}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
