import { ReportsPanel } from '../components/Reports/ReportsPanel';

export function ReportsPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600 mt-2">Extrae facturas, gastos y datos de inventario en Excel o PDF</p>
      </div>

      <ReportsPanel />
    </main>
  );
}
