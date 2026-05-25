import { useState } from 'react';
import { AlertCircle, Trash2, Edit2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  costPrice: number;
  supplier: string;
}

export function StockControl() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Champú Profesional', category: 'Suministros', quantity: 15, minStock: 5, costPrice: 8, supplier: 'Proveedor A' },
    { id: '2', name: 'Acondicionador', category: 'Suministros', quantity: 12, minStock: 5, costPrice: 7, supplier: 'Proveedor A' },
    { id: '3', name: 'Tinte Profesional', category: 'Suministros', quantity: 8, minStock: 10, costPrice: 15, supplier: 'Proveedor C' },
    { id: '4', name: 'Gel de Diseño', category: 'Suministros', quantity: 3, minStock: 8, costPrice: 5, supplier: 'Proveedor B' },
    { id: '5', name: 'Mascarilla Capilar', category: 'Suministros', quantity: 20, minStock: 5, costPrice: 6, supplier: 'Proveedor A' },
    { id: '6', name: 'Toallas Grandes', category: 'Textiles', quantity: 25, minStock: 10, costPrice: 2.5, supplier: 'Proveedor D' },
    { id: '7', name: 'Guantes Latex', category: 'Protección', quantity: 150, minStock: 50, costPrice: 0.3, supplier: 'Proveedor E' },
    { id: '8', name: 'Papel Aluminio Rollo', category: 'Suministros', quantity: 4, minStock: 3, costPrice: 4, supplier: 'Proveedor B' },
    { id: '9', name: 'Espuma Limpiadora', category: 'Suministros', quantity: 7, minStock: 5, costPrice: 3, supplier: 'Proveedor F' },
    { id: '10', name: 'Cepillos Redondos', category: 'Herramientas', quantity: 12, minStock: 5, costPrice: 4, supplier: 'Proveedor A' },
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Suministros',
    quantity: '',
    minStock: '',
    costPrice: '',
    supplier: '',
  });

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);

  const handleAddProduct = () => {
    if (formData.name && formData.quantity && formData.costPrice) {
      if (editingId) {
        setProducts(products.map(p =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                quantity: parseInt(formData.quantity),
                minStock: parseInt(formData.minStock) || 5,
                costPrice: parseFloat(formData.costPrice),
                supplier: formData.supplier,
              }
            : p
        ));
        setEditingId(null);
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: formData.name,
          category: formData.category,
          quantity: parseInt(formData.quantity),
          minStock: parseInt(formData.minStock) || 5,
          costPrice: parseFloat(formData.costPrice),
          supplier: formData.supplier,
        };
        setProducts([...products, newProduct]);
      }
      setShowNewForm(false);
      setFormData({
        name: '',
        category: 'Suministros',
        quantity: '',
        minStock: '',
        costPrice: '',
        supplier: '',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity.toString(),
      minStock: product.minStock.toString(),
      costPrice: product.costPrice.toString(),
      supplier: product.supplier,
    });
    setEditingId(product.id);
    setShowNewForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setShowNewForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Suministros',
      quantity: '',
      minStock: '',
      costPrice: '',
      supplier: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Control de Stock</h2>
          <button
            onClick={() => (showNewForm ? resetForm() : setShowNewForm(true))}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
          >
            {showNewForm ? 'Cancelar' : '+ Nuevo Producto'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Total Productos</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">Bajo Stock</p>
            <p className="text-2xl font-bold text-red-900 mt-1">{lowStockProducts.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Valor Total Stock</p>
            <p className="text-2xl font-bold text-green-900 mt-1">€{totalStockValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-yellow-900">Productos con bajo stock</p>
              <p className="text-sm text-yellow-800">
                {lowStockProducts.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option>Suministros</option>
                <option>Textiles</option>
                <option>Herramientas</option>
                <option>Protección</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Costo (€)</label>
              <input
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inventario de Productos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Mínimo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Precio Costo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Valor Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Proveedor</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    product.quantity <= product.minStock ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold">
                    <span className={product.quantity <= product.minStock ? 'text-red-600' : 'text-gray-900'}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{product.minStock}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">€{product.costPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    €{(product.quantity * product.costPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.supplier}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Total: {products.length} producto{products.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
