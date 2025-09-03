import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  LegalCase, 
  Lawyer, 
  User, 
  CaseStatus, 
  ServiceType, 
  UserRole, 
  Priority,
  SLAStatus,
  Message,
  TimelineEvent,
  Notification,
  Document,
  AdminMetrics,
  AuditLog,
  EventBusEvent
} from "./types";
import { SEED_CASES, SEED_LAWYERS, SEED_USERS, SEED_NOTIFICATIONS, SEED_AUDIT_LOGS } from "./data";

// EventBus para notificaciones en tiempo real
class EventBus {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();

type AppState = {
  // Estado de autenticación
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Datos principales
  cases: LegalCase[];
  lawyers: Lawyer[];
  users: User[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  
  // Acciones de autenticación
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  
  // Acciones de casos
  createCase: (payload: {
    type: ServiceType;
    title: string;
    description: string;
    priority: Priority;
    clientId: string;
  }) => LegalCase;
  
  updateCaseStatus: (caseId: string, status: CaseStatus, userId: string) => void;
  assignCase: (caseId: string, lawyerId: string, assignedBy: string) => void;
  claimCase: (caseId: string, lawyerId: string) => boolean;
  
  // Acciones de mensajes
  sendMessage: (caseId: string, senderId: string, content: string) => void;
  markMessagesAsRead: (caseId: string, userId: string) => void;
  
  // Acciones de documentos
  requestDocument: (caseId: string, documentName: string, requestedBy: string) => void;
  uploadDocument: (caseId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  
  // Acciones de notificaciones
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: (userId: string) => Notification[];
  
  // Acciones de timeline
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  
  // Acciones de auditoría
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Utilidades
  calculateSLAStatus: (caseId: string) => SLAStatus;
  getAdminMetrics: () => AdminMetrics;
  getCasesByUser: (userId: string, role: UserRole) => LegalCase[];
  
  // Reset
  reset: () => void;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateSLADeadline = (type: ServiceType, priority: Priority): number => {
  const baseDays = {
    societario: 15,
    contratos: 10,
    compliance: 7,
    pi: 20,
    laboral: 5,
    litigios: 30,
    ma: 45,
    tributario: 10
  };
  
  const priorityMultiplier = {
    baja: 1.5,
    media: 1,
    alta: 0.7,
    urgente: 0.3
  };
  
  const days = baseDays[type] * priorityMultiplier[priority];
  return Date.now() + (days * 24 * 60 * 60 * 1000);
};

const getSLAStatus = (deadline: number): SLAStatus => {
  const now = Date.now();
  const timeLeft = deadline - now;
  const totalTime = 15 * 24 * 60 * 60 * 1000; // 15 días por defecto
  
  if (timeLeft < 0) return "rojo";
  if (timeLeft < totalTime * 0.2) return "amarillo";
  return "verde";
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentUser: null,
      isAuthenticated: false,
      cases: SEED_CASES,
      lawyers: SEED_LAWYERS,
      users: SEED_USERS,
      notifications: SEED_NOTIFICATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      
      // Autenticación
      login: (email: string, password: string) => {
        // Simulación de login - en producción sería contra un backend
        const user = get().users.find(u => u.email === email);
        if (user && password === "demo123") {
          set({ currentUser: user, isAuthenticated: true });
          get().addAuditLog({
            userId: user.id,
            userName: user.name,
            action: "login",
            details: `Usuario ${user.name} inició sesión`
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        const currentUser = get().currentUser;
        if (currentUser) {
          get().addAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            action: "logout",
            details: `Usuario ${currentUser.name} cerró sesión`
          });
        }
        set({ currentUser: null, isAuthenticated: false });
      },
      
      setCurrentUser: (user: User) => {
        set({ currentUser: user, isAuthenticated: true });
      },
      
      // Gestión de casos
      createCase: (payload) => {
        const newCase: LegalCase = {
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          type: payload.type,
          priority: payload.priority,
          title: payload.title,
          description: payload.description,
          status: "nuevo",
          clientId: payload.clientId,
          slaDeadline: calculateSLADeadline(payload.type, payload.priority),
          slaStatus: "verde",
          documents: [],
          messages: [],
          timeline: [],
          estimatedHours: Math.floor(Math.random() * 40) + 10
        };
        
        newCase.slaStatus = getSLAStatus(newCase.slaDeadline);
        
        set({ cases: [newCase, ...get().cases] });
        
        // Agregar evento al timeline
        get().addTimelineEvent({
          caseId: newCase.id,
          type: "creado",
          description: `Caso creado: ${newCase.title}`,
          userId: payload.clientId,
          userName: get().users.find(u => u.id === payload.clientId)?.name || "Cliente"
        });
        
        // Notificar a abogados especializados
        const specializedLawyers = get().lawyers.filter(l => l.specialties.includes(payload.type));
        specializedLawyers.forEach(lawyer => {
          get().addNotification({
            userId: lawyer.id,
            type: "nuevo_caso",
            title: "Nuevo caso disponible",
            message: `Nuevo caso de ${payload.type}: ${payload.title}`,
            caseId: newCase.id,
            priority: payload.priority,
            read: false
          });
        });
        
        // Emitir evento
        eventBus.emit('case_created', newCase);
        
        return newCase;
      },
      
      updateCaseStatus: (caseId: string, status: CaseStatus, userId: string) => {
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            const updatedCase = { ...c, status, updatedAt: Date.now() };
            
            // Agregar evento al timeline
            get().addTimelineEvent({
              caseId,
              type: "estado_cambiado",
              description: `Estado cambiado a: ${status}`,
              userId,
              userName: get().users.find(u => u.id === userId)?.name || "Usuario"
            });
            
            // Notificar al cliente si el cambio lo hizo un abogado
            const user = get().users.find(u => u.id === userId);
            if (user?.role === "abogado") {
              get().addNotification({
                userId: c.clientId,
                type: "caso_asignado",
                title: "Actualización de caso",
                message: `Su caso "${c.title}" cambió a estado: ${status}`,
                caseId,
                priority: c.priority,
                read: false
              });
            }
            
            eventBus.emit('case_status_updated', updatedCase);
            return updatedCase;
          }
          return c;
        });
        
        set({ cases });
      },
      
      assignCase: (caseId: string, lawyerId: string, assignedBy: string) => {
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            const updatedCase = { ...c, assignedLawyerId: lawyerId, status: "tomado" as CaseStatus, updatedAt: Date.now() };
            
            const lawyer = get().lawyers.find(l => l.id === lawyerId);
            
            get().addTimelineEvent({
              caseId,
              type: "asignado",
              description: `Caso asignado a ${lawyer?.name || "Abogado"}`,
              userId: assignedBy,
              userName: get().users.find(u => u.id === assignedBy)?.name || "Admin"
            });
            
            // Notificar al abogado
            get().addNotification({
              userId: lawyerId,
              type: "caso_asignado",
              title: "Caso asignado",
              message: `Se le ha asignado el caso: ${c.title}`,
              caseId,
              priority: c.priority,
              read: false
            });
            
            // Notificar al cliente
            get().addNotification({
              userId: c.clientId,
              type: "caso_asignado",
              title: "Abogado asignado",
              message: `${lawyer?.name || "Un abogado"} ha sido asignado a su caso: ${c.title}`,
              caseId,
              priority: c.priority,
              read: false
            });
            
            eventBus.emit('case_assigned', updatedCase);
            return updatedCase;
          }
          return c;
        });
        
