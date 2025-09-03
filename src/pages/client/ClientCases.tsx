import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store';
import { CaseStatus, ServiceType, SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { Plus, Search, MessageCircle, FileText, ChevronRight, Bell } from 'lucide-react';

const ClientCases: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, getCasesByUser } = useApp();
  
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const cases = useMemo(() => {
    if (!currentUser) return [];
    return getCasesByUser(currentUser.id, 'cliente');
  }, [currentUser, getCasesByUser]);

  const filteredCases = useMemo(() => {
    return cases.filter(case_ => {
      const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
      const matchesType = filterType === 'all' || case_.type === filterType;
      const matchesSearch = searchTerm === '' || 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [cases, filterStatus, filterType, searchTerm]);

  const statusOptions = [
    { value: 'all' as const, label: 'Todos los estados' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as CaseStatus, label }))
  ];

  const typeOptions = [
    { value: 'all' as const, label: 'Todos los tipos' },
    ...Object.entries(SERVICE_LABELS).map(([value, label]) => ({ value: value as ServiceType, label }))
  ];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-emerald-600';
      case 'media': return 'text-amber-600';
      case 'alta': return 'text-orange-600';
      case 'urgente': return 'text-red-600';
      default: return 'text-gray-600';
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Casos</h1>
            <p className="text-gray-600">
              Gestiona y revisa el estado de todos tus casos legales
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar casos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CaseStatus | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ServiceType | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Cases list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron casos</h3>
            <p className="text-gray-600 mb-6">
              {cases.length === 0 
                ? 'Aún no tienes casos creados. ¡Crea tu primer caso!'
                : 'No hay casos que coincidan con los filtros seleccionados.'
              }
            </p>
            {cases.length === 0 && (
              <button
                onClick={() => navigate('/cliente/nuevo-caso')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Crear Primer Caso
              </button>
            )}
          </div>
        ) : (
          filteredCases.map((case_, index) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/cliente/casos/${case_.id}`)}
              className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 border border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAColor(case_.slaStatus)}`}>
                      SLA
                    </span>
                    <span className="text-sm text-gray-600">
                      {SERVICE_LABELS[case_.type]}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                      • {case_.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{case_.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {case_.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-500 mb-2">
                    Actualizado: {formatDate(case_.updatedAt)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                    {STATUS_LABELS[case_.status]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>ID: {case_.id}</span>
                  <span>•</span>
                  <span>Creado: {formatDate(case_.createdAt)}</span>
                  {case_.assignedLawyerId && (
                    <>
                      <span>•</span>
                      <span>Asignado</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {case_.messages.length > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{case_.messages.length}</span>
                    </div>
                  )}
                  {case_.documents.length > 0 && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs">{case_.documents.length}</span>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Stats summary */}
      {filteredCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mostrando {filteredCases.length} de {cases.length} casos</span>
            <div className="flex items-center gap-4">
              <span>Activos: {filteredCases.filter(c => !['resuelto', 'archivado', 'rechazado'].includes(c.status)).length}</span>
              <span>Resueltos: {filteredCases.filter(c => c.status === 'resuelto').length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientCases;


