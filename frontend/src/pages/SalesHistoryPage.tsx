import { SalesHistory } from '../components/Services/SalesHistory';

export function SalesHistoryPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Ventas</h1>
        <p className="text-gray-600 mt-2">Análisis detallado de todas tus ventas</p>
      </div>

      <SalesHistory />
    </main>
  );
}
