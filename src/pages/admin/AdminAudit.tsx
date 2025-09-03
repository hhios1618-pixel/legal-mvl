import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp, eventBus } from '../../store';
import { Download, Search, User, FileText, Clock, AlertTriangle, MessageCircle, Users } from 'lucide-react';

const AdminAudit: React.FC = () => {
  const { getAdminMetrics } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = useMemo(() => {
    return getAdminMetrics();
  }, [getAdminMetrics]);

  const filteredActivity = useMemo(() => {
    return metrics.recentActivity.filter(activity => {
      const matchesType = filterType === 'all' || activity.action === filterType;
      const matchesUser = filterUser === 'all' || activity.userId === filterUser;
      const matchesSearch = searchTerm === '' || 
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesUser && matchesSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [metrics.recentActivity, filterType, filterUser, searchTerm]);

  const uniqueUsers = useMemo(() => {
    const users = new Set(metrics.recentActivity.map(a => ({ id: a.userId, name: a.userName })));
    return Array.from(users).sort((a, b) => a.name.localeCompare(b.name));
  }, [metrics.recentActivity]);

  const actionTypes = [
    { value: 'all', label: 'Todas las acciones' },
    { value: 'login', label: 'Inicios de sesión' },
    { value: 'case_created', label: 'Casos creados' },
    { value: 'case_updated', label: 'Casos actualizados' },
    { value: 'case_claimed', label: 'Casos tomados' },
    { value: 'message_sent', label: 'Mensajes enviados' },
    { value: 'document_uploaded', label: 'Documentos subidos' },
    { value: 'status_changed', label: 'Estados cambiados' }
  ];

  const handleExportAudit = (format: 'csv' | 'pdf') => {
    eventBus.emit('toast', {
      type: 'success',
      title: 'Exportación iniciada',
      message: `El log de auditoría se está exportando en formato ${format.toUpperCase()}. Recibirás una notificación cuando esté listo.`
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <User className="w-5 h-5" />;
      case 'case_created': return <FileText className="w-5 h-5" />;
      case 'case_updated': return <FileText className="w-5 h-5" />;
      case 'case_claimed': return <FileText className="w-5 h-5" />;
      case 'message_sent': return <MessageCircle className="w-5 h-5" />;
      case 'document_uploaded': return <FileText className="w-5 h-5" />;
      case 'status_changed': return <AlertTriangle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-blue-50 text-blue-600';
      case 'case_created': return 'bg-emerald-50 text-emerald-600';
      case 'case_updated': return 'bg-amber-50 text-amber-600';
      case 'case_claimed': return 'bg-purple-50 text-purple-600';
      case 'message_sent': return 'bg-indigo-50 text-indigo-600';
      case 'document_uploaded': return 'bg-orange-50 text-orange-600';
      case 'status_changed': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Log de Auditoría</h1>
            <p className="text-gray-600">
              Registro completo de todas las actividades y acciones en la plataforma
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className="text-2xl font-bold text-gray-900">{filteredActivity.length}</div>
              <div className="text-sm text-gray-600">Eventos</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportAudit('csv')}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-all duration-200 shadow-sm"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> Exportar CSV
              </button>
              <button
                onClick={() => handleExportAudit('pdf')}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-all duration-200 shadow-sm"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en el log de auditoría..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Action type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            {actionTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-white text-gray-900">
                {type.label}
              </option>
            ))}
          </select>

          {/* User filter */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="all" className="bg-white text-gray-900">Todos los usuarios</option>
            {uniqueUsers.map(user => (
              <option key={user.id} value={user.id} className="bg-white text-gray-900">
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Eventos', value: metrics.recentActivity.length, icon: <FileText className="w-6 h-6" />, color: 'from-blue-600 to-blue-700' },
          { label: 'Usuarios Activos', value: uniqueUsers.length, icon: <Users className="w-6 h-6" />, color: 'from-emerald-600 to-emerald-700' },
          { label: 'Eventos Hoy', value: metrics.recentActivity.filter(a => {
            const today = new Date();
            const eventDate = new Date(a.timestamp);
            return eventDate.toDateString() === today.toDateString();
          }).length, icon: <Clock className="w-6 h-6" />, color: 'from-purple-600 to-purple-700' },
          { label: 'Eventos Críticos', value: metrics.recentActivity.filter(a => 
            ['case_created', 'status_changed', 'document_uploaded'].includes(a.action)
          ).length, icon: <AlertTriangle className="w-6 h-6" />, color: 'from-orange-600 to-orange-700' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">{IconComponent}</span>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Registro de Actividades</h3>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando {filteredActivity.length} de {metrics.recentActivity.length} eventos
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredActivity.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron eventos</h3>
              <p className="text-gray-600">
                No hay eventos que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.details}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{activity.userName}</span>
                        </span>
                        
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>ID: {activity.userId}</span>
                        </span>
                        
                        {activity.caseId && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>Caso: {activity.caseId}</span>
                          </span>
                        )}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                          {actionTypes.find(t => t.value === activity.action)?.label || activity.action}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Summary */}
      {filteredActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredActivity.length} eventos de {metrics.recentActivity.length} totales
            </span>
            <div className="flex items-center gap-4">
              <span>
                Último evento: {formatDate(Math.max(...filteredActivity.map(a => a.timestamp)))}
              </span>
              <span>
                Primer evento: {formatDate(Math.min(...filteredActivity.map(a => a.timestamp)))}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminAudit;


