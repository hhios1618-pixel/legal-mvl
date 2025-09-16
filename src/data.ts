import { LegalCase, Lawyer, ServiceType, Workflow } from "./types";

// SERVICE_LABEL, SERVICE_SUB y CHECKLIST
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
  liquidacion: "Liquidación Voluntaria",
  renegociacion: "Renegociación de Deudas",
  abandono: "Abandono de Procedimiento",
  nulidad: "Nulidad Procesal / Excepción",
  familia: "Causa de Familia",
  recursos: "Recursos Legales",
  especiales: "Causas Especiales",
  ordinario: "Juicio Ordinario",
  jpl: "Juzgado Policía Local",
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
  liquidacion: "Reorganice sus finanzas.",
  renegociacion: "Evite la liquidación.",
  abandono: "Defensa ante inactividad procesal.",
  nulidad: "Corrija vicios del procedimiento.",
  familia: "Asesoría en materias de familia.",
  recursos: "Apelaciones y recursos de queja.",
  especiales: "Estrategias para casos complejos.",
  ordinario: "Defensa en juicios de lato conocimiento.",
  jpl: "Defensa en Juzgado de Policía Local.",
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
  liquidacion: ["Informe de deudas (CMF)", "Cédula de Identidad", "Listado de bienes"],
  renegociacion: ["Certificados de deuda", "Cédula de Identidad"],
  abandono: ["Rol de la causa", "Última resolución"],
  nulidad: ["Rol de la causa", "Fecha de notificación"],
  familia: ["Certificados", "Pruebas"],
  recursos: ["Resolución a recurrir", "Plazos"],
  especiales: ["Todos los antecedentes"],
  ordinario: ["Documentos fundantes", "Pruebas"],
  jpl: ["Parte o citación", "Pruebas"],
};

const now = Date.now();
export const SEED_CASES: LegalCase[] = [
    { id: "c1", createdAt: now-1000*60*18, type: "embargo", priority: 2, name: "Juan C.", email: "juan@mail.com", city: "Santiago", description: "Me avisaron diligencia hoy.", status: "new", notes: {} },
    { id: "c2", createdAt: now-1000*60*45, type: "alimentos", priority: 1, name: "María A.", email: "maria@mail.com", city: "Valparaíso", description: "Demanda de alimentos.", status: "new", notes: {} },
    { id: "c3", createdAt: now-1000*60*5, type: "liquidacion", priority: 1, name: "Pedro L.", email: "pedro@mail.com", city: "La Serena", description: "Necesito declararme en quiebra.", status: "new", notes: {} },
    { id: "c4", createdAt: now-1000*60*120, type: "laboral", priority: 1, name: "Fernanda R.", email: "fer@mail.com", city: "Concepción", description: "Despido injustificado.", status: "new", notes: {} },
    { id: "c5", createdAt: now-1000*60*12, type: "arriendo", priority: 1, name: "Carlos T.", email: "carlos@mail.com", city: "Ñuñoa", description: "Desalojo moroso.", status: "new", notes: {} },
];

export const SEED_LAWYERS: Lawyer[] = [
  { id: "l1", name: "María Pérez", specialties: ["embargo","dicom","arriendo","penal", "liquidacion", "familia"], ratingAvg: 4.8, ratingCount: 132 },
  { id: "l2", name: "Luis Soto", specialties: ["alimentos","divorcio","vif","consumo","laboral", "familia"], ratingAvg: 4.7, ratingCount: 98 },
];

const genericWorkflow: Workflow = {
  phases: [
    { name: 'FASE INICIAL', percentage: 33, activities: [{ name: 'Análisis de viabilidad', description: 'Revisión inicial de documentos y estrategia.', duration: 5 }] },
    { name: 'FASE CONTROVERSIAL', percentage: 34, activities: [{ name: 'Desarrollo del procedimiento', description: 'Presentación de escritos y asistencia a audiencias.', duration: 30 }] },
    { name: 'FASE TERMINAL', percentage: 33, activities: [{ name: 'Resolución y cierre', description: 'Obtención de sentencia y acciones posteriores.', duration: 15 }] },
  ]
};

