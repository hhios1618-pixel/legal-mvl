// src/types.ts

export type ServiceType =
  | "dicom" | "embargo" | "divorcio" | "alimentos" | "vif"
  | "arriendo" | "laboral" | "herencias" | "penal" | "consumo"
  | "liquidacion" | "renegociacion" | "abandono" | "nulidad" | "familia" 
  | "recursos" | "especiales" | "ordinario" | "jpl";

export type CaseStatus = "new" | "claimed" | "in_progress" | "waiting_client" | "closed";

export interface Activity {
  name: string;
  description: string;
  duration: number;
}

export interface Phase {
  name: string;
  percentage: number;
  activities: Activity[];
}

export interface Workflow {
  totalDuration?: number;
  totalDurationUnit?: string;
  phases: Phase[];
}

export interface Message {
  author: 'lawyer' | 'client';
  text: string;
  date: number; // Timestamp
}

export type CaseNotes = {
  [phaseName: string]: {
    private?: {
      text: string;
      date: number; // Timestamp
    };
    public?: Message[]; // Un array de mensajes para el chat
  };
};

export interface LegalCase {
  id: string;
  createdAt: number;
  type: ServiceType;
  priority: 1 | 2;
  name: string;
  email: string;
  city?: string;
  description?: string;
  status: CaseStatus;
  assignedLawyerId?: string | null;
  notes?: CaseNotes;
  currentPhaseName?: string;
  completedActivities?: { [activityName: string]: number }; // Timestamp de completado
}

export interface Lawyer {
  id: string;
  name: string;
  specialties: ServiceType[];
  ratingAvg: number;
  ratingCount: number;
}