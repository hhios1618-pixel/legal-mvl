import { ServiceType, LegalCase, Lawyer } from "./types";

export const SERVICE_LABEL: Record<ServiceType, string> = {
  dicom: "DICOM / Deudas",
  embargo: "Embargos / Retiro de bienes",
  divorcio: "Divorcio",
  alimentos: "Pensión de Alimentos",
  vif: "Violencia Intrafamiliar",
  arriendo: "Arriendos / Desalojo",
  laboral: "Despidos / Laboral",
  herencias: "Herencias / Posesión Efectiva",
  penal: "Defensa Penal",
  consumo: "Consumo / SERNAC",
};

export const SERVICE_SUB: Record<ServiceType, string> = {
  dicom: "Regularice su situación sin sorpresas.",
  embargo: "Actúe antes de la diligencia.",
  divorcio: "Requisitos, plazos y costos claros.",
  alimentos: "Demanda o defensa con respaldo.",
  vif: "Protección y medidas cautelares.",
  arriendo: "Recupere su propiedad legalmente.",
  laboral: "Indemnizaciones y reclamaciones.",
  herencias: "Trámite completo y ordenado.",
  penal: "Defensa inmediata y clara.",
  consumo: "Reclamos efectivos.",
};

export const CHECKLIST: Record<ServiceType, string[]> = {
  dicom: ["Certificado DICOM", "Ingresos mensuales", "Deudas vigentes", "Contacto telefónico"],
  embargo: ["Foto del documento", "Identificación", "Dirección exacta", "Teléfono de contacto"],
  divorcio: ["Acta de matrimonio", "Acuerdo o causal", "Bienes/deudas", "Hijos en común"],
  alimentos: ["Ingresos del alimentante", "Gastos del menor", "Boletas/facturas", "Dirección del demandado"],
  vif: ["Parte policial (si existe)", "Fotos/evidencias", "Direcciones", "Testigos (si los hay)"],
  arriendo: ["Contrato y pagos", "Mora (meses)", "Fotos del inmueble", "Datos arrendatario"],
  laboral: ["Contrato/finiquito", "Liquidaciones", "Causal invocada", "Correos o comunicaciones"],
  herencias: ["Defunción", "Parentesco", "Bienes conocidos", "Herederos"],
  penal: ["Parte policial", "Datos del detenido", "Lugar de detención", "Testigos"],
  consumo: ["Boleta/factura", "Garantía", "Comunicación con proveedor", "Evidencias"],
};

const now = Date.now();
export const SEED_CASES: LegalCase[] = [
  { id: "c1", createdAt: now-1000*60*18, type: "embargo", priority: 2, name: "Juan C.", email: "juan@mail.com", city: "Santiago", description: "Me avisaron diligencia hoy.", status: "new" },
  { id: "c2", createdAt: now-1000*60*45, type: "alimentos", priority: 1, name: "María A.", email: "maria@mail.com", city: "Valparaíso", description: "Demanda de alimentos.", status: "new" },
  { id: "c3", createdAt: now-1000*60*5, type: "dicom", priority: 1, name: "Pedro L.", email: "pedro@mail.com", city: "La Serena", description: "Regularizar deudas.", status: "new" },
  { id: "c4", createdAt: now-1000*60*120, type: "laboral", priority: 1, name: "Fernanda R.", email: "fer@mail.com", city: "Concepción", description: "Despido injustificado.", status: "new" },
  { id: "c5", createdAt: now-1000*60*12, type: "arriendo", priority: 1, name: "Carlos T.", email: "carlos@mail.com", city: "Ñuñoa", description: "Desalojo moroso.", status: "new" },
  { id: "c6", createdAt: now-1000*60*50, type: "penal", priority: 2, name: "Karla Z.", email: "karla@mail.com", city: "Rancagua", description: "Detención por lesiones leves.", status: "new" },
  { id: "c7", createdAt: now-1000*60*70, type: "divorcio", priority: 1, name: "Sofía G.", email: "sofia@mail.com", city: "Providencia", description: "Divorcio de mutuo acuerdo.", status: "new" },
  { id: "c8", createdAt: now-1000*60*15, type: "herencias", priority: 1, name: "Andrés F.", email: "andres@mail.com", city: "Temuco", description: "Posesión efectiva.", status: "new" },
  { id: "c9", createdAt: now-1000*60*7, type: "vif", priority: 2, name: "Rocío S.", email: "rocio@mail.com", city: "Puente Alto", description: "Medidas cautelares.", status: "new" },
  { id: "c10", createdAt: now-1000*60*25, type: "consumo", priority: 1, name: "Iván P.", email: "ivan@mail.com", city: "Maipú", description: "Producto defectuoso.", status: "new" },
  { id: "c11", createdAt: now-1000*60*9, type: "alimentos", priority: 1, name: "Natalia X.", email: "nat@mail.com", city: "Antofagasta", description: "Ajuste de pensión.", status: "new" },
  { id: "c12", createdAt: now-1000*60*30, type: "embargo", priority: 2, name: "Diego H.", email: "diego@mail.com", city: "Las Condes", description: "Llegan hoy a retirar.", status: "new" },
];

export const SEED_LAWYERS: Lawyer[] = [
  { id: "l1", name: "María Pérez", specialties: ["embargo","dicom","arriendo","penal"], ratingAvg: 4.8, ratingCount: 132 },
  { id: "l2", name: "Luis Soto", specialties: ["alimentos","divorcio","vif","consumo","laboral"], ratingAvg: 4.7, ratingCount: 98 },
];