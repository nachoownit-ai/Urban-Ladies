import { CompanySettings } from '../components/Settings/CompanySettings';

export function SettingsPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Gestiona los datos y configuración de tu empresa</p>
      </div>

      <CompanySettings />
    </main>
  );
}
