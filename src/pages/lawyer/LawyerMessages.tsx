import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { SERVICE_LABELS, STATUS_LABELS } from '../../types';
import { Send, MessageCircle, FileText, ChevronRight, Search } from 'lucide-react';

const LawyerMessages: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, cases, sendMessage } = useApp();
  
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const myCases = useMemo(() => {
    if (!currentUser) return [];
    return cases
      .filter(c => c.assignedLawyerId === currentUser.id && (c.messages.length > 0 || c.status !== 'nuevo'))
      .sort((a, b) => {
        const aLastMessage = a.messages.length > 0 ? Math.max(...a.messages.map(m => m.timestamp)) : a.updatedAt;
        const bLastMessage = b.messages.length > 0 ? Math.max(...b.messages.map(m => m.timestamp)) : b.updatedAt;
        return bLastMessage - aLastMessage;
      });
  }, [currentUser, cases]);

  const selectedCase = useMemo(() => {
    return myCases.find(c => c.id === selectedCaseId) || myCases[0];
  }, [myCases, selectedCaseId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCase || !currentUser) return;

    sendMessage(selectedCase.id, currentUser.id, newMessage.trim());
    setNewMessage('');
    
    eventBus.emit('toast', {
      type: 'success',
      title: 'Mensaje enviado',
      message: 'Tu mensaje ha sido enviado al cliente.'
    });
  };

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(timestamp).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getLastMessage = (case_: any) => {
    if (case_.messages.length === 0) return 'Sin mensajes';
    const lastMessage = case_.messages[case_.messages.length - 1];
    return lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;
  };

  const getUnreadCount = (case_: any) => {
    return case_.messages.filter((m: any) => m.senderId !== currentUser?.id && !m.read).length;
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

  if (!currentUser) return null;

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Cases sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/3 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Conversaciones</h2>
          <p className="text-sm text-gray-600">
            {myCases.length} casos con comunicación
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {myCases.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay conversaciones aún</p>
              <button
                onClick={() => navigate('/abogado/casos')}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
              >
                Ver mis casos →
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {myCases.map((case_) => {
                const unreadCount = getUnreadCount(case_);
                const isSelected = selectedCase?.id === case_.id;
                
                return (
                  <motion.button
                    key={case_.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCaseId(case_.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">
                        {case_.title}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-600">
                        {SERVICE_LABELS[case_.type]}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {STATUS_LABELS[case_.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {getLastMessage(case_)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {case_.messages.length > 0 
                          ? formatDate(case_.messages[case_.messages.length - 1].timestamp)
                          : formatDate(case_.updatedAt)
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        #{case_.id}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col"
      >
        {!selectedCase ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-600">
                Elige un caso de la lista para ver los mensajes
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedCase.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{SERVICE_LABELS[selectedCase.type]}</span>
                    <span>•</span>
                    <span>Caso #{selectedCase.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                      {STATUS_LABELS[selectedCase.status]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/abogado/casos/${selectedCase.id}`)}
                  className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
                >
                  Ver caso completo →
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedCase.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No hay mensajes en esta conversación
                  </p>
                  <p className="text-sm text-gray-500">
                    Envía el primer mensaje para iniciar la conversación con el cliente
                  </p>
                </div>
              ) : (
                selectedCase.messages
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map((message, index) => (
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
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>

            {/* Message input */}
            <div className="p-6 border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LawyerMessages;


