import { useState } from 'react';
import { Save } from 'lucide-react';

type TabType = 'general' | 'banking' | 'config';

interface CompanyData {
  name: string;
  cif: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  web: string;
  iban: string;
  bankName: string;
  accountHolder: string;
  openingTime: string;
  closingTime: string;
  closedDays: string[];
}

export function CompanySettings() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState<CompanyData>({
    name: 'Urban Ladies Salón',
    cif: '11862396P',
    address: 'Av. Isabel de Farnesio, 23, Local 3',
    city: 'Boadilla del Monte',
    province: 'Madrid',
    postalCode: '28660',
    phone: '640247974',
    email: 'info@urbanladies.com',
    web: 'www.urbanladies.com',
    iban: 'ES9121000418450200051332',
    bankName: 'Banco Santander',
    accountHolder: 'Urban Ladies SL',
    openingTime: '09:00',
    closingTime: '19:00',
    closedDays: ['Sunday'],
  });

  const handleInputChange = (field: keyof CompanyData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDayChange = (day: string) => {
    const newDays = formData.closedDays.includes(day)
      ? formData.closedDays.filter(d => d !== day)
      : [...formData.closedDays, day];
    handleInputChange('closedDays', newDays);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-6 py-4 font-medium text-center transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-primary-600 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Datos Generales
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex-1 px-6 py-4 font-medium text-center transition-colors border-b-2 ${
              activeTab === 'banking'
                ? 'border-primary-600 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Datos Bancarios
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 px-6 py-4 font-medium text-center transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-primary-600 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Configuración
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Datos Generales */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Empresa *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">CIF *</label>
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => handleInputChange('cif', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Provincia</label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  >
                    <option>Madrid</option>
                    <option>Barcelona</option>
                    <option>Valencia</option>
                    <option>Sevilla</option>
                    <option>Bilbao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Municipio</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Dirección *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">CP *</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tif. Móvil</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Web</label>
                  <input
                    type="url"
                    value={formData.web}
                    onChange={(e) => handleInputChange('web', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Datos Bancarios */}
          {activeTab === 'banking' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">IBAN</label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => handleInputChange('iban', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  placeholder="ES91 2100 0418 4502 0005 1332"
                />
                <p className="text-xs text-gray-500 mt-1">Formato: ES + 22 dígitos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Titular de la Cuenta</label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Banco</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Esta información se utiliza para transferencias bancarias y pagos de empleadas.
                </p>
              </div>
            </div>
          )}

          {/* Configuración */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Hora de Apertura</label>
                  <input
                    type="time"
                    value={formData.openingTime}
                    onChange={(e) => handleInputChange('openingTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Hora de Cierre</label>
                  <input
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) => handleInputChange('closingTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Días Cerrados</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {days.map((day) => (
                    <label key={day} className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.closedDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-900">{dayLabels[day]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Resumen:</span> El salón abre a las {formData.openingTime} y cierra a las {formData.closingTime}.
                  Cerrado los: {formData.closedDays.length > 0 ? formData.closedDays.map(d => dayLabels[d]).join(', ') : 'Ninguno'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div>
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-medium">Cambios guardados correctamente</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors"
        >
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
