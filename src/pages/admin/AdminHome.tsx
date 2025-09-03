import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store';
import { BarChart3, Users, FileText, Shield, TrendingUp, Clock, Target, Award, Activity, ChevronRight } from 'lucide-react';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { getAdminMetrics } = useApp();

  const metrics = useMemo(() => {
    return getAdminMetrics();
  }, [getAdminMetrics]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const formatTime = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return '<1h';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Monitorea y gestiona toda la plataforma legal corporativa desde aquí.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalCases)}</div>
            <div className="text-sm text-gray-600">Casos totales</div>
          </div>
        </div>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Casos Totales', 
            value: formatNumber(metrics.totalCases), 
            icon: FileText, 
            color: 'from-blue-600 to-blue-700',
            change: '+12%'
          },
          { 
            label: 'Tiempo Promedio', 
            value: formatTime(metrics.averageResolutionTime), 
            icon: Clock, 
            color: 'from-emerald-600 to-emerald-700',
            change: '-8%'
          },
          { 
            label: 'Cumplimiento SLA', 
            value: `${metrics.slaCompliance.toFixed(1)}%`, 
            icon: Target, 
            color: 'from-purple-600 to-purple-700',
            change: '+5%'
          },
          { 
            label: 'Abogados Activos', 
            value: formatNumber(metrics.lawyerRanking.length), 
            icon: Users, 
            color: 'from-orange-600 to-orange-700',
            change: '+2'
          }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className="w-6 h-6 text-gray-500" />
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-xs text-emerald-600">{metric.change}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Casos por Estado</h3>
            <button
              onClick={() => navigate('/admin/metricas')}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
            >
              Ver detalles →
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(metrics.casesByStatus).map(([status, count]) => {
              const percentage = (count / metrics.totalCases) * 100;
              const statusColors = {
                nuevo: 'bg-blue-500',
                tomado: 'bg-purple-500',
                en_revision: 'bg-orange-500',
                en_curso: 'bg-indigo-500',
                pendiente_cliente: 'bg-amber-500',
                resuelto: 'bg-emerald-500',
                archivado: 'bg-gray-500',
                rechazado: 'bg-red-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`} />
                    <span className="text-sm text-gray-900 capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cases by category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Casos por Categoría</h3>
            <button
              onClick={() => navigate('/admin/metricas')}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
            >
              Ver detalles →
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(metrics.casesByCategory).map(([category, count]) => {
              const percentage = (count / metrics.totalCases) * 100;
              const categoryColors = {
                societario: 'bg-blue-500',
                contratos: 'bg-emerald-500',
                compliance: 'bg-purple-500',
                pi: 'bg-pink-500',
                laboral: 'bg-amber-500',
                litigios: 'bg-red-500',
                ma: 'bg-indigo-500',
                tributario: 'bg-orange-500'
              };
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500'}`} />
                    <span className="text-sm text-gray-900 capitalize">{category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top lawyers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Ranking de Abogados</h3>
          <button
            onClick={() => navigate('/admin/abogados')}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
          >
            Ver todos →
          </button>
        </div>

        <div className="space-y-4">
          {metrics.lawyerRanking.slice(0, 5).map((lawyer, index) => (
            <motion.div
              key={lawyer.lawyerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{lawyer.lawyerName}</p>
                  <p className="text-sm text-gray-600">
                    {lawyer.casesCompleted} casos • ⭐ {lawyer.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-600">{lawyer.slaCompliance.toFixed(1)}% SLA</p>
                <p className="text-xs text-gray-500">{formatTime(lawyer.averageResolutionTime)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <button
            onClick={() => navigate('/admin/auditoria')}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
          >
            Ver log completo →
          </button>
        </div>

        <div className="space-y-3">
          {metrics.recentActivity.slice(0, 8).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <div>
                  <p className="text-sm text-gray-900">{activity.details}</p>
                  <p className="text-xs text-gray-600">{activity.userName}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(activity.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            title: 'Gestionar Casos',
            description: 'Ver y administrar todos los casos',
            icon: FileText,
            action: () => navigate('/admin/casos'),
            color: 'from-blue-600 to-purple-600'
          },
          {
            title: 'Abogados',
            description: 'Gestionar equipo de abogados',
            icon: Users,
            action: () => navigate('/admin/abogados'),
            color: 'from-emerald-600 to-teal-600'
          },
          {
            title: 'Métricas',
            description: 'Análisis detallado y reportes',
            icon: BarChart3,
            action: () => navigate('/admin/metricas'),
            color: 'from-orange-600 to-red-600'
          },
          {
            title: 'Auditoría',
            description: 'Log de actividades y seguridad',
            icon: Shield,
            action: () => navigate('/admin/auditoria'),
            color: 'from-purple-600 to-pink-600'
          }
        ].map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-gray-200 text-left transition-all duration-200"
            >
              <IconComponent className="w-8 h-8 text-gray-500 mb-3" />
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

export default AdminHome;

