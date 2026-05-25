import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  appointmentCount: number;
  lastAppointment: string;
  joinDate: string;
}

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Isabel Michoa',
      email: 'isabel@email.com',
      phone: '+34 612 345 678',
      totalSpent: 450,
      appointmentCount: 5,
      lastAppointment: '2026-05-20',
      joinDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'Pepa Mesa',
      email: 'pepa@email.com',
      phone: '+34 623 456 789',
      totalSpent: 320,
      appointmentCount: 3,
      lastAppointment: '2026-05-19',
      joinDate: '2025-02-10',
    },
    {
      id: '3',
      name: 'María José López',
      email: 'maria@email.com',
      phone: '+34 634 567 890',
      totalSpent: 680,
      appointmentCount: 8,
      lastAppointment: '2026-05-18',
      joinDate: '2024-12-05',
    },
    {
      id: '4',
      name: 'Laura Guerrero',
      email: 'laura@email.com',
      phone: '+34 645 678 901',
      totalSpent: 250,
      appointmentCount: 2,
      lastAppointment: '2026-05-17',
      joinDate: '2025-04-20',
    },
  ]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalSpent: 0,
      appointmentCount: 0,
      lastAppointment: '',
      joinDate: new Date().toISOString().split('T')[0],
    };

    setClients([...clients, newClient]);
    setFormData({ name: '', email: '', phone: '' });
    setShowForm(false);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter((c) => c.id !== id));
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex gap-4">
        <div className="flex-1 flex items-center gap-3 bg-gray-100 px-4 rounded-lg">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 py-2"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contacto</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Citas</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Gastado</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {client.appointmentCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                        €{client.totalSpent}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver perfil"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClient(client.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} de {clients.length}
          </div>
        </div>

        {/* Client Profile */}
        {selectedClient && (
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedClient.name}</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                <p className="text-sm text-gray-900">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Teléfono</p>
                <p className="text-sm text-gray-900">{selectedClient.phone}</p>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-600 uppercase font-semibold">Total Gastado</p>
                  <p className="text-2xl font-bold text-blue-900">€{selectedClient.totalSpent}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-green-600 uppercase font-semibold">Total Citas</p>
                  <p className="text-2xl font-bold text-green-900">{selectedClient.appointmentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Última Cita</p>
                  <p className="text-sm text-gray-900">
                    {selectedClient.lastAppointment
                      ? new Date(selectedClient.lastAppointment).toLocaleDateString('es-ES')
                      : 'Sin citas'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Cliente Desde</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedClient.joinDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* New Client Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Cliente</h2>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Ej: María García"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="maria@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="+34 612 345 678"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', email: '', phone: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
