export type ServiceType =
  | "dicom" | "embargo" | "divorcio" | "alimentos" | "vif"
  | "arriendo" | "laboral" | "herencias" | "penal" | "consumo";

export type CaseStatus = "new" | "claimed" | "in_progress" | "waiting_client" | "closed";

export interface LegalCase {
  id: string;
  createdAt: number;           // Date.now()
  type: ServiceType;
  priority: 1 | 2;             // 2 = urgente
  name: string;
  email: string;
  city?: string;
  description?: string;
  status: CaseStatus;
  assignedLawyerId?: string | null;
}

export interface Lawyer {
  id: string;
  name: string;
  specialties: ServiceType[];
  ratingAvg: number;
  ratingCount: number;
}