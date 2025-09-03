import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { CaseStatus, ServiceType, SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { Search, FileText, MessageCircle, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

const LawyerCases: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, cases, updateCaseStatus } = useApp();
  
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const myCases = useMemo(() => {
    if (!currentUser) return [];
    return cases.filter(c => c.assignedLawyerId === currentUser.id);
  }, [currentUser, cases]);

  const filteredCases = useMemo(() => {
    return myCases.filter(case_ => {
      const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
      const matchesType = filterType === 'all' || case_.type === filterType;
      const matchesSearch = searchTerm === '' || 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    }).sort((a, b) => {
      // Ordenar por prioridad y fecha de actualización
      const priorityOrder = { urgente: 4, alta: 3, media: 2, baja: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.updatedAt - a.updatedAt;
    });
  }, [myCases, filterStatus, filterType, searchTerm]);

  const statusOptions = [
    { value: 'all' as const, label: 'Todos los estados' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as CaseStatus, label }))
  ];

  const typeOptions = [
    { value: 'all' as const, label: 'Todos los tipos' },
    ...Object.entries(SERVICE_LABELS).map(([value, label]) => ({ value: value as ServiceType, label }))
  ];

  const handleStatusChange = (caseId: string, newStatus: CaseStatus) => {
    if (!currentUser) return;
    
    updateCaseStatus(caseId, newStatus, currentUser.id);
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Estado actualizado',
      message: `El caso ha sido actualizado a: ${STATUS_LABELS[newStatus]}`
    });
  };

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

  const getUnreadMessages = (case_: any) => {
    if (!currentUser) return 0;
    return case_.messages.filter((m: any) => m.senderId !== currentUser.id && !m.read).length;
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
              Gestiona y actualiza el estado de todos tus casos asignados
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{myCases.length}</div>
            <div className="text-sm text-gray-600">Casos asignados</div>
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
              {myCases.length === 0 
                ? 'Aún no tienes casos asignados. Revisa los casos disponibles.'
                : 'No hay casos que coincidan con los filtros seleccionados.'
              }
            </p>
            {myCases.length === 0 && (
              <button
                onClick={() => navigate('/abogado/disponibles')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Ver Casos Disponibles
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
              className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200"
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
                    {getUnreadMessages(case_) > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {getUnreadMessages(case_)} mensajes
                      </span>
                    )}
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
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Status selector */}
                  <select
                    value={case_.status}
                    onChange={(e) => handleStatusChange(case_.id, e.target.value as CaseStatus)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value} className="bg-white text-gray-900">
                        {label}
                      </option>
                    ))}
                  </select>

                  {/* Quick actions */}
                  <button
                    onClick={() => navigate(`/abogado/casos/${case_.id}`)}
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors duration-200"
                  >
                    Ver Detalle
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>ID: {case_.id}</span>
                  {case_.messages.length > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{case_.messages.length}</span>
                    </div>
                  )}
                  {case_.documents.length > 0 && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <FileText className="w-4 h-4" />
                      <span>{case_.documents.length}</span>
                    </div>
                  )}
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
            <span>Mostrando {filteredCases.length} de {myCases.length} casos</span>
            <div className="flex items-center gap-4">
              <span>Activos: {filteredCases.filter(c => !['resuelto', 'archivado', 'rechazado'].includes(c.status)).length}</span>
              <span>Resueltos: {filteredCases.filter(c => c.status === 'resuelto').length}</span>
              <span>Urgentes: {filteredCases.filter(c => c.priority === 'urgente').length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LawyerCases;


