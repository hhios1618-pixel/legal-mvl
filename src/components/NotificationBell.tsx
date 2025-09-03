import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, eventBus } from '../store';
import { Notification } from '../types';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const { currentUser, getUnreadNotifications, markNotificationAsRead, notifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (currentUser) {
      setUnreadNotifications(getUnreadNotifications(currentUser.id));
    }
  }, [currentUser, notifications, getUnreadNotifications]);

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      if (currentUser && notification.userId === currentUser.id) {
        setUnreadNotifications(getUnreadNotifications(currentUser.id));
      }
    };

    eventBus.on('notification_added', handleNewNotification);
    return () => eventBus.off('notification_added', handleNewNotification);
  }, [currentUser, getUnreadNotifications]);

  if (!currentUser) return null;

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    setUnreadNotifications(getUnreadNotifications(currentUser.id));
    // Aquí podrías navegar al caso relacionado si existe
    if (notification.caseId) {
      // navigate(`/${currentUser.role}/casos/${notification.caseId}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'text-red-600 bg-red-50';
      case 'alta': return 'text-orange-600 bg-orange-50';
      case 'media': return 'text-amber-600 bg-amber-50';
      case 'baja': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTimeAgo = (timestamp: number) => {
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

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        
        {/* Badge */}
        {unreadNotifications.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
          </motion.div>
        )}
      </button>

      {/* Notifications dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                  <span className="text-sm text-gray-600">
                    {unreadNotifications.length} sin leer
                  </span>
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-80 overflow-y-auto">
                {unreadNotifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No hay notificaciones nuevas</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {unreadNotifications.slice(0, 10).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="w-2 h-2 rounded-full mt-2 bg-blue-600" />
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {unreadNotifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      unreadNotifications.forEach(n => markNotificationAsRead(n.id));
                      setUnreadNotifications([]);
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