export const WORKFLOWS: Record<ServiceType, Workflow> = {
  // --- Flujos Detallados de tus Excel ---
  liquidacion: {
    totalDuration: 11,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 25,
        activities: [
          { name: "Subir Documentos al Case", description: "Digitalizar dicom, cmf, cedula de identidad, ficha, contrato y/o documentos extra que traiga el cliente.", duration: 3 },
          { name: "Gestiones Previas", description: "1. Llamar a cliente, corroborar información de ficha, ver si tiene derechos hereditarios (si tiene redactar cesión de derechos), 2. si arrienda sin contrato, redactar ctto. arriendo ante notario, ver si emite boletas (revisar en el sii carpeta tributaria, 3. si emite boletas, presentar liquidación como empresa deudora), ver si transfirió auto. 4. Revisar si tiene juicios pendientes, desarchivarlos, notificarnos, en caso contrario, redactar jactancia para tener 1 o 2 juicios pendientes.", duration: 20 },
          { name: "Redacción Liquidación y/o Jactancia", description: "Redactar borrador, enviarlo a la bandeja del abogado a cargo para su revisión, si hay algo que corregir, el abogado a cargo devuelve el escrito para su corrección.", duration: 5 },
          { name: "Juicio Jactancia", description: "Presentar jactancia, cumplir lo ordenado mandato. Una vez proveída citan a audiencia. Proveída, agregar este juicio a la liquidación y enviar liquidación a bandeja de abogado a cargo.", duration: 10 },
          { name: "Presentar Liquidación", description: "Una vez agregados los roles de jactancia a la liquidación, enviarla a la bandeja de abogado a cargo.", duration: 10 },
          { name: "Apercibimientos", description: "Cumplir lo ordenado con mandato.", duration: 5 },
          { name: "Previo a Proveer", description: "Tribunal pide mas requisitos que los que exige la ley: presentar recurso de reposición. Asimismo, pedir la documentación extra al cliente.", duration: 10 },
          { name: "Recurso de Queja", description: "Rechazado el recurso de reposición, se presenta recurso de queja.", duration: 5 },
          { name: "Solicitar Dar de Baja Liquidador Anterior", description: "Dar de baja solicitud de liquidador si se pidió anteriormente. Se envía mail a la superir: ofpartes@superir.gob.cl", duration: 10 },
          { name: "Solicitar Liquidador", description: "Se solicita liquidador en la superir. Una vez que llegue certificado de nominación al tribunal, estar atento al plazo del proveído de la liquidación. Si transcurren más de 10 días sin proveído, enviar escrito de se resuelva derechamente.", duration: 5 },
          { name: "Resolución de Liquidación Dictada", description: "Si la rechazan, presentar recurso de reposición en el plazo de 3 días contado desde el proveído. Si rechazan la reposición, presentar recurso de queja. Si se dicta resolución de liquidación, informar a cliente vía mail.", duration: 7 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 50,
        activities: [
          { name: "Preparar Documentación para Incautación", description: "Llamar a cliente para recopilar la documentación (certificados de dominio, contrato de arriendo, declaración jurada que es allegado y que los bienes excluidos no pertenecen al deudor, liquidaciones de sueldo, cotizaciones previsionales)", duration: 20 },
          { name: "Asistir a Incautación y Audiencia Constitutiva", description: "INCAUTACION: Asistir y oponerse si se da el caso. Si no acogen nuestra oposición, solicitar al tribunal, mediante escrito, audiencia del art. 131. SI ES CESE: Enviar por mail carta a acreedor adjuntando la resol. liquidación para que dejen de descontar.", duration: 10 },
          { name: "Presentar Reposición CAE", description: "Si uno de los acreedores presenta escrito de exclusión del cae y el tribunal lo acoge, presentar reposición con apelación en subsidio para que no se excluya.", duration: 5 },
          { name: "Oferta de Compra Directa", description: "Ver la posibilidad con el cliente de ofrecer una OCD para terminar antes el proceso concursal. Firmada la OCD, enviar al liquidador para su aprobación en la junta constitutiva.", duration: 10 },
          { name: "Verificación de Crédito Ordinario", description: "Revisar termino ordinario de verificación de crédito, plazo de 30 días desde la resolución de liquidación. Pedir al tribunal, se certifique el termino del periodo ordinario.", duration: 10 },
          { name: "Retiro de Bienes", description: "Si no hay OCD, coordinar con cliente, martillero y liquidador la entrega de bienes al martillero (ideal que cliente vaya a dejar los bienes).", duration: 20 },
          { name: "Remate", description: "Revisar en el pjud juramento designación martillero, bases del remate, publicaciones (2) de remate, avisar al cliente del remate por si quiere ir, revisar cuenta del martillero cuanto fue lo recaudado.", duration: 45 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 25,
        activities: [
          { name: "Distribución de Fondos", description: "1.- Solicitar por mail fecha al Liquidador para la propuesta de fondos. La ley señala al mas breve plazo. 2. Apercibimientos a liquidador al tribunal y a la superintendencia, principio celeridad del proceso.", duration: 60 },
          { name: "Rendición de Cuenta del Martillero", description: "1. Revisión de cuenta provisional de liquidador, para ver saldos y gastos. 2. Revisar si hay agotamiento de fondos, o bien el monto es menor al 5% de los créditos verificados.", duration: 10 },
          { name: "Cuenta Final", description: "Habiendo agotamiento de fondos, no existiendo mas bienes del deudor, transcurrido los 3 meses desde la resolución que tiene por aprobada el pago: 1. solicitar cuenta final por mail a liquidador (1 semana) luego apercibimiento al tribunal reclamo a la superir .", duration: 10 },
          { name: "Apercibimientos", description: "Apercibir al liquidador en la superir y tribunal, cumplimiento de plazos, cumplimientos de medidas sancionatorias art. 337, 338 de la ley 20720: 1. solicitud a liquidador: el objeto que se dicte cuenta final.", duration: 7 },
          { name: "Presenta Cuenta Final Objeciones", description: "1. Revisar que en la cuenta final no se presenten objeciones al tribunal, boletín concursal por los acreedores u otros, plazo legal, señalar en la tarea como nota si hay objeciones.", duration: 15 },
          { name: "Resolución de Término", description: "Vencido plazo de objeciones o subsanadas, solicitar a tribunal resolución de termino: 1. revisar resoluciones que dieron no a lugar por temas pendientes 2. cumplir los temas pendientes que señale el tribunal 3. curso progresivo de resolución de termino 4. revisar si aplica recursos o si se presento recurso 5. pedir certificado de ejecutoria de resolución de termino.", duration: 15 },
          { name: "Proceso Ejecutoriado", description: "Se informa al cliente de proceso terminado y los pasos a seguir para aclarar deudas publicadas en dicom.", duration: 3 },
        ],
      },
    ],
  },
  renegociacion: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 25,
        activities: [
          { name: "Recopilar Documentos de Acreedores", description: "RECOPILAR TODA LA DOCUMENTACION NECESARIA PARA INICIAR LA RENEGOCIACIÓN: 1. ACREEDORES Y (enviar mails a acreedores para obtener estos certificados) 2. CLIENTE (pedir a cliente que también pueda gestionar los certificados de deudas en las instituciones bancarias)", duration: 40 },
          { name: "Reclamo Sernac", description: "SI EN PLAZO DE 15 DIAS LOS ACREEDORES NO ENVIAN DOCUMENTACION, SE HACE RECLAMO AL SERNAC.", duration: 15 },
          { name: "Presentar Renegociación", description: "REVISAR Y COTEJAR LA DOCUMENTACION ENVIADA POR CLIENTE O ACREEDORES PARA INICIAR EN LA SUPERIR, PROCEDIMIENTO DE RENEGOCIACIÓN.", duration: 10 },
          { name: "Resolución Rectificar Renegociación", description: "COORDINAR CON DEUDOR Y/O ACREEDORES, LA NUEVA DOCUMENTACION QUE PIDE SUPERIR PARA CUMPLIR LO ORDENADO.", duration: 15 },
          { name: "Cumple lo Ordenado Rectificación", description: "1. OBTENIDA TODA LA DOCUMENTACION, SE CUMPLE LO ORDENADO RECTIFICANDO LA SOLICITUD DE RENEGOCIACION DENTRO DEL PLAZO QUE ELLOS SEÑALAN (plazo que es prorrogable, enviando mail a la superir: ofpartes@superir.gob.cl).", duration: 15 },
          { name: "Resolución Acoge Renegociación", description: "INFORMAR A CLIENTE QUE SE DICTÓ RESOLUCION DE RENEGOCIACIÓN Y LOS PASOS A SEGUIR, ESTO ES: - PROPUESTA DEPAGO ACORDADA CON CLIENTE - REVISIÓN DE SU OJV PARA SUSPENDER JUCIOS INICIADOS - AUDIENCIA DETERMINACION DEL PASIVO - PROPUESTA DE PAGO DE LA SUPERIR.", duration: 3 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 50,
        activities: [
          { name: "Propuesta de Pago", description: "1. REVISAR Y ACORDAR PROPUESTA DE PAGO CON CLIENTE PARA LA AUDIENCIA DE DETERMINACION DEL PASIVO. 2. REVISAR OJV DEL CLIENTE PARA VER POSIBLES JUICIOS INICIADOS Y ASI SUSPENDERLOS.", duration: 5 },
          { name: "Audiencia Determinación del Pasivo", description: "1. PREPARAR INFORME DE TODO LO GESTIONADO EN ESTA RENEGOCIACION CON QUIEN ASISTA A ESTA AUDIENCIA. 2. ASISTIR A AUDIENCIA PARA LA PROPUESTA.", duration: 7 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 25,
        activities: [
          { name: "Audiencia Renegociación", description: "1. ASISITIR A LA AUDIENCIA ANTE LA SUPERIR 2. HACER OBSERVACIONES A LA PROPUESTA DE LOS ACREEDORES SI ES EL CASO. 3. ACEPTAR CONTRAPROPUESTA DE ACREEDORES (para evitar ejecuciones cuando un cliente sea dueño de inmuebles)", duration: 10 },
        ],
      },
    ],
  },
  abandono: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
       {
        name: "FASE INICIAL",
        percentage: 25,
        activities: [
            { name: "Gestiones Previas", description: "1. Revisar ficha para ver si tiene mas juicios de abandono. Conectar el o los roles de esas causas al pjud. 2. Revisar ojv de los juicios para ver si están archivados o activos.", duration: 30 },
            { name: "Redacción de Escrito", description: "Redacción de desarchivo y abandono o solo abandono. Revisar plazo legal, art. 152 y 153 cpc, enviarlo a bandeja de abogado a cargo.", duration: 5 },
            { name: "Cumplir lo Ordenado", description: "Acompañar mandato.", duration: 3 },
            { name: "Pagar Desarchivo", description: "Causas de papel, coordinar el pago de desarchivo con área comercial", duration: 30 },
            { name: "Resolución del Escrito", description: "CAUSA ARCHIVADA DE PAPEL: 1. Proveído el desarchivo, informar a cliente que debe pagar el desarchivo directamente al archivero. Pagado éste, enviar mail al archivero judicial (san miguel, puente alto o santiago) con el comprobante de pago y datos de la causa para ser enviada del archivo al tribunal. 2. Llegado el expediente al tribunal, reiterar escrito de abandono. CAUSA DIGITAL: Una vez desarchivada, reiterar escrito de abandono.", duration: 10 },
        ]
       },
       {
        name: "FASE CONTROVERSIAL",
        percentage: 50,
        activities: [
            { name: "Traslado", description: "1. Proveído el escrito de abandono, traslado. 2. Preguntar a receptor valor de notificación por art. 52 cpc. 3. Reenviar mail de receptor con valor de notificación al área comercial para su gestión.", duration: 20 },
            { name: "Notificación por Cédula", description: "Notificado el demandante y no habiendo evacuado el traslado, pedir se falle incidente.", duration: 10 },
        ]
       },
       {
        name: "FASE TERMINAL",
        percentage: 25,
        activities: [
            { name: "Sentencia", description: "Una vez dictada sentencia que acoge abandono, esperar 10 días para solicitar se certifique ejecutoria.", duration: 15 },
            { name: "Ejecutoriada", description: "Una vez ejecutoriada la sentencia, informar a cliente.", duration: 7 },
        ]
       }
    ]
  },
  nulidad: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. Revisar si causa esta archivada o no. 2. Redactar desarchivo y nulidad y/o excepción de prescripción según sea el caso. 3. Redactar sólo nulidad y/o excepción prescripción si no esta archivada. 4. Conectar causas al case.", duration: 10 },
          { name: "Redacción Escrito", description: "1. Revisar bien la fecha de nulidad (5 días desde que tomó conocimiento). 2. Enviar a bandeja de abogado a cargo el escrito.", duration: 5 },
          { name: "Cumplir lo Ordenado", description: "Acompañar mandato.", duration: 4 },
          { name: "Resolución Escrito", description: "Si causa es de papel, informar a cliente que debe pagar desarchivo al archivero judicial. Pagado el desarchivo, enviar al archivero (san miguel, puente alto o santiago) comprobante de pago. Esperar que expediente llegue al tribunal. Si causa es digital esperar el proveído del escrito.", duration: 30 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Traslado", description: "Habiendo contestado o no la contraria el traslado, esperar proveído del termino probatorio. Preparar los medios de prueba, revisar la prueba y contactar a cliente por los datos de testigos.", duration: 20 },
          { name: "Encargar Notificación", description: "Si hay que notificar, se pregunta valor a receptor y se informa al área comercial para su gestión.", duration: 10 },
          { name: "Término Probatorio", description: "Revisar los hechos a probar, redactar escrito acompaña documentos y minuta de testigos. Plazo del termino probatorio 8 días, presentar 2 días antes del vencimiento la lista de testigos.", duration: 10 },
          { name: "Autos para Fallo", description: "Dictada la resolución autos para fallo, esperar sentencia.", duration: 10 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Ejecutoria", description: "Terminado el plazo de 10 días, solicitar se certifique ejecutoria.", duration: 11 },
          { name: "Sentencia", description: "Dictada sentencia que acoge incidente nulidad, presentar si corresponde, excepción de prescripción del pagaré.", duration: 10 },
        ],
      },
    ],
  },
  familia: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. documentos solicitados 2. teroria del caso 3. hechos favorables 4. hechos desfavorables 5. medios prueba hechos favorables 6. hechos desfavorables, desacreditar 7. redacción de la demanda / contestación 8. documentos basales para la acción", duration: 20 },
          { name: "Redactar Demanda", description: "1. Redactar demanda 2. Presentar al tribunal.", duration: 10 },
          { name: "Proveido de Demanda", description: "1. Informar a supervisor fecha de audiencia preparatoria. 2. Agendarla en el case.", duration: 10 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Audiencia Preparatoria", description: "1. Redactar minuta de audiencia, etapas y guion 2. listado de testigos, y objeto a declarar 3. documentos, fecha, propósito 4. oficios a solicitar, fundamentos 5. peritajes 6. lista de objeciones a potencial prueba contraria 7. propuesta de conciliación limites", duration: 20 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Audiencia de Juicio", description: "1. Redactar minuta de audiencia de juicios, alegatos 2. objeción de preguntas a testigos 3. prueba documental 4. testigos, entrevistados y preguntas 5. oficios incorporados 6. peritajes 7. alegato clausura / observaciones a la prueba 8. sentencia", duration: 40 },
          { name: "Sentencia", description: "Informar a cliente de sentencia y determinar si procede recurso.", duration: 10 },
          { name: "Recursos", description: "Redactar y presentar recurso", duration: 10 },
        ],
      },
    ],
  },
  recursos: {
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Analizar si Procede Recurso", description: "1. Buscar jurisprudencia casos similares. 2. Si procede, informar al supervisor a cargo.", duration: 3 },
          { name: "Redactar Recurso", description: "1. Revisión de plazo para presentar recurso. 2. Enviar a bandeja de supervisor a cargo.", duration: 5 },
          { name: "Presentar al Tribunal", description: "Enviar a bandeja de supervisor a cargo para revisión.", duration: 3 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Acoge Recurso", description: "1. Conectar causa al case rol de corte. 2. redactar y enviar a ojv de team leader escrito 'se hace parte, ofrece alegatos, anuncio y datos contacto'.", duration: 3 },
          { name: "Revisar Recurso Diario", description: "1. revisar acciones de la contraria. 2. revisar jurisprudencia de recursos y tema similar", duration: 10 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Revisar Recurso Semanal", description: "1. Revisar tabla semanal. 2. redactar minuta de alegato 3. comparecer a las 8 am 4. alegato", duration: 10 },
          { name: "Fallo Recurso", description: "Esperar sentencia.", duration: 10 },
        ],
      },
    ],
  },
  especiales: {
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 50,
        activities: [
          { name: "Determinar Plan", description: "1. Revisar ficha de cliente y documentos que haya hecho entrega a la oficina. 2. Determinar plan a seguir.", duration: 5 },
          { name: "Estrategia Jurídica", description: "plan se contrarresta con 2 opiniones.", duration: 5 },
          { name: "Jurisprudencia", description: "Buscar casos similares y normativa aplicada.", duration: 5 },
          { name: "Control de Estrategia", description: "1. Reunión abogados para determinar estrategia 2. tipo de procedimiento.", duration: 3 },
          { name: "Flujo de Trabajo", description: "Crear flujo de tareas especiales y especificas para abogado a cargo.", duration: 1 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 50,
        activities: [
          { name: "Término Probatorio", description: "Preparar minuta y prueba", duration: 10 },
          { name: "Contestación Demanda", description: "Una vez reactivada la causa, y terminado el periodo de prueba presentar contesta demanda", duration: 10 },
        ],
      },
    ],
  },
  dicom: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. Revisar, con la clave única del cliente si tiene juicios donde aparezca el pagaré caduco que se esta publicando en dicom. 2. Adjuntar dichos documentos al case.", duration: 10 },
          { name: "Redactar Carta", description: "1. Fundamento legal: ley 19628. 2. caducidad art 12 3. extinción art 18 4. mas de 5 años art 18 5. revocación de autorización contrato art 4", duration: 5 },
          { name: "Enviar Carta", description: "1. Enviar a dicom y boletin comercial, con copia al cliente, carta más la demanda o el pagare caduco, señalando que con la sola lectura de la fecha del pagaré esta caduco (prueba: documentos solicitados en med pre judicial, demandas presentadas sin notificar en pjud, pagares acompañados en demandas, pantallazos que no hay demandas de quien publica. 2. Esperar respuesta. 3. Si es negativa la respuesta, se insiste 2 veces mas.", duration: 5 },
          { name: "Enviar 2da Carta", description: "Ante la negativa de dicom o al no haber respuesta, se envía una 2° carta con los mismos fundamentos.", duration: 10 },
          { name: "Enviar 3ra Carta", description: "Ante la negativa o no haber respuesta de dicom, se envía 3° carta señalando que si no tenemos respuesta a nuestro requerimiento, iniciaremos acciones legales en su contra.", duration: 10 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Medida Prejudicial", description: "1. Si no tengo prueba (no hay demandas ni pagares en la ojv del cliente), se redacta medida prejudicial de exhibición de documentos (art 273 nr2 y 3 cpc). 2. Presentación de M.P. al tribunal. 3. Acreditar poder 4. Notificar a contraparte.", duration: 10 },
          { name: "Tribunal Provee", description: "1. Acreditar poder 2. Notificar a contraparte. 3. Tribunal cita a audiencia de exhibición de documentos (apercibimientos legales art 274 277 cpc)", duration: 20 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Procedimiento Art. 16 Ley 19.628", description: "1.Redacción demanda. 2. presentación al tribunal acompañando medios de prueba.", duration: 10 },
          { name: "Tribunal Provee", description: "1. notifica por receptor a dicom 2. cita a audiencia, reiterar prueba 3. observaciones prueba contraria 4. solicitar fallo", duration: 20 },
          { name: "Sentencia", description: "1. se dicta sentencia acogiendo o rechazando. 2. recurso si es pertinente", duration: 20 },
        ],
      },
    ],
  },
  laboral: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. Revisar ficha y documentación entregada por cliente. 2. Pedir a cliente documentación faltante. 3. Revisar teoría del caso. 4. Revisar hechos favorables. 5. Revisar hechos desfavorables. 6. Revisar medios de prueba. 7. Desacreditar hechos desfavorables", duration: 10 },
          { name: "Redactar Demanda", description: "1. Redactar o contestar demanda en su caso. 2. Revisar documentación para la demanda. 3. Presentar al tribunal.", duration: 10 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Audiencia Preparatoria", description: "1. Redactar minuta de audiencia. 2. Lista de testigos y sobre que puntos van a declarar. 3. Ver que oficios vamos a pedir al tribunal. 4. Peritajes. 5. Lista de objeciones a prueba de contraria 6. Propuesta de conciliación.", duration: 20 },
          { name: "Proveido de Demanda", description: "Poner fecha de audiencia en el case y calendario mail. Informar a abogado.", duration: 30 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Audiencia de Juicio", description: "1. Redactar minuta de audiencia de juicios, alegatos 2. preparar objeción de preguntas a testigos 3. prueba documental 4. testigos, entrevistados y preguntas 5. oficios incorporados 6. peritajes 7. alegato clausura / observaciones a la prueba 8. sentencia", duration: 20 },
          { name: "Recursos", description: "Si no estamos conforme con el fallo del tribunal, preparamos recurso.", duration: 10 },
        ],
      },
    ],
  },
  penal: {
    totalDuration: 4,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. Revisar documentos solicitados 2. Revisar teoría del caso 3. revisar hechos favorables 4. revisar hechos desfavorables 5. medios prueba hechos favorables 6. hechos desfavorables, desacreditar", duration: 20 },
          { name: "Redactar Demanda", description: "1. redacción de la demanda / contestación 2. documentos basales para la acción 3. presentación tribunal", duration: 15 },
          { name: "Proveido de Demanda", description: "1. solicitar orden de investigar diligencias citación a testigos 2. declaraciones imputado 3. diligencias en pdi o similar 4. solicitud de formalización ministerio publico 5. apercibimiento para formalización 6. acusación o requerimiento 7. revisar carpeta de investigación - diligencias pendientes", duration: 20 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Audiencia Preparatoria", description: "1. Redactar minuta de audiencia, etapas y guion 2. listado de testigos, y objeto a declarar 3. documentos, fecha, propósito 4. oficios a solicitar, fundamentos 5. peritajes 6. lista de objeciones a potencial prueba contraria 7. propuesta de conciliación limites", duration: 20 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Audiencia de Juicio", description: "1. audiencia de jucio 2. minuta de audiencia de juicios, alegatos 3. objeción de preguntas a testigos 4. prueba documental 5. testigos, entrevistados y preguntas 6. oficios incorporados 7. peritajes 8. alegato clausura / observaciones a la prueba 9. sentencia", duration: 30 },
          { name: "Recursos", description: "Determinar si procede recurso en contra de sentencia.", duration: 10 },
        ],
      },
    ],
  },
  ordinario: {
    totalDuration: 8,
    totalDurationUnit: "meses",
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Gestiones Previas", description: "1. documentos 2. relación de los hechos 3. hechos favorables 4. hechos desfavorables 5. prueba requerida 6. revisión de jurisprudencia 7. caso similar", duration: 15 },
          { name: "Redactar Demanda", description: "1. Redacción de demanda 2. presentación tribunal", duration: 10 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Notificar Demanda", description: "1. Encargar a receptor notificar demanda. 2. contestación parte contraria 3. excepciones dilatorias, examinar 4. replica de la contestación 5. elaborar puntos débiles contraria 6. destacar puntos a favor 7. duplica de la parte contraria 8. téngase presente de errores contraria 9. conciliación", duration: 20 },
          { name: "Término Probatorio", description: "1. hechos a probar 2. notificación resolución prueba 3. documentos (publico, privados) 4. lista de testigos 5. preguntas testigos propios 6. pregunta testigos contraria 7. examen de tacha 8. receptor, para testigos 9. absolución de posiciones sobre preguntas 10. declaración testigos 11. exhibir documentos 12 oficios peritajes inspección tribunal", duration: 20 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Observaciones a la Prueba", description: "1. observaciones a la prueba 2. medidas para mejor resolver, analizar pertinencia 3. solicita fallo 4. citación a oír sentencia", duration: 20 },
          { name: "Sentencia", description: "sentencia notificarnos", duration: 15 },
          { name: "Recursos", description: "Determinar si procede recurso en contra de la sentencia", duration: 10 },
        ],
      },
    ],
  },
  jpl: {
    phases: [
      {
        name: "FASE INICIAL",
        percentage: 33,
        activities: [
          { name: "Redactar Querella", description: "QUERELLA INFRACCIONAL DEMANDA INDEMNIZACION DECLARACIÓN INDAGATORIA AL TRIBUNAL - PEDIR NOTIFICACION", duration: 20 },
        ],
      },
      {
        name: "FASE CONTROVERSIAL",
        percentage: 34,
        activities: [
          { name: "Audiencia Contestación, Conciliación y Prueba", description: "MEDIOS DE PRUEBA LISTA TESTIGOS DECLARACIÓN TESTIGOS OBJECIONES A LA PRUEBA", duration: 20 },
        ],
      },
      {
        name: "FASE TERMINAL",
        percentage: 33,
        activities: [
          { name: "Sentencia", description: "Notificarnos de sentencia", duration: 15 },
          { name: "Recursos", description: "DETERMINAR SI PROCEDE RECURSO EN CONTRA DE SENTENCIA", duration: 10 },
        ],
      },
    ],
  },

  // --- Flujos Genéricos para completar el objeto ---
  embargo: genericWorkflow,
  divorcio: genericWorkflow,
  alimentos: genericWorkflow,
  vif: genericWorkflow,
  arriendo: genericWorkflow,
  herencias: genericWorkflow,
  consumo: genericWorkflow,
};