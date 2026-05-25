import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Calendar, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/' },
    { label: 'Citas', icon: Calendar, path: '/appointments' },
    { label: 'Clientes', icon: Users, path: '/clients' },
    { label: 'Servicios', icon: Settings, path: '/services' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary-700 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-primary-900 text-white p-6 transform md:transform-none transition-transform z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-8">
          <div className="bg-primary-700 rounded-lg p-3 mb-3 text-center">
            <h1 className="text-xl font-bold">Urban Ladies</h1>
          </div>
          <p className="text-primary-300 text-xs text-center">Gestión de Salón</p>
        </div>

        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-200 hover:bg-primary-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
