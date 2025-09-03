import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../store';
import { SERVICE_LABELS } from '../../types';
import { Search, Users, CheckCircle, Clock, Star } from 'lucide-react';

const AdminLawyers: React.FC = () => {
  const { lawyers, cases, getAdminMetrics } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'disponible' | 'ocupado' | 'no_disponible'>('all');

  const metrics = useMemo(() => {
    return getAdminMetrics();
  }, [getAdminMetrics]);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter(lawyer => {
      const matchesSearch = searchTerm === '' || 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialties.some(s => SERVICE_LABELS[s].toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || lawyer.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Ordenar por rating y casos completados
      if (a.ratingAvg !== b.ratingAvg) {
        return b.ratingAvg - a.ratingAvg;
      }
      return b.casesCompleted - a.casesCompleted;
    });
  }, [lawyers, searchTerm, filterStatus]);

  const getLawyerStats = (lawyerId: string) => {
    const lawyerCases = cases.filter(c => c.assignedLawyerId === lawyerId);
    const activeCases = lawyerCases.filter(c => !['resuelto', 'archivado', 'rechazado'].includes(c.status));
    const resolvedCases = lawyerCases.filter(c => c.status === 'resuelto');
    const avgResolutionTime = resolvedCases.length > 0 
      ? resolvedCases.reduce((sum, c) => sum + (c.updatedAt - c.createdAt), 0) / resolvedCases.length
      : 0;
    
    return {
      totalCases: lawyerCases.length,
      activeCases: activeCases.length,
      resolvedCases: resolvedCases.length,
      avgResolutionTime
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'text-emerald-600 bg-emerald-50';
      case 'ocupado': return 'text-amber-600 bg-amber-50';
      case 'no_disponible': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
      year: 'numeric'
    });
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'no_disponible', label: 'No disponible' }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Abogados</h1>
            <p className="text-gray-600">
              Administra el equipo de abogados y su rendimiento
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{lawyers.length}</div>
            <div className="text-sm text-gray-600">Abogados registrados</div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Abogados', 
            value: lawyers.length, 
            icon: Users, 
            color: 'from-blue-600 to-blue-700' 
          },
          { 
            label: 'Disponibles', 
            value: lawyers.filter(l => l.status === 'disponible').length, 
            icon: CheckCircle, 
            color: 'from-emerald-600 to-emerald-700' 
          },
          { 
            label: 'Ocupados', 
            value: lawyers.filter(l => l.status === 'ocupado').length, 
            icon: Clock, 
            color: 'from-amber-600 to-amber-700' 
          },
          { 
            label: 'Rating Promedio', 
            value: (lawyers.reduce((sum, l) => sum + l.ratingAvg, 0) / lawyers.length).toFixed(1), 
            icon: Star, 
            color: 'from-purple-600 to-purple-700' 
          }
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
                <IconComponent className="w-6 h-6 text-gray-500" />
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar abogados por nombre, email o especialidad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Top performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.lawyerRanking.slice(0, 3).map((lawyer, index) => (
            <motion.div
              key={lawyer.lawyerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{lawyer.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <h4 className="text-gray-900 font-medium mb-2">{lawyer.lawyerName}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Casos completados:</span>
                  <span className="text-gray-900">{lawyer.casesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cumplimiento SLA:</span>
                  <span className="text-emerald-600">{lawyer.slaCompliance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo promedio:</span>
                  <span className="text-gray-900">{formatTime(lawyer.averageResolutionTime)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lawyers table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Abogado</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Especialidades</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Estado</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Rating</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Casos Activos</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Completados</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Tiempo Promedio</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLawyers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron abogados</h3>
                    <p className="text-gray-600">
                      No hay abogados que coincidan con los filtros seleccionados.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLawyers.map((lawyer, index) => {
                  const stats = getLawyerStats(lawyer.id);
                  
                  return (
                    <motion.tr
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-gray-900 font-medium">{lawyer.name}</p>
                          <p className="text-sm text-gray-600">{lawyer.email}</p>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specialties.slice(0, 2).map(specialty => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                            >
                              {SERVICE_LABELS[specialty]}
                            </span>
                          ))}
                          {lawyer.specialties.length > 2 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                              +{lawyer.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lawyer.status)}`}>
                          {lawyer.status}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-amber-500">⭐</span>
                          <span className="text-gray-900">{lawyer.ratingAvg.toFixed(1)}</span>
                          <span className="text-xs text-gray-600">({lawyer.ratingCount})</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className="text-gray-900 font-medium">{stats.activeCases}</span>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className="text-gray-900 font-medium">{lawyer.casesCompleted}</span>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className="text-gray-600">
                          {stats.avgResolutionTime > 0 ? formatTime(stats.avgResolutionTime) : 'N/A'}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className="text-xs text-gray-600">
                          {formatDate(lawyer.joinedAt)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary */}
      {filteredLawyers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mostrando {filteredLawyers.length} de {lawyers.length} abogados</span>
            <div className="flex items-center gap-4">
              <span>Disponibles: {filteredLawyers.filter(l => l.status === 'disponible').length}</span>
              <span>Rating promedio: {(filteredLawyers.reduce((sum, l) => sum + l.ratingAvg, 0) / filteredLawyers.length).toFixed(1)}</span>
              <span>Casos activos: {filteredLawyers.reduce((sum, l) => sum + getLawyerStats(l.id).activeCases, 0)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminLawyers;


