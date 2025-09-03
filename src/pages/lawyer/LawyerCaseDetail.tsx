import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { CaseStatus, SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { ChevronLeft, MessageCircle, FileText, CalendarDays, Clock, CheckCircle, Download, Send, Plus, Users, Activity, AlertTriangle, Gavel } from 'lucide-react';

const LawyerCaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { currentUser, cases, users, sendMessage, markMessagesAsRead, updateCaseStatus, requestDocument } = useApp();
  
  const [newMessage, setNewMessage] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'messages' | 'documents' | 'actions'>('timeline');

  const case_ = useMemo(() => {
    return cases.find(c => c.id === caseId);
  }, [cases, caseId]);

  const client = useMemo(() => {
    if (!case_) return null;
    return users.find(u => u.id === case_.clientId);
  }, [case_, users]);

  if (!currentUser || !case_ || case_.assignedLawyerId !== currentUser.id) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Caso no encontrado</h2>
        <p className="text-gray-600 mb-6">El caso que buscas no existe o no tienes acceso a él.</p>
        <button
          onClick={() => navigate('/abogado/casos')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Volver a Mis Casos
        </button>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(case_.id, currentUser.id, newMessage.trim());
    setNewMessage('');
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Mensaje enviado',
      message: 'Tu mensaje ha sido enviado al cliente.'
    });
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    updateCaseStatus(case_.id, newStatus, currentUser.id);
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Estado actualizado',
      message: `El caso ha sido actualizado a: ${STATUS_LABELS[newStatus]}`
    });
  };

  const handleRequestDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocumentName.trim()) return;

    requestDocument(case_.id, newDocumentName.trim(), currentUser.id);
    setNewDocumentName('');
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Documento solicitado',
      message: `Se ha solicitado el documento: ${newDocumentName.trim()}`
    });
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'verde': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'amarillo': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'rojo': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
    return new Date(timestamp).toLocaleString('es-CL', {
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

  const sortedTimeline = [...case_.timeline].sort((a, b) => b.timestamp - a.timestamp);
  const sortedMessages = [...case_.messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate('/abogado/casos')}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-600">Caso #{case_.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSLAColor(case_.slaStatus)}`}>
                SLA: {formatSLADeadline(case_.slaDeadline)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{case_.title}</h1>
            <p className="text-gray-600 mb-4">{case_.description}</p>
            {client && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>Cliente: {client.name}</span>
                <span>•</span>
                <span>{client.email}</span>
                {client.company && (
                  <>
                    <span>•</span>
                    <span>{client.company}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="text-right ml-6">
            <select
              value={case_.status}
              onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
              className={`px-4 py-2 rounded-full text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(case_.status)} bg-white text-gray-700`}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-white text-gray-900">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Case info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Tipo de Servicio</span>
            <p className="text-gray-900 font-medium">{SERVICE_LABELS[case_.type]}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Prioridad</span>
            <p className="text-gray-900 font-medium capitalize">{case_.priority}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Creado</span>
            <p className="text-gray-900 font-medium">{formatDate(case_.createdAt)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Última Actualización</span>
            <p className="text-gray-900 font-medium">{formatDate(case_.updatedAt)}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="flex border-b border-gray-100">
          {[
            { id: 'timeline', label: 'Timeline', icon: CalendarDays },
            { id: 'messages', label: 'Mensajes', icon: MessageCircle, count: case_.messages.length },
            { id: 'documents', label: 'Documentos', icon: FileText, count: case_.documents.length },
            { id: 'actions', label: 'Acciones', icon: Gavel }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {sortedTimeline.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay eventos en el timeline aún</p>
                </div>
              ) : (
                sortedTimeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">{event.description}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{event.userName}</span>
                        <span>•</span>
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Messages list */}
              <div className="space-y-4 max-h-96 overflow-y-auto p-2 -m-2">
                {sortedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay mensajes aún</p>
                  </div>
                ) : (
                  sortedMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                        message.senderId === currentUser.id
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">{message.senderName}</span>
                          <span className="text-xs text-gray-500"><Clock className="w-3 h-3 inline-block mr-1" />{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Message form */}
              <form onSubmit={handleSendMessage} className="flex gap-3 pt-4 border-t border-gray-100">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje al cliente..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Request document form */}
              <form onSubmit={handleRequestDocument} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-gray-900 font-semibold mb-3">Solicitar Documento al Cliente</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    placeholder="Nombre del documento a solicitar..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newDocumentName.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Solicitar
                  </button>
                </div>
              </form>

              {/* Documents list */}
              <div className="space-y-4">
                {case_.documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay documentos aún</p>
                  </div>
                ) : (
                  case_.documents.map((document, index) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{document.name}</p>
                          <p className="text-sm text-gray-600">
                            {(document.size / 1024).toFixed(1)} KB • {formatDate(document.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          document.status === 'aprobado' ? 'text-emerald-600 bg-emerald-50' :
                          document.status === 'rechazado' ? 'text-red-600 bg-red-50' :
                          document.status === 'recibido' ? 'text-blue-600 bg-blue-50' :
                          'text-amber-600 bg-amber-50'
                        }`}>
                          {document.status}
                        </span>
                        {document.required && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Requerido</span>
                        )}
                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange('resuelto')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-4 px-6 rounded-xl shadow-sm border border-emerald-200 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Marcar como Resuelto
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange('archivado')}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <FileText className="w-6 h-6" />
                  Archivar Caso
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange('rechazado')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-4 px-6 rounded-xl shadow-sm border border-red-200 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <AlertTriangle className="w-6 h-6" />
                  Rechazar Caso
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange('pendiente_cliente')}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold py-4 px-6 rounded-xl shadow-sm border border-amber-200 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Clock className="w-6 h-6" />
                  Pendiente Cliente
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LawyerCaseDetail;


