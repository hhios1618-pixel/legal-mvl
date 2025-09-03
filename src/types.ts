export type ServiceType =
  | "societario" | "contratos" | "compliance" | "pi" | "laboral" | "litigios" | "ma" | "tributario";

export type CaseStatus = 
  | "nuevo" | "tomado" | "en_revision" | "en_curso" | "pendiente_cliente" | "resuelto" | "archivado" | "rechazado";

export type UserRole = "cliente" | "abogado" | "admin" | "super_admin";

export type Priority = "baja" | "media" | "alta" | "urgente";

export type SLAStatus = "verde" | "amarillo" | "rojo";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export interface LegalCase {
  id: string;
  createdAt: number;
  updatedAt: number;
  type: ServiceType;
  priority: Priority;
  title: string;
  description: string;
  status: CaseStatus;
  clientId: string;
  assignedLawyerId?: string | null;
  slaDeadline: number;
  slaStatus: SLAStatus;
  documents: Document[];
  messages: Message[];
  timeline: TimelineEvent[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
  uploadedBy: string;
  url?: string;
  required: boolean;
  status: "pendiente" | "recibido" | "aprobado" | "rechazado";
}

export interface Message {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: number;
  read: boolean;
  attachments?: Document[];
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: "creado" | "asignado" | "estado_cambiado" | "documento_solicitado" | "documento_recibido" | "mensaje_enviado" | "cerrado";
  description: string;
  timestamp: number;
  userId: string;
  userName: string;
  metadata?: any;
}

export interface Notification {
  id: string;
  userId: string;
  type: "nuevo_caso" | "caso_asignado" | "mensaje_recibido" | "documento_solicitado" | "sla_vencido" | "caso_cerrado" | "caso_actualizado";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  caseId?: string;
  priority: Priority;
}

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  specialties: ServiceType[];
  ratingAvg: number;
  ratingCount: number;
  casesActive: number;
  casesCompleted: number;
  avatar?: string;
  status: "disponible" | "ocupado" | "ausente";
  joinedAt: number;
}

export interface AdminMetrics {
  totalCases: number;
  casesByStatus: Record<CaseStatus, number>;
  casesByCategory: Record<ServiceType, number>;
  averageResolutionTime: number;
  slaCompliance: number;
  lawyerRanking: LawyerRanking[];
  recentActivity: AuditLog[];
}

export interface LawyerRanking {
  lawyerId: string;
  lawyerName: string;
  casesCompleted: number;
  averageRating: number;
  slaCompliance: number;
  averageResolutionTime: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  action: string;
  details: string;
  caseId?: string;
  ipAddress?: string;
}

export interface EventBusEvent {
  type: string;
  payload: any;
  timestamp: number;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  societario: "Derecho Societario",
  contratos: "Contratos Comerciales",
  compliance: "Compliance",
  pi: "Propiedad Intelectual",
  laboral: "Derecho Laboral",
  litigios: "Litigios",
  ma: "Fusiones y Adquisiciones",
  tributario: "Derecho Tributario"
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  nuevo: "Nuevo",
  tomado: "Tomado",
  en_revision: "En Revisión",
  en_curso: "En Curso",
  pendiente_cliente: "Pendiente Cliente",
  resuelto: "Resuelto",
  archivado: "Archivado",
  rechazado: "Rechazado"
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente"
};

