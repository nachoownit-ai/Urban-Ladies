import { ClientList } from '../components/Clients/ClientList';

export function ClientsPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600 mt-2">Administra perfiles, historial y estadísticas de clientes</p>
      </div>

      <ClientList />
    </main>
  );
}
