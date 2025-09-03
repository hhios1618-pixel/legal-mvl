import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { ServiceType, Priority, SERVICE_LABELS, PRIORITY_LABELS } from '../../types';
import { Search, Plus, Clock, ChevronRight, Gavel } from 'lucide-react';

const LawyerAvailableCases: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, cases, lawyers, claimCase } = useApp();
  
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const lawyerData = useMemo(() => {
    if (!currentUser) return null;
    return lawyers.find(l => l.id === currentUser.id);
  }, [currentUser, lawyers]);

  const availableCases = useMemo(() => {
    if (!currentUser || !lawyerData) return [];
    return cases.filter(c => 
      c.status === 'nuevo' && 
      !c.assignedLawyerId && 
      lawyerData.specialties.includes(c.type)
    );
  }, [currentUser, cases, lawyerData]);

  const filteredCases = useMemo(() => {
    return availableCases.filter(case_ => {
      const matchesType = filterType === 'all' || case_.type === filterType;
      const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
      const matchesSearch = searchTerm === '' || 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesPriority && matchesSearch;
    }).sort((a, b) => {
      // Ordenar por prioridad primero, luego por fecha
      const priorityOrder = { urgente: 4, alta: 3, media: 2, baja: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.createdAt - a.createdAt;
    });
  }, [availableCases, filterType, filterPriority, searchTerm]);

  const typeOptions = useMemo(() => {
    if (!lawyerData) return [];
    return [
      { value: 'all' as const, label: 'Todas mis especialidades' },
      ...lawyerData.specialties.map(type => ({ value: type, label: SERVICE_LABELS[type] }))
    ];
  }, [lawyerData]);

  const priorityOptions = [
    { value: 'all' as const, label: 'Todas las prioridades' },
    { value: 'urgente' as const, label: 'Urgente' },
    { value: 'alta' as const, label: 'Alta' },
    { value: 'media' as const, label: 'Media' },
    { value: 'baja' as const, label: 'Baja' }
  ];

  const handleClaimCase = async (caseId: string) => {
    if (!currentUser) return;

    const success = claimCase(caseId, currentUser.id);
    
    if (success) {
      eventBus.emit('toast', {
        type: 'success',
        title: 'Caso tomado exitosamente',
        message: 'El caso ha sido asignado a tu cartera. Puedes verlo en "Mis Casos".'
      });
      
      // Redirigir al detalle del caso
      navigate(`/abogado/casos/${caseId}`);
    } else {
      eventBus.emit('toast', {
        type: 'error',
        title: 'No se pudo tomar el caso',
        message: 'El caso ya fue tomado por otro abogado o no está disponible.'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-emerald-600 bg-emerald-50';
      case 'media': return 'text-amber-600 bg-amber-50';
      case 'alta': return 'text-orange-600 bg-orange-50';
      case 'urgente': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'verde': return 'text-emerald-600 bg-emerald-50';
      case 'amarillo': return 'text-amber-600 bg-amber-50';
      case 'rojo': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  if (!currentUser || !lawyerData) return null;

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Casos Disponibles</h1>
            <p className="text-gray-600">
              {filteredCases.length} casos disponibles en tus especialidades: {lawyerData.specialties.map(s => SERVICE_LABELS[s]).join(', ')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{filteredCases.length}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
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

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700"
          >
            {priorityOptions.map(option => (
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
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay casos disponibles</h3>
            <p className="text-gray-600 mb-6">
              {availableCases.length === 0 
                ? 'No hay casos nuevos en tus especialidades en este momento.'
                : 'No hay casos que coincidan con los filtros seleccionados.'
              }
            </p>
            <button
              onClick={() => navigate('/abogado/casos')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Ver Mis Casos
            </button>
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                      {PRIORITY_LABELS[case_.priority]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAColor(case_.slaStatus)}`}>
                      SLA
                    </span>
                    <span className="text-sm text-gray-600">
                      {SERVICE_LABELS[case_.type]}
                    </span>
                    <span className="text-sm text-gray-600">
                      • Hace {formatTimeAgo(case_.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{case_.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {case_.description}
                  </p>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaimCase(case_.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Tomar Caso
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>ID: {case_.id}</span>
                  <span>•</span>
                  <span>Creado: {formatDate(case_.createdAt)}</span>
                  {case_.estimatedHours && (
                    <>
                      <span>•</span>
                      <span>Est: {case_.estimatedHours}h</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Nuevo</span>
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
            <span>Mostrando {filteredCases.length} de {availableCases.length} casos disponibles</span>
            <div className="flex items-center gap-4">
              <span>Urgentes: {filteredCases.filter(c => c.priority === 'urgente').length}</span>
              <span>Alta prioridad: {filteredCases.filter(c => c.priority === 'alta').length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LawyerAvailableCases;