        set({ cases });
      },
      
      claimCase: (caseId: string, lawyerId: string) => {
        const caseToUpdate = get().cases.find(c => c.id === caseId);
        if (!caseToUpdate || caseToUpdate.status !== "nuevo" || caseToUpdate.assignedLawyerId) {
          return false;
        }
        
        get().assignCase(caseId, lawyerId, lawyerId);
        return true;
      },
      
      // Mensajería
      sendMessage: (caseId: string, senderId: string, content: string) => {
        const sender = get().users.find(u => u.id === senderId);
        if (!sender) return;
        
        const message: Message = {
          id: generateId(),
          caseId,
          senderId,
          senderName: sender.name,
          senderRole: sender.role,
          content,
          timestamp: Date.now(),
          read: false
        };
        
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            return { ...c, messages: [...c.messages, message], updatedAt: Date.now() };
          }
          return c;
        });
        
        set({ cases });
        
        // Agregar al timeline
        get().addTimelineEvent({
          caseId,
          type: "mensaje_enviado",
          description: `Mensaje enviado por ${sender.name}`,
          userId: senderId,
          userName: sender.name
        });
        
        // Notificar a otros participantes del caso
        const caseData = get().cases.find(c => c.id === caseId);
        if (caseData) {
          const recipients = [caseData.clientId, caseData.assignedLawyerId].filter(id => id && id !== senderId);
          recipients.forEach(recipientId => {
            if (recipientId) {
              get().addNotification({
                userId: recipientId,
                type: "mensaje_recibido",
                title: "Nuevo mensaje",
                message: `${sender.name} envió un mensaje en el caso: ${caseData.title}`,
                caseId,
                priority: caseData.priority,
                read: false
              });
            }
          });
        }
        
        eventBus.emit('message_sent', message);
      },
      
      markMessagesAsRead: (caseId: string, userId: string) => {
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            const updatedMessages = c.messages.map(m => {
              if (m.senderId !== userId) {
                return { ...m, read: true };
              }
              return m;
            });
            return { ...c, messages: updatedMessages };
          }
          return c;
        });
        
        set({ cases });
      },
      
      // Documentos
      requestDocument: (caseId: string, documentName: string, requestedBy: string) => {
        const document: Document = {
          id: generateId(),
          name: documentName,
          type: "pdf",
          size: 0,
          uploadedAt: Date.now(),
          uploadedBy: requestedBy,
          required: true,
          status: "pendiente"
        };
        
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            return { ...c, documents: [...c.documents, document], updatedAt: Date.now() };
          }
          return c;
        });
        
        set({ cases });
        
        const requester = get().users.find(u => u.id === requestedBy);
        
        get().addTimelineEvent({
          caseId,
          type: "documento_solicitado",
          description: `Documento solicitado: ${documentName}`,
          userId: requestedBy,
          userName: requester?.name || "Usuario"
        });
        
        // Notificar al cliente
        const caseData = get().cases.find(c => c.id === caseId);
        if (caseData) {
          get().addNotification({
            userId: caseData.clientId,
            type: "documento_solicitado",
            title: "Documento solicitado",
            message: `Se requiere el documento: ${documentName}`,
            caseId,
            priority: caseData.priority,
            read: false
          });
        }
        
        eventBus.emit('document_requested', { caseId, document });
      },
      
      uploadDocument: (caseId: string, documentData: Omit<Document, 'id' | 'uploadedAt'>) => {
        const document: Document = {
          ...documentData,
          id: generateId(),
          uploadedAt: Date.now()
        };
        
        const cases = get().cases.map(c => {
          if (c.id === caseId) {
            return { ...c, documents: [...c.documents, document], updatedAt: Date.now() };
          }
          return c;
        });
        
        set({ cases });
        
        const uploader = get().users.find(u => u.id === document.uploadedBy);
        
        get().addTimelineEvent({
          caseId,
          type: "documento_recibido",
          description: `Documento recibido: ${document.name}`,
          userId: document.uploadedBy,
          userName: uploader?.name || "Usuario"
        });
        
        eventBus.emit('document_uploaded', { caseId, document });
      },
      
      // Notificaciones
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: generateId(),
          timestamp: Date.now()
        };
        
        set({ notifications: [notification, ...get().notifications] });
        eventBus.emit('notification_added', notification);
      },
      
      markNotificationAsRead: (notificationId: string) => {
        const notifications = get().notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        set({ notifications });
      },
      
      getUnreadNotifications: (userId: string) => {
        return get().notifications.filter(n => n.userId === userId && !n.read);
      },
      
      // Timeline
      addTimelineEvent: (eventData) => {
        const event: TimelineEvent = {
          ...eventData,
          id: generateId(),
          timestamp: Date.now()
        };
        
        const cases = get().cases.map(c => {
          if (c.id === event.caseId) {
            return { ...c, timeline: [...c.timeline, event] };
          }
          return c;
        });
        
        set({ cases });
      },
      
      // Auditoría
      addAuditLog: (logData) => {
        const log: AuditLog = {
          ...logData,
          id: generateId(),
          timestamp: Date.now(),
          ipAddress: "127.0.0.1" // Simulado
        };
        
        set({ auditLogs: [log, ...get().auditLogs] });
      },
      
      // Utilidades
      calculateSLAStatus: (caseId: string) => {
        const caseData = get().cases.find(c => c.id === caseId);
        if (!caseData) return "verde";
        return getSLAStatus(caseData.slaDeadline);
      },
      
      getAdminMetrics: (): AdminMetrics => {
        const cases = get().cases;
        const lawyers = get().lawyers;
        const auditLogs = get().auditLogs;
        
        const casesByStatus = cases.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {} as Record<CaseStatus, number>);
        
        const casesByCategory = cases.reduce((acc, c) => {
          acc[c.type] = (acc[c.type] || 0) + 1;
          return acc;
        }, {} as Record<ServiceType, number>);
        
        const completedCases = cases.filter(c => c.status === "resuelto");
        const averageResolutionTime = completedCases.length > 0 
          ? completedCases.reduce((acc, c) => acc + (c.updatedAt - c.createdAt), 0) / completedCases.length
          : 0;
        
        const slaCompliantCases = cases.filter(c => c.slaStatus !== "rojo").length;
        const slaCompliance = cases.length > 0 ? (slaCompliantCases / cases.length) * 100 : 100;
        
        const lawyerRanking = lawyers.map(lawyer => {
          const lawyerCases = cases.filter(c => c.assignedLawyerId === lawyer.id);
          const completedLawyerCases = lawyerCases.filter(c => c.status === "resuelto");
          const lawyerSlaCompliant = lawyerCases.filter(c => c.slaStatus !== "rojo").length;
          
          return {
            lawyerId: lawyer.id,
            lawyerName: lawyer.name,
            casesCompleted: completedLawyerCases.length,
            averageRating: lawyer.ratingAvg,
            slaCompliance: lawyerCases.length > 0 ? (lawyerSlaCompliant / lawyerCases.length) * 100 : 100,
            averageResolutionTime: completedLawyerCases.length > 0 
              ? completedLawyerCases.reduce((acc, c) => acc + (c.updatedAt - c.createdAt), 0) / completedLawyerCases.length
              : 0
          };
        }).sort((a, b) => b.casesCompleted - a.casesCompleted);
        
        return {
          totalCases: cases.length,
          casesByStatus,
          casesByCategory,
          averageResolutionTime,
          slaCompliance,
          lawyerRanking,
          recentActivity: auditLogs.slice(0, 10)
        };
      },
      
      getCasesByUser: (userId: string, role: UserRole) => {
        const cases = get().cases;
        
        switch (role) {
          case "cliente":
            return cases.filter(c => c.clientId === userId);
          case "abogado":
            return cases.filter(c => c.assignedLawyerId === userId);
          case "admin":
            return cases;
          default:
            return [];
        }
      },
      
      // Reset
      reset: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          cases: SEED_CASES,
          lawyers: SEED_LAWYERS,
          users: SEED_USERS,
          notifications: [],
          auditLogs: []
        });
      }
    }),
    {
      name: "legal-platform-storage",
      partialize: (state) => ({
        cases: state.cases,
        notifications: state.notifications,
        auditLogs: state.auditLogs,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

