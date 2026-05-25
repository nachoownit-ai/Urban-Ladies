import { useState } from 'react';
import { Plus, Edit, Trash2, BarChart3, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ServiceHistory {
  id: string;
  clientName: string;
  date: string;
  employee: string;
  price: number;
  notes?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // en minutos
  employee: string;
  soldCount: number;
  totalRevenue: number;
  description: string;
  history: ServiceHistory[];
}

const COLORS = ['#1e3a5f', '#2d5a8c', '#4f7ab8', '#7a9fd6', '#a5c4e8'];

export function ServiceDashboard() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte de Cabello',
      category: 'Cortes',
      price: 25,
      duration: 30,
      employee: 'Rubi',
      soldCount: 45,
      totalRevenue: 1125,
      description: 'Corte personalizado según tu tipo de cabello',
      history: [
        { id: 'h1', clientName: 'Isabel Michoa', date: '2026-05-20', employee: 'Rubi', price: 25 },
        { id: 'h2', clientName: 'María García', date: '2026-05-19', employee: 'Rubi', price: 25 },
        { id: 'h3', clientName: 'Laura Guerrero', date: '2026-05-18', employee: 'Rubi', price: 25 },
        { id: 'h4', clientName: 'Ana López', date: '2026-05-17', employee: 'Rubi', price: 25 },
        { id: 'h5', clientName: 'Carmen Ruiz', date: '2026-05-16', employee: 'Rubi', price: 25 },
      ],
    },
    {
      id: '2',
      name: 'Tinte Completo',
      category: 'Coloración',
      price: 60,
      duration: 90,
      employee: 'Laura',
      soldCount: 18,
      totalRevenue: 1080,
      description: 'Tinte profesional en toda la cabellera',
      history: [
        { id: 'h6', clientName: 'Sofía Martínez', date: '2026-05-20', employee: 'Laura', price: 60 },
        { id: 'h7', clientName: 'Elena Sánchez', date: '2026-05-18', employee: 'Laura', price: 60 },
        { id: 'h8', clientName: 'Rosa Torres', date: '2026-05-16', employee: 'Laura', price: 60 },
      ],
    },
    {
      id: '3',
      name: 'Peinado y Maquillaje',
      category: 'Eventos',
      price: 45,
      duration: 60,
      employee: 'Sofía',
      soldCount: 22,
      totalRevenue: 990,
      description: 'Peinado y maquillaje para eventos especiales',
      history: [
        { id: 'h9', clientName: 'Patricia González', date: '2026-05-19', employee: 'Sofía', price: 45, notes: 'Boda' },
        { id: 'h10', clientName: 'Beatriz Díaz', date: '2026-05-17', employee: 'Sofía', price: 45, notes: 'Evento' },
      ],
    },
    {
      id: '4',
      name: 'Manicura',
      category: 'Uñas',
      price: 20,
      duration: 45,
      employee: 'Ángela',
      soldCount: 56,
      totalRevenue: 1120,
      description: 'Manicura completa con esmalte semipermanente',
      history: [
        { id: 'h11', clientName: 'Pepa Mesa', date: '2026-05-20', employee: 'Ángela', price: 20 },
        { id: 'h12', clientName: 'Lucía Fernández', date: '2026-05-19', employee: 'Ángela', price: 20 },
        { id: 'h13', clientName: 'Marta Gómez', date: '2026-05-18', employee: 'Ángela', price: 20 },
      ],
    },
    {
      id: '5',
      name: 'Tratamiento Capilar',
      category: 'Cuidado',
      price: 40,
      duration: 45,
      employee: 'Rubi',
      soldCount: 28,
      totalRevenue: 1120,
      description: 'Tratamiento hidratante intensivo',
      history: [
        { id: 'h14', clientName: 'Verónica López', date: '2026-05-20', employee: 'Rubi', price: 40 },
        { id: 'h15', clientName: 'Irene Castro', date: '2026-05-19', employee: 'Rubi', price: 40 },
      ],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cortes',
    price: 0,
    duration: 30,
    employee: 'Rubi',
    description: '',
  });

  // Calculate stats
  const totalRevenue = services.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalSold = services.reduce((sum, s) => sum + s.soldCount, 0);
  const topService = services.reduce((prev, current) =>
    prev.totalRevenue > current.totalRevenue ? prev : current
  );

  // Data for charts
  const chartData = services.map(s => ({
    name: s.name.substring(0, 15),
    revenue: s.totalRevenue,
    sold: s.soldCount,
  }));

  const categoryData = services.reduce((acc, service) => {
    const existing = acc.find(item => item.name === service.category);
    if (existing) {
      existing.value += service.totalRevenue;
    } else {
      acc.push({ name: service.category, value: service.totalRevenue });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingService) {
      setServices(
        services.map(s =>
          s.id === editingService.id
            ? {
                ...s,
                name: formData.name,
                category: formData.category,
                price: formData.price,
                duration: formData.duration,
                employee: formData.employee,
                description: formData.description,
              }
            : s
        )
      );
      setEditingService(null);
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: formData.price,
        duration: formData.duration,
        employee: formData.employee,
        description: formData.description,
        soldCount: 0,
        totalRevenue: 0,
      };
      setServices([...services, newService]);
    }

    setFormData({
      name: '',
      category: 'Cortes',
      price: 0,
      duration: 30,
      employee: 'Rubi',
      description: '',
    });
    setShowForm(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€{totalRevenue}</p>
          <p className="text-xs text-gray-500 mt-2">De {services.length} servicios</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Total Vendido</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalSold}</p>
          <p className="text-xs text-gray-500 mt-2">Servicios vendidos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Servicio Top</p>
          <p className="text-lg font-bold text-gray-900 mt-2">{topService.name}</p>
          <p className="text-xs text-gray-500 mt-2">€{topService.totalRevenue} ingresos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium">Precio Promedio</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            €{(services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Por servicio</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Servicio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `€€{value}`} />
              <Bar dataKey="revenue" fill="#1e3a5f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `€{name}: €€{value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-€{index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€€{value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Catálogo de Servicios</h3>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({
                name: '',
                category: 'Cortes',
                price: 0,
                duration: 30,
                employee: 'Rubi',
                description: '',
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Servicio
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Servicio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Precio</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Duración</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Vendidos</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ingresos</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Empleada</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">€{service.price}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">{service.duration} min</td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">{service.soldCount}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-green-600">€{service.totalRevenue}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">{service.employee}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setFormData({
                            name: service.name,
                            category: service.category,
                            price: service.price,
                            duration: service.duration,
                            employee: service.employee,
                            description: service.description,
                          });
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Detail Modal with History */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {selectedService.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Service Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Precio</p>
                  <p className="text-3xl font-bold text-gray-900">€{selectedService.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Duración</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedService.duration} min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Vendido</p>
                  <p className="text-3xl font-bold text-green-600">€{selectedService.totalRevenue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Cantidad de Ventas</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedService.soldCount}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Descripción</p>
                <p className="text-gray-700">{selectedService.description}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-4">Empleada Asignada</p>
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
                  {selectedService.employee}
                </div>
              </div>

              {/* Service History */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Ventas</h3>
                <div className="space-y-3">
                  {selectedService.history.length > 0 ? (
                    selectedService.history.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{entry.clientName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString('es-ES')} • {entry.employee}
                            {entry.notes && ` • €{entry.notes}`}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-600">€{entry.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Sin historial de ventas</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Ej: Corte de Cabello"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option>Cortes</option>
                  <option>Coloración</option>
                  <option>Eventos</option>
                  <option>Uñas</option>
                  <option>Cuidado</option>
                  <option>Otros</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empleada Asignada
                </label>
                <select
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option>Rubi</option>
                  <option>Laura</option>
                  <option>Sofía</option>
                  <option>Ángela</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  rows={3}
                  placeholder="Describe el servicio..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {editingService ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
