import { useAuthStore } from '../../store/authStore';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BarChart3, Calendar, Users, Settings, TrendingUp, CreditCard, Sliders, FileText } from 'lucide-react';

export function TopBar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/' },
    { label: 'Citas', icon: Calendar, path: '/appointments' },
    { label: 'Clientes', icon: Users, path: '/clients' },
    { label: 'Servicios', icon: Settings, path: '/services' },
    { label: 'Ventas', icon: TrendingUp, path: '/sales' },
    { label: 'Gastos', icon: CreditCard, path: '/expenses' },
    { label: 'Reportes', icon: FileText, path: '/reports' },
    { label: 'Configuración', icon: Sliders, path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-primary-900 text-white">
      {/* Top navbar */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-primary-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary-700 rounded-lg px-4 py-2">
            <h1 className="text-lg font-bold">Urban Ladies</h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pl-8 border-l border-primary-700">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-primary-300">{user?.role === 'admin' ? 'Admin' : 'Empleada'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-primary-300 hover:text-red-400 transition-colors p-2 ml-4"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="h-14 px-8 flex items-center gap-1 bg-primary-800">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isActive(item.path)
                ? 'bg-primary-600 text-white'
                : 'text-primary-200 hover:bg-primary-700'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
