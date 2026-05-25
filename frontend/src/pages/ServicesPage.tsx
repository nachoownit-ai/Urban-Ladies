import { ServiceDashboard } from '../components/Services/ServiceDashboard';

export function ServicesPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Servicios</h1>
        <p className="text-gray-600 mt-2">Gestiona tus servicios y analiza las ventas</p>
      </div>

      <ServiceDashboard />
    </main>
  );
}
