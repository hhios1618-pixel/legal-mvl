import { useState } from 'react';
import { LegalCase, Workflow } from '../types';
import { SERVICE_LABEL, WORKFLOWS } from '../data';
import CaseWorkflow from './CaseWorkflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronRight, TrendingUp } from 'lucide-react';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
};

const statusInfo = {
  new: { text: "Recibido", color: "bg-yellow-500", textColor: "text-yellow-800", bgColor: "bg-yellow-100" },
  claimed: { text: "Abogado Asignado", color: "bg-blue-500", textColor: "text-blue-800", bgColor: "bg-blue-100" },
  in_progress: { text: "En Progreso", color: "bg-indigo-500", textColor: "text-indigo-800", bgColor: "bg-indigo-100" },
  waiting_client: { text: "Esperando Información", color: "bg-orange-500", textColor: "text-orange-800", bgColor: "bg-orange-100" },
  closed: { text: "Cerrado", color: "bg-green-500", textColor: "text-green-800", bgColor: "bg-green-100" },
};

// --- NUEVA FUNCIÓN PARA CALCULAR EL PROGRESO ---
const getCaseProgress = (caseData: LegalCase): number => {
  const workflow: Workflow | undefined = WORKFLOWS[caseData.type];
  if (!workflow || !caseData.currentPhaseName) {
    return 5; // Un pequeño % inicial para mostrar que ha comenzado
  }

  const currentPhaseIndex = workflow.phases.findIndex(p => p.name === caseData.currentPhaseName);
  if (currentPhaseIndex === -1) {
    return 5;
  }

  let progress = 0;
  for (let i = 0; i < currentPhaseIndex; i++) {
    progress += workflow.phases[i].percentage;
  }
  
  // Añadimos una pequeña parte de la fase actual para mostrar que se está trabajando en ella
  progress += workflow.phases[currentPhaseIndex].percentage / 3;

  return Math.round(Math.min(progress, 100));
};


export default function ClientCaseView({ cases }: { cases: LegalCase[] }) {
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  if (selectedCase) {
    return (
      <div className="bg-gray-50 p-4 sm:p-8">
        <button onClick={() => setSelectedCase(null)} className="mb-6 font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Volver a Mis Casos
        </button>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900">{SERVICE_LABEL[selectedCase.type]}</h3>
          <p className="text-sm text-gray-500 mt-1">Ingresado el: {formatDate(selectedCase.createdAt)}</p>
        </div>
        <CaseWorkflow caseData={selectedCase} isClientView={true} />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Mis Casos</h2>
          <p className="text-lg text-gray-600 mt-2">Aquí puedes ver el estado y progreso de tus solicitudes.</p>
        </motion.div>
        <div className="space-y-6">
          <AnimatePresence>
            {cases.map((caseItem, index) => {
              const progress = getCaseProgress(caseItem);
              const status = statusInfo[caseItem.status];

              return (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <button
                    onClick={() => setSelectedCase(caseItem)}
                    className="w-full text-left bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* --- SECCIÓN SUPERIOR CON TÍTULO Y ESTADO --- */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{SERVICE_LABEL[caseItem.type]}</h3>
                        <p className="text-sm text-gray-500">Ingresado el {formatDate(caseItem.createdAt)}</p>
                      </div>
                      <div className={`px-3 py-1 text-xs font-bold rounded-full ${status.bgColor} ${status.textColor}`}>
                        {status.text}
                      </div>
                    </div>
                    
                    {/* --- NUEVA BARRA DE PROGRESO Y FASE ACTUAL --- */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700">Progreso General</span>
                        <span className="font-bold text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-sky-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      {caseItem.currentPhaseName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span>Fase Actual: <span className="font-semibold">{caseItem.currentPhaseName}</span></span>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}