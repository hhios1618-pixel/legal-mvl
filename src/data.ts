import { ServiceType, LegalCase, Lawyer, User, Priority, SLAStatus } from "./types";

export const SERVICE_LABEL: Record<ServiceType, string> = {
  societario: "Derecho Societario",
  contratos: "Contratos Comerciales",
  compliance: "Compliance",
  pi: "Propiedad Intelectual",
  laboral: "Derecho Laboral",
  litigios: "Litigios",
  ma: "Fusiones y Adquisiciones",
  tributario: "Derecho Tributario"
};

export const SERVICE_SUB: Record<ServiceType, string> = {
  societario: "Constitución, modificaciones y transformaciones societarias.",
  contratos: "Redacción, revisión y negociación de contratos comerciales.",
  compliance: "Programas de cumplimiento normativo y prevención de riesgos.",
  pi: "Registro y protección de marcas, patentes y derechos de autor.",
  laboral: "Asesoría en relaciones laborales y resolución de conflictos.",
  litigios: "Representación judicial en disputas comerciales y civiles.",
  ma: "Asesoría integral en fusiones, adquisiciones y reestructuraciones.",
  tributario: "Planificación fiscal y resolución de controversias tributarias."
};

export const CHECKLIST: Record<ServiceType, string[]> = {
  societario: ["Escritura de constitución", "Estatutos sociales", "Poderes vigentes", "Estados financieros"],
  contratos: ["Minuta del contrato", "Antecedentes de las partes", "Condiciones comerciales", "Garantías requeridas"],
  compliance: ["Manual de procedimientos", "Políticas internas", "Matriz de riesgos", "Organigrama"],
  pi: ["Solicitud de registro", "Diseños o creaciones", "Búsquedas de anterioridad", "Poderes de representación"],
  laboral: ["Contratos de trabajo", "Reglamento interno", "Finiquitos", "Comunicaciones laborales"],
  litigios: ["Documentos del caso", "Pruebas disponibles", "Antecedentes procesales", "Poderes judiciales"],
  ma: ["Estados financieros", "Due diligence", "Valoraciones", "Estructura societaria"],
  tributario: ["Declaraciones tributarias", "Fiscalizaciones", "Resoluciones SII", "Estados financieros"]
};

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const oneHour = 60 * 60 * 1000;

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
  return now + (days * oneDay);
};

const getSLAStatus = (deadline: number): SLAStatus => {
  const timeLeft = deadline - now;
  const totalTime = 15 * oneDay; // 15 días por defecto
  
  if (timeLeft < 0) return "rojo";
  if (timeLeft < totalTime * 0.2) return "amarillo";
  return "verde";
};

export const SEED_USERS: User[] = [
  // Clientes
  { id: "u1", name: "Empresa ABC S.A.", email: "contacto@empresaabc.cl", role: "cliente", company: "Empresa ABC S.A.", avatar: "https://ui-avatars.com/api/?name=Empresa+ABC&background=0f172a&color=fff" },
  { id: "u2", name: "Corporación XYZ Ltda.", email: "legal@corpxyz.cl", role: "cliente", company: "Corporación XYZ Ltda.", avatar: "https://ui-avatars.com/api/?name=Corp+XYZ&background=0f172a&color=fff" },
  { id: "u3", name: "Inversiones DEF SpA", email: "gerencia@invdef.cl", role: "cliente", company: "Inversiones DEF SpA", avatar: "https://ui-avatars.com/api/?name=Inv+DEF&background=0f172a&color=fff" },
  { id: "u4", name: "Tecnología GHI S.A.", email: "admin@techghi.cl", role: "cliente", company: "Tecnología GHI S.A.", avatar: "https://ui-avatars.com/api/?name=Tech+GHI&background=0f172a&color=fff" },
  { id: "u5", name: "Comercial JKL Ltda.", email: "info@comercialjkl.cl", role: "cliente", company: "Comercial JKL Ltda.", avatar: "https://ui-avatars.com/api/?name=Com+JKL&background=0f172a&color=fff" },
  
  // Abogados
  { id: "l1", name: "María Fernanda Pérez", email: "mperez@legalcorp.cl", role: "abogado", avatar: "https://ui-avatars.com/api/?name=Maria+Perez&background=1e40af&color=fff" },
  { id: "l2", name: "Carlos Eduardo Soto", email: "csoto@legalcorp.cl", role: "abogado", avatar: "https://ui-avatars.com/api/?name=Carlos+Soto&background=1e40af&color=fff" },
  { id: "l3", name: "Ana Sofía González", email: "agonzalez@legalcorp.cl", role: "abogado", avatar: "https://ui-avatars.com/api/?name=Ana+Gonzalez&background=1e40af&color=fff" },
  { id: "l4", name: "Roberto Andrés Silva", email: "rsilva@legalcorp.cl", role: "abogado", avatar: "https://ui-avatars.com/api/?name=Roberto+Silva&background=1e40af&color=fff" },
  { id: "l5", name: "Patricia Isabel Morales", email: "pmorales@legalcorp.cl", role: "abogado", avatar: "https://ui-avatars.com/api/?name=Patricia+Morales&background=1e40af&color=fff" },
  
  // Administradores
  { id: "a1", name: "Administrador Principal", email: "admin@legalcorp.cl", role: "admin", avatar: "https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff" },
  { id: "sa1", name: "Super Administrador", email: "superadmin@legalcorp.cl", role: "super_admin", avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=8b5cf6&color=fff" }
];

export const SEED_CASES: LegalCase[] = [
  {
    id: "c1",
    createdAt: now - (2 * oneDay),
    updatedAt: now - (1 * oneDay),
    type: "societario",
    priority: "alta",
    title: "Constitución de Filial en Perú",
    description: "Necesitamos constituir una filial de nuestra empresa en Perú para expandir operaciones. Requerimos asesoría completa en el proceso.",
    status: "en_curso",
    clientId: "u1",
    assignedLawyerId: "l1",
    slaDeadline: calculateSLADeadline("societario", "alta"),
    slaStatus: getSLAStatus(calculateSLADeadline("societario", "alta")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 25,
    actualHours: 15
  },
  {
    id: "c2",
    createdAt: now - (5 * oneHour),
    updatedAt: now - (2 * oneHour),
    type: "contratos",
    priority: "urgente",
    title: "Revisión Contrato de Distribución",
    description: "Contrato de distribución exclusiva con proveedor internacional. Necesita revisión urgente antes de firma mañana.",
    status: "en_revision",
    clientId: "u2",
    assignedLawyerId: "l2",
    slaDeadline: calculateSLADeadline("contratos", "urgente"),
    slaStatus: getSLAStatus(calculateSLADeadline("contratos", "urgente")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: "c3",
    createdAt: now - (3 * oneDay),
    updatedAt: now - (3 * oneDay),
    type: "compliance",
    priority: "media",
    title: "Implementación Programa de Compliance",
    description: "Desarrollo e implementación de programa de compliance para cumplir con nuevas regulaciones del sector financiero.",
    status: "nuevo",
    clientId: "u3",
    slaDeadline: calculateSLADeadline("compliance", "media"),
    slaStatus: getSLAStatus(calculateSLADeadline("compliance", "media")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 40
  },
  {
    id: "c4",
    createdAt: now - (1 * oneDay),
    updatedAt: now - (4 * oneHour),
    type: "pi",
    priority: "alta",
    title: "Registro de Marca Tecnológica",
    description: "Registro de marca para nueva plataforma tecnológica en Chile y países del Pacífico Alianza.",
    status: "pendiente_cliente",
    clientId: "u4",
    assignedLawyerId: "l3",
    slaDeadline: calculateSLADeadline("pi", "alta"),
    slaStatus: getSLAStatus(calculateSLADeadline("pi", "alta")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 20,
    actualHours: 12
  },
  {
    id: "c5",
    createdAt: now - (6 * oneHour),
    updatedAt: now - (1 * oneHour),
    type: "laboral",
    priority: "urgente",
    title: "Despido Ejecutivo Principal",
    description: "Asesoría para despido de ejecutivo principal por reestructuración. Requiere manejo confidencial y cuidadoso.",
    status: "tomado",
    clientId: "u5",
    assignedLawyerId: "l4",
    slaDeadline: calculateSLADeadline("laboral", "urgente"),
    slaStatus: getSLAStatus(calculateSLADeadline("laboral", "urgente")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 15,
    actualHours: 8
  },
  {
    id: "c6",
    createdAt: now - (7 * oneDay),
    updatedAt: now - (1 * oneDay),
    type: "litigios",
    priority: "alta",
    title: "Demanda por Incumplimiento Contractual",
    description: "Cliente demandado por incumplimiento de contrato de suministro. Monto en disputa: $500 millones.",
    status: "resuelto",
    clientId: "u1",
    assignedLawyerId: "l5",
    slaDeadline: calculateSLADeadline("litigios", "alta"),
    slaStatus: "verde",
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 60,
    actualHours: 58
  },
  {
    id: "c7",
    createdAt: now - (10 * oneDay),
    updatedAt: now - (8 * oneDay),
    type: "ma",
    priority: "alta",
    title: "Adquisición Empresa Competidora",
    description: "Due diligence y estructuración para adquisición del 80% de empresa competidora en el sector retail.",
    status: "archivado",
    clientId: "u2",
    assignedLawyerId: "l1",
    slaDeadline: calculateSLADeadline("ma", "alta"),
    slaStatus: "verde",
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 120,
    actualHours: 115
  },
  {
    id: "c8",
    createdAt: now - (4 * oneHour),
    updatedAt: now - (4 * oneHour),
    type: "tributario",
    priority: "media",
    title: "Planificación Fiscal 2024",
    description: "Revisión y optimización de estructura tributaria para el año fiscal 2024. Incluye análisis de beneficios disponibles.",
    status: "nuevo",
    clientId: "u3",
    slaDeadline: calculateSLADeadline("tributario", "media"),
    slaStatus: getSLAStatus(calculateSLADeadline("tributario", "media")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 30
  },
  {
    id: "c9",
    createdAt: now - (2 * oneHour),
    updatedAt: now - (2 * oneHour),
    type: "contratos",
    priority: "baja",
    title: "Actualización Términos y Condiciones",
    description: "Actualización de términos y condiciones de plataforma e-commerce para cumplir con nueva Ley de Protección de Datos.",
    status: "nuevo",
    clientId: "u4",
    slaDeadline: calculateSLADeadline("contratos", "baja"),
    slaStatus: getSLAStatus(calculateSLADeadline("contratos", "baja")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 12
  },
  {
    id: "c10",
    createdAt: now - (8 * oneHour),
    updatedAt: now - (3 * oneHour),
    type: "societario",
    priority: "media",
    title: "Modificación de Estatutos",
    description: "Modificación de estatutos sociales para incluir nuevos objetos sociales relacionados con tecnología blockchain.",
    status: "en_curso",
    clientId: "u5",
    assignedLawyerId: "l2",
    slaDeadline: calculateSLADeadline("societario", "media"),
    slaStatus: getSLAStatus(calculateSLADeadline("societario", "media")),
    documents: [],
    messages: [],
    timeline: [],
    estimatedHours: 18,
    actualHours: 10
  }
];

export const SEED_LAWYERS: Lawyer[] = [
  {
    id: "l1",
    name: "María Fernanda Pérez",
    email: "mperez@legalcorp.cl",
    specialties: ["societario", "ma", "contratos"],
    ratingAvg: 4.9,
    ratingCount: 156,
    casesActive: 8,
    casesCompleted: 89,
    avatar: "https://ui-avatars.com/api/?name=Maria+Perez&background=1e40af&color=fff",
    status: "disponible",
    joinedAt: Date.now() - (365 * 24 * 60 * 60 * 1000) // Hace 1 año
  },
  {
    id: "l2",
    name: "Carlos Eduardo Soto",
    email: "csoto@legalcorp.cl",
    specialties: ["contratos", "compliance", "tributario"],
    ratingAvg: 4.7,
    ratingCount: 98,
    casesActive: 12,
    casesCompleted: 67,
    avatar: "https://ui-avatars.com/api/?name=Carlos+Soto&background=dc2626&color=fff",
    status: "ocupado",
    joinedAt: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000) // Hace 2 años
  },
  {
    id: "l3",
    name: "Ana Sofía Morales",
    email: "amorales@legalcorp.cl",
    specialties: ["laboral", "litigios"],
    ratingAvg: 4.8,
    ratingCount: 134,
    casesActive: 6,
    casesCompleted: 78,
    avatar: "https://ui-avatars.com/api/?name=Ana+Morales&background=059669&color=fff",
    status: "disponible",
    joinedAt: Date.now() - (18 * 30 * 24 * 60 * 60 * 1000) // Hace 18 meses
  },
  {
    id: "l4",
    name: "Roberto Andrés Silva",
    email: "rsilva@legalcorp.cl",
    specialties: ["pi", "compliance"],
    ratingAvg: 4.6,
    ratingCount: 87,
    casesActive: 9,
    casesCompleted: 54,
    avatar: "https://ui-avatars.com/api/?name=Roberto+Silva&background=7c3aed&color=fff",
    status: "disponible",
    joinedAt: Date.now() - (8 * 30 * 24 * 60 * 60 * 1000) // Hace 8 meses
  },
  {
    id: "l5",
    name: "Patricia Isabel Rojas",
    email: "projas@legalcorp.cl",
    specialties: ["tributario", "societario"],
    ratingAvg: 4.5,
    ratingCount: 76,
    casesActive: 7,
    casesCompleted: 45,
    avatar: "https://ui-avatars.com/api/?name=Patricia+Rojas&background=ea580c&color=fff",
    status: "ocupado",
    joinedAt: Date.now() - (6 * 30 * 24 * 60 * 60 * 1000) // Hace 6 meses
  }
];



export const SEED_NOTIFICATIONS = [
  {
    id: "n1",
    userId: "l1",
    type: "nuevo_caso" as const,
    title: "Nuevo caso disponible",
    message: "Nuevo caso de societario: Constitución de sociedad anónima para empresa tecnológica",
    timestamp: now - (1 * oneHour),
    read: false,
    caseId: "c11",
    priority: "alta" as const
  },
  {
    id: "n2",
    userId: "u1",
    type: "caso_asignado" as const,
    title: "Abogado asignado",
    message: "María Fernanda Pérez ha sido asignado a su caso: Constitución de Filial en Perú",
    timestamp: now - (2 * oneHour),
    read: false,
    caseId: "c1",
    priority: "alta" as const
  },
  {
    id: "n3",
    userId: "l2",
    type: "mensaje_recibido" as const,
    title: "Nuevo mensaje",
    message: "Empresa ABC S.A. envió un mensaje en el caso: Revisión Contrato de Distribución",
    timestamp: now - (3 * oneHour),
    read: true,
    caseId: "c2",
    priority: "urgente" as const
  }
];

export const SEED_AUDIT_LOGS = [
  {
    id: "al1",
    timestamp: now - (1 * oneDay),
    userId: "a1",
    userName: "Administrador Principal",
    action: "login",
    details: "Usuario Administrador Principal inició sesión",
    ipAddress: "192.168.1.1"
  },
  {
    id: "al2",
    timestamp: now - (1 * oneDay) + (1 * oneHour),
    userId: "u1",
    userName: "Empresa ABC S.A.",
    action: "create_case",
    details: "Caso creado: Constitución de Filial en Perú",
    caseId: "c1",
    ipAddress: "192.168.1.100"
  },
  {
    id: "al3",
    timestamp: now - (1 * oneDay) + (2 * oneHour),
    userId: "l1",
    userName: "María Fernanda Pérez",
    action: "assign_case",
    details: "Caso c1 asignado a María Fernanda Pérez",
    caseId: "c1",
    ipAddress: "192.168.1.101"
  }
];


