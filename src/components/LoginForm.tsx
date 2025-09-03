import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { UserRole } from '../types';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('cliente');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, currentUser } = useApp();
  const navigate = useNavigate();

  const demoUsers = {
    cliente: { email: 'contacto@empresaabc.cl', name: 'Empresa ABC S.A.', description: 'Acceso como empresa cliente' },
    abogado: { email: 'mperez@legalcorp.cl', name: 'María Fernanda Pérez', description: 'Acceso como abogado especialista' },
    admin: { email: 'admin@legalcorp.cl', name: 'Administrador Principal', description: 'Acceso como administrador del sistema' },
    super_admin: { email: 'superadmin@legalcorp.cl', name: 'Super Administrador', description: 'Acceso con privilegios totales' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(email, password);
      if (success) {
        onSuccess();
        // Redirigir al dashboard correspondiente después del login exitoso
        const user = useApp.getState().currentUser;
        if (user) {
          if (user.role === 'cliente') navigate('/cliente');
          else if (user.role === 'abogado') navigate('/abogado');
          else if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin');
        }
      } else {
        setError('Credenciales inválidas. Use la contraseña: demo123');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = demoUsers[role];
    setEmail(demoUser.email);
    setPassword('demo123');
    setSelectedRole(role);
    
    // Auto login después de un breve delay para mostrar la animación
    setTimeout(() => {
      const success = login(demoUser.email, 'demo123');
      if (success) {
        onSuccess();
        // Redirigir al dashboard correspondiente después del login exitoso
        const user = useApp.getState().currentUser;
        if (user) {
          if (user.role === 'cliente') navigate('/cliente');
          else if (user.role === 'abogado') navigate('/abogado');
          else if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin');
        }
      }
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header similar al HomeClient */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{opacity:0,x:-20}} 
              animate={{opacity:1,x:0}}
              className="flex items-center gap-3"
            >
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
                  <span>Certificado • Seguro • Confiable</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{opacity:0,x:20}} 
              animate={{opacity:1,x:0}}
              className="text-sm text-gray-600"
            >
              Plataforma de Gestión Legal Corporativa
            </motion.div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Lado izquierdo - Información */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bienvenido a la Plataforma
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Accede a tu cuenta para gestionar casos legales, comunicarte con abogados especializados 
                y hacer seguimiento en tiempo real de tus solicitudes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Seguridad Garantizada</h3>
                  <p className="text-gray-600 text-sm">Toda la información está protegida con los más altos estándares de seguridad.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mt-1">
                  <span className="text-emerald-600 text-sm font-bold">24/7</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Disponibilidad Total</h3>
                  <p className="text-gray-600 text-sm">Accede a tu cuenta y gestiona tus casos en cualquier momento.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lado derecho - Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="usuario@empresa.cl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Usuarios demo */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-4">Acceso rápido (demo)</p>
              <div className="space-y-3">
                {Object.entries(demoUsers).map(([role, user]) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role as UserRole)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">{role}</div>
                        <div className="text-gray-600 text-sm">{user.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{user.description}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center bg-gray-50 py-2 px-3 rounded-lg">
                Contraseña para todos los usuarios: <span className="font-mono font-semibold">demo123</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-gray-500 text-sm">
          © 2024 Legal Chile — Plataforma de demostración para gestión legal corporativa
        </div>
      </footer>
    </main>
  );
};

export default LoginForm;

