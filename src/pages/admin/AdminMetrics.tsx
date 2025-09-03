import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, eventBus } from '../../store';
import { SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { Download, BarChart, Users, FileText, Clock, Target, Award, TrendingUp } from 'lucide-react';

const AdminMetrics: React.FC = () => {
  const { getAdminMetrics } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

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

  const handleExportData = (type: 'csv' | 'pdf') => {
    // Simulación de exportación
    eventBus.emit('toast', {
      type: 'success',
      title: 'Exportación iniciada',
      message: `Los datos se están exportando en formato ${type.toUpperCase()}. Recibirás una notificación cuando esté listo.`
    });
  };

  const periodLabels = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
    '1y': 'Último año'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Métricas y Análisis</h1>
            <p className="text-gray-600">
              Análisis detallado del rendimiento de la plataforma legal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700"
            >
              {Object.entries(periodLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-white text-gray-900">
                  {label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportData('csv')}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-all duration-200 shadow-sm"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> Exportar CSV
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-all duration-200 shadow-sm"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Casos Totales',
            value: formatNumber(metrics.totalCases),
            change: '+12.5%',
            changeType: 'positive' as const,
            icon: FileText,
            color: 'from-blue-600 to-blue-700'
          },
          {
            title: 'Tiempo Promedio',
            value: formatTime(metrics.averageResolutionTime),
            change: '-8.2%',
            changeType: 'positive' as const,
            icon: Clock,
            color: 'from-emerald-600 to-emerald-700'
          },
          {
            title: 'Cumplimiento SLA',
            value: `${metrics.slaCompliance.toFixed(1)}%`,
            change: '+5.1%',
            changeType: 'positive' as const,
            icon: Target,
            color: 'from-purple-600 to-purple-700'
          },
          {
            title: 'Satisfacción Cliente',
            value: '4.7/5',
            change: '+0.3',
            changeType: 'positive' as const,
            icon: Award,
            color: 'from-amber-600 to-amber-700'
          }
        ].map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="w-8 h-8 text-gray-500" />
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{kpi.title}</span>
                <span className={`text-sm ${kpi.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Estado</h3>
          
          <div className="space-y-4">
            {Object.entries(metrics.casesByStatus).map(([status, count]) => {
              const percentage = (count / metrics.totalCases) * 100;
              const statusColors = {
                nuevo: { bg: 'bg-blue-500', text: 'text-blue-600' },
                tomado: { bg: 'bg-purple-500', text: 'text-purple-600' },
                en_revision: { bg: 'bg-orange-500', text: 'text-orange-600' },
                en_curso: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
                pendiente_cliente: { bg: 'bg-amber-500', text: 'text-amber-600' },
                resuelto: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
                archivado: { bg: 'bg-gray-500', text: 'text-gray-600' },
                rechazado: { bg: 'bg-red-500', text: 'text-red-600' }
              };
              
              const colors = statusColors[status as keyof typeof statusColors] || { bg: 'bg-gray-500', text: 'text-gray-600' };
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                      <span className="text-sm text-gray-900">
                        {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${colors.text}`}>{percentage.toFixed(1)}%</span>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={`h-2 rounded-full ${colors.bg}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cases by Category Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Categoría</h3>
          
          <div className="space-y-4">
            {Object.entries(metrics.casesByCategory).map(([category, count]) => {
              const percentage = (count / metrics.totalCases) * 100;
              const categoryColors = {
                societario: { bg: 'bg-blue-500', text: 'text-blue-600' },
                contratos: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
                compliance: { bg: 'bg-purple-500', text: 'text-purple-600' },
                pi: { bg: 'bg-pink-500', text: 'text-pink-600' },
                laboral: { bg: 'bg-amber-500', text: 'text-amber-600' },
                litigios: { bg: 'bg-red-500', text: 'text-red-600' },
                ma: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
                tributario: { bg: 'bg-orange-500', text: 'text-orange-600' }
              };
              
              const colors = categoryColors[category as keyof typeof categoryColors] || { bg: 'bg-gray-500', text: 'text-gray-600' };
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                      <span className="text-sm text-gray-900">
                        {SERVICE_LABELS[category as keyof typeof SERVICE_LABELS] || category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${colors.text}`}>{percentage.toFixed(1)}%</span>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className={`h-2 rounded-full ${colors.bg}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Lawyer Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rendimiento de Abogados</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Abogado</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Casos Completados</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Rating Promedio</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Cumplimiento SLA</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tiempo Promedio</th>
              </tr>
            </thead>
            <tbody>
              {metrics.lawyerRanking.map((lawyer, index) => (
                <motion.tr
                  key={lawyer.lawyerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-900 font-medium">{lawyer.lawyerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900">{lawyer.casesCompleted}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-amber-500">⭐</span>
                      <span className="text-gray-900">{lawyer.averageRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lawyer.slaCompliance >= 90 ? 'text-emerald-600 bg-emerald-50' :
                      lawyer.slaCompliance >= 80 ? 'text-amber-600 bg-amber-50' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {lawyer.slaCompliance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {formatTime(lawyer.averageResolutionTime)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia Operacional</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Casos por día:</span>
              <span className="text-gray-900 font-medium">8.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo respuesta:</span>
              <span className="text-gray-900 font-medium">2.3h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de resolución:</span>
              <span className="text-emerald-600 font-medium">94.2%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Calidad de Servicio</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfacción cliente:</span>
              <span className="text-gray-900 font-medium">4.7/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Casos reabiertos:</span>
              <span className="text-gray-900 font-medium">2.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Escalaciones:</span>
              <span className="text-amber-600 font-medium">5.8%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Casos activos por abogado:</span>
              <span className="text-gray-900 font-medium">5.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Casos nuevos por día:</span>
              <span className="text-gray-900 font-medium">1.8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Casos cerrados por semana:</span>
              <span className="text-gray-900 font-medium">15</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMetrics;


