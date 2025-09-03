import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Home, FileText, Plus, MessageCircle, Search, Users, BarChart3, Activity, LogOut } from 'lucide-react';
import { useApp } from '../store';
import NotificationBell from './NotificationBell';
import Toast from './Toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, getUnreadNotifications } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const unreadCount = getUnreadNotifications(currentUser.id).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'cliente':
        return [
          { path: '/cliente', label: 'Dashboard', icon: Home },
          { path: '/cliente/casos', label: 'Mis Casos', icon: FileText },
          { path: '/cliente/nuevo-caso', label: 'Nuevo Caso', icon: Plus },
          { path: '/cliente/mensajes', label: 'Mensajes', icon: MessageCircle }
        ];
      case 'abogado':
        return [
          { path: '/abogado', label: 'Dashboard', icon: Home },
          { path: '/abogado/casos', label: 'Mis Casos', icon: FileText },
          { path: '/abogado/disponibles', label: 'Casos Disponibles', icon: Search },
          { path: '/abogado/mensajes', label: 'Mensajes', icon: MessageCircle }
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: Home },
          { path: '/admin/casos', label: 'Todos los Casos', icon: FileText },
          { path: '/admin/abogados', label: 'Abogados', icon: Users },
          { path: '/admin/metricas', label: 'Métricas', icon: BarChart3 },
          { path: '/admin/auditoria', label: 'Auditoría', icon: Activity }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 lg:relative lg:translate-x-0 shadow-xl"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">Legal Chile</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span className="capitalize">{currentUser.role}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* User info */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1e40af&color=fff`}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? 'lg:ml-80' : ''}`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors duration-200"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  Gestión legal corporativa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1e40af&color=fff`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
                <span className="text-gray-700 font-medium hidden sm:block">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default Layout;

