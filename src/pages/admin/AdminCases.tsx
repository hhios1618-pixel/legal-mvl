import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { CaseStatus, ServiceType, Priority, SERVICE_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../../types';
import { Search, FileText, Users, Clock, Filter, ChevronRight, MessageCircle, Download } from 'lucide-react';

const AdminCases: React.FC = () => {
  const navigate = useNavigate();
  const { cases, users, lawyers, updateCaseStatus } = useApp();
  
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = useMemo(() => {
    return cases.filter(case_ => {
      const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
      const matchesType = filterType === 'all' || case_.type === filterType;
      const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
      const matchesSearch = searchTerm === '' || 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesPriority && matchesSearch;
    }).sort((a, b) => {
      // Ordenar por prioridad y fecha de creación
      const priorityOrder = { urgente: 4, alta: 3, media: 2, baja: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.createdAt - a.createdAt;
    });
  }, [cases, filterStatus, filterType, filterPriority, searchTerm]);

  const statusOptions = [
    { value: 'all' as const, label: 'Todos los estados' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as CaseStatus, label }))
  ];

  const typeOptions = [
    { value: 'all' as const, label: 'Todos los tipos' },
    ...Object.entries(SERVICE_LABELS).map(([value, label]) => ({ value: value as ServiceType, label }))
  ];

  const priorityOptions = [
    { value: 'all' as const, label: 'Todas las prioridades' },
    ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value: value as Priority, label }))
  ];

  const getClientName = (clientId: string) => {
    const client = users.find(u => u.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  const getLawyerName = (lawyerId: string | null | undefined) => {
    if (!lawyerId) return 'Sin asignar';
    const lawyer = lawyers.find(l => l.id === lawyerId);
    return lawyer ? lawyer.name : 'Abogado desconocido';
  };

  const handleStatusChange = (caseId: string, newStatus: CaseStatus) => {
    updateCaseStatus(caseId, newStatus, 'admin');
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Estado actualizado',
      message: `El caso ${caseId} ha sido actualizado a: ${STATUS_LABELS[newStatus]}`
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
      case 'baja': return 'text-emerald-600 bg-emerald-50';
      case 'media': return 'text-amber-600 bg-amber-50';
      case 'alta': return 'text-orange-600 bg-orange-50';
      case 'urgente': return 'text-red-600 bg-red-50';
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

  const formatSLADeadline = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `${days} días restantes`;
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Casos</h1>
            <p className="text-gray-600">
              Administra y supervisa todos los casos de la plataforma
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{filteredCases.length}</div>
            <div className="text-sm text-gray-600">Casos filtrados</div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Casos', 
            value: cases.length, 
            icon: FileText, 
            color: 'from-blue-600 to-blue-700' 
          },
          { 
            label: 'Casos Nuevos', 
            value: cases.filter(c => c.status === 'nuevo').length, 
            icon: FileText, 
            color: 'from-emerald-600 to-emerald-700' 
          },
          { 
            label: 'En Curso', 
            value: cases.filter(c => c.status === 'en_curso').length, 
            icon: Clock, 
            color: 'from-purple-600 to-purple-700' 
          },
          { 
            label: 'Resueltos', 
            value: cases.filter(c => c.status === 'resuelto').length, 
            icon: FileText, 
            color: 'from-teal-600 to-teal-700' 
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar casos por ID, título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CaseStatus | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Cases table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Caso</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Cliente</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Abogado</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Estado</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Prioridad</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">SLA</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Creado</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron casos</h3>
                    <p className="text-gray-600">
                      No hay casos que coincidan con los filtros seleccionados.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCases.map((case_, index) => (
                  <motion.tr
                    key={case_.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 font-medium text-sm">{case_.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">#{case_.id}</span>
                          <span className="text-xs text-gray-600">•</span>
                          <span className="text-xs text-gray-600">{SERVICE_LABELS[case_.type]}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <p className="text-gray-900 text-sm">{getClientName(case_.clientId)}</p>
                    </td>
                    
                    <td className="py-4 px-6">
                      <p className="text-gray-900 text-sm">{getLawyerName(case_.assignedLawyerId)}</p>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <select
                        value={case_.status}
                        onChange={(e) => handleStatusChange(case_.id, e.target.value as CaseStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(case_.status)} bg-white text-gray-700`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value} className="bg-white text-gray-900">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                        {PRIORITY_LABELS[case_.priority]}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAColor(case_.slaStatus)}`}>
                        {formatSLADeadline(case_.slaDeadline)}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs text-gray-600">
                        {formatDate(case_.createdAt)}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {case_.messages.length > 0 && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-xs">{case_.messages.length}</span>
                          </span>
                        )}
                        {case_.documents.length > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <FileText className="w-3 h-3" />
                            <span className="text-xs">{case_.documents.length}</span>
                          </span>
                        )}
                        <button
                          onClick={() => navigate(`/admin/casos/${case_.id}`)}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminCases;


