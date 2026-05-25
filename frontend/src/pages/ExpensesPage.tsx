import { useState } from 'react';
import { ExpensesPanel } from '../components/Expenses/ExpensesPanel';
import { StockControl } from '../components/Expenses/StockControl';

export function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'stock'>('expenses');

  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Gastos</h1>
        <p className="text-gray-600 mt-2">Controla gastos e inventario de productos</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'expenses'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Panel de Gastos
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'stock'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Control de Stock
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'expenses' && <ExpensesPanel />}
      {activeTab === 'stock' && <StockControl />}
    </main>
  );
}
