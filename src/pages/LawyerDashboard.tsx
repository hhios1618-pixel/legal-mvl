import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store';
import { LegalCase } from '../types';
import { SERVICE_LABEL } from '../data';
import CaseWorkflow from '../components/CaseWorkflow';
import { Briefcase, ExternalLink, User, Mail, MapPin, Clock, MessageSquare, Inbox, FolderKanban, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function LawyerDashboard() {
  // --- ESTADO DE CARGA PARA RESOLVER EL PROBLEMA DE RAÍZ ---
  const [isLoading, setIsLoading] = useState(true);

  const cases = useApp(state => state.cases);
  const me = useApp(state => state.me);
  const claimCase = useApp(state => state.claimCase);

  const newCases = useMemo(() => {
    return cases
      .filter(c => c.status === "new" && me.specialties.includes(c.type))
      .sort((a,b)=> (b.priority - a.priority) || (a.createdAt - b.createdAt));
  }, [cases, me]);

  const myCases = useMemo(() => {
    return cases
      .filter(c => c.assignedLawyerId === me.id)
      .sort((a,b)=> b.createdAt - a.createdAt);
  }, [cases, me]);

  const allVisibleCases = useMemo(() => [...newCases, ...myCases], [newCases, myCases]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedCase = useMemo(() => {
    return allVisibleCases.find(c => c.id === selectedCaseId) || allVisibleCases[0] || null;
  }, [selectedCaseId, allVisibleCases]);

  // --- LÓGICA DE CARGA ---
  useEffect(() => {
    // Damos un pequeño respiro (50ms) para que el store se hidrate desde localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (allVisibleCases.length > 0) {
        setSelectedCaseId(allVisibleCases[0].id);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []); // Se ejecuta solo una vez

  const handleClaimCase = () => {
    if (selectedCase) {
      claimCase(selectedCase.id);
    }
  };

  const openPjudInNewTab = () => {
    window.open('https://oficinajudicialvirtual.pjud.cl/', '_blank', 'noopener,noreferrer');
  };

  // --- PANTALLA DE CARGA ---
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Cargando Casos...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <span className="text-lg text-white">⚖️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Panel Abogado</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            {newCases.length > 0 && (
              <>
                <h2 className="px-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Inbox className="w-4 h-4" /> Nuevos Casos para Ti ({newCases.length})
                </h2>
                <ul className="mt-2 space-y-1">
                  {newCases.map(caseItem => (
                    <li key={caseItem.id}>
                      <button onClick={() => setSelectedCaseId(caseItem.id)} className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${selectedCase?.id === caseItem.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <div className={`mt-1 w-2 h-2 rounded-full ${caseItem.priority === 2 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{SERVICE_LABEL[caseItem.type]}</p>
                          <p className="text-xs text-gray-500">{caseItem.name}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {myCases.length > 0 && (
              <>
                <h2 className="px-2 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" /> Mis Casos Asignados ({myCases.length})
                </h2>
                <ul className="mt-2 space-y-1">
                  {myCases.map(caseItem => (
                    <li key={caseItem.id}>
                      <button onClick={() => setSelectedCaseId(caseItem.id)} className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${selectedCase?.id === caseItem.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <div className={`mt-1 w-2 h-2 rounded-full ${caseItem.priority === 2 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{SERVICE_LABEL[caseItem.type]}</p>
                          <p className="text-xs text-gray-500">{caseItem.name}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 flex justify-between items-center z-10">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Detalle del Caso</h2>
          </div>
          <div className="px-8">
            <button onClick={openPjudInNewTab} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              <ExternalLink className="w-4 h-4"/>
              Consultar PJUD
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {selectedCase ? (
              <motion.div
                key={selectedCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{SERVICE_LABEL[selectedCase.type]}</h3>
                      <p className="text-sm text-gray-500 mt-1">ID Caso: {selectedCase.id.slice(0, 8)}</p>
                    </div>
                    {selectedCase.status === 'new' && (
                      <button onClick={handleClaimCase} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                        Reclamar Caso
                      </button>
                    )}
                     {selectedCase.status !== 'new' && (
                       <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedCase.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                        selectedCase.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' : 
                        selectedCase.status === 'waiting_client' ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedCase.status.toUpperCase().replace('_', ' ')}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-start gap-3"><User className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-gray-500">Cliente</p><p className="font-semibold text-gray-800">{selectedCase.name}</p></div></div>
                    <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-gray-500">Email</p><p className="font-semibold text-gray-800">{selectedCase.email}</p></div></div>
                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-gray-500">Ciudad</p><p className="font-semibold text-gray-800">{selectedCase.city || 'No especificada'}</p></div></div>
                    <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-gray-500">Fecha de Ingreso</p><p className="font-semibold text-gray-800">{formatDate(selectedCase.createdAt)}</p></div></div>
                    {selectedCase.description && (<div className="flex items-start gap-3 md:col-span-2"><MessageSquare className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-gray-500">Descripción del cliente</p><p className="font-semibold text-gray-800">{selectedCase.description}</p></div></div>)}
                  </div>
                </div>
                
                <CaseWorkflow caseData={selectedCase} />
                
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Briefcase className="w-16 h-16 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">No hay casos para mostrar</h3>
                <p className="mt-1 text-gray-500">Los casos nuevos de clientes aparecerán aquí.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}