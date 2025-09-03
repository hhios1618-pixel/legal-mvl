import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store';
import { SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { Plus, MessageCircle, FileText, Home, Search, BarChart3, Activity, Users } from 'lucide-react';

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, getCasesByUser } = useApp();

  const cases = useMemo(() => {
    if (!currentUser) return [];
    return getCasesByUser(currentUser.id, 'cliente');
  }, [currentUser, getCasesByUser]);

  const stats = useMemo(() => {
    const activeCases = cases.filter(c => !['resuelto', 'archivado', 'rechazado'].includes(c.status));
    const pendingClient = cases.filter(c => c.status === 'pendiente_cliente');
    const resolved = cases.filter(c => c.status === 'resuelto');
    const slaRisk = cases.filter(c => c.slaStatus === 'rojo' || c.slaStatus === 'amarillo');

    return {
      total: cases.length,
      active: activeCases.length,
      pendingClient: pendingClient.length,
      resolved: resolved.length,
      slaRisk: slaRisk.length
    };
  }, [cases]);

  const recentCases = useMemo(() => {
    return cases
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
  }, [cases]);

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'verde': return 'text-emerald-600 bg-emerald-50';
      case 'amarillo': return 'text-amber-600 bg-amber-50';
      case 'rojo': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo': return 'text-blue-600 bg-blue-50';
      case 'tomado': return 'text-purple-600 bg-purple-50';
      case 'en_revision': return 'text-orange-600 bg-orange-50';
      case 'en_curso': return 'text-indigo-600 bg-indigo-50';
      case 'pendiente_cliente': return 'text-amber-600 bg-amber-50';
      case 'resuelto': return 'text-emerald-600 bg-emerald-50';
      case 'archivado': return 'text-gray-600 bg-gray-50';
      case 'rechazado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido, {currentUser.name}
            </h1>
            <p className="text-gray-600">
              Gestiona tus casos legales y mantente al día con el progreso de tus solicitudes.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cliente/nuevo-caso')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Nuevo Caso
          </motion.button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total de Casos', value: stats.total, icon: FileText, color: 'from-blue-600 to-blue-700' },
          { label: 'Casos Activos', value: stats.active, icon: Activity, color: 'from-emerald-600 to-emerald-700' },
          { label: 'Pendiente de Usted', value: stats.pendingClient, icon: Users, color: 'from-amber-600 to-amber-700' },
          { label: 'Casos Resueltos', value: stats.resolved, icon: Home, color: 'from-purple-600 to-purple-700' },
          { label: 'Riesgo SLA', value: stats.slaRisk, icon: Search, color: 'from-red-600 to-red-700' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-6 h-6 text-gray-500`} />
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Casos Recientes</h2>
          <button
            onClick={() => navigate('/cliente/casos')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            Ver todos →
          </button>
        </div>

        {recentCases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">No tienes casos aún</p>
            <button
              onClick={() => navigate('/cliente/nuevo-caso')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Crear tu primer caso
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCases.map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/cliente/casos/${case_.id}`)}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAColor(case_.slaStatus)}`}>
                      SLA
                    </span>
                    <span className="text-sm text-gray-600">
                      {SERVICE_LABELS[case_.type]}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(case_.updatedAt)}
                  </span>
                </div>

                <h3 className="text-gray-900 font-semibold mb-2">{case_.title}</h3>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                    {STATUS_LABELS[case_.status]}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    Prioridad: {case_.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            title: 'Crear Nuevo Caso',
            description: 'Inicia una nueva solicitud legal',
            icon: Plus,
            action: () => navigate('/cliente/nuevo-caso'),
            color: 'from-blue-600 to-blue-700'
          },
          {
            title: 'Ver Mensajes',
            description: 'Revisa las comunicaciones con tus abogados',
            icon: MessageCircle,
            action: () => navigate('/cliente/mensajes'),
            color: 'from-emerald-600 to-emerald-700'
          },
          {
            title: 'Mis Casos',
            description: 'Revisa el estado de todos tus casos',
            icon: FileText,
            action: () => navigate('/cliente/casos'),
            color: 'from-orange-600 to-orange-700'
          }
        ].map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-gray-200 text-left transition-all duration-200"
            >
              <IconComponent className={`w-8 h-8 text-gray-500 mb-3`} />
              <h3 className="text-gray-900 font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
              <div className={`w-full h-1 bg-gradient-to-r ${action.color} rounded-full mt-4`} />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ClientHome;


