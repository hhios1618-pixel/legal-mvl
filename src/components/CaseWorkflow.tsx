import { useState, useEffect, Fragment } from 'react';
import { LegalCase, Message } from '../types';
import { WORKFLOWS } from '../data';
import { useApp } from '../store';
import { ChevronDown, Save, MessageSquare, Lock, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface CaseWorkflowProps {
  caseData: LegalCase;
  isClientView?: boolean;
}

export default function CaseWorkflow({ caseData, isClientView = false }: CaseWorkflowProps) {
  const workflow = WORKFLOWS[caseData.type];

  const addPrivateNote = useApp(s => s.addPrivateNote);
  const postPublicMessage = useApp(s => s.postPublicMessage);
  const setCurrentPhase = useApp(s => s.setCurrentPhase);
  const toggleActivityCompleted = useApp(s => s.toggleActivityCompleted);
  const updateStatus = useApp(s => s.updateStatus);
  
  const [activePhase, setActivePhase] = useState<string | null>(caseData.currentPhaseName || workflow.phases[0]?.name || null);
  const [localPrivateNote, setLocalPrivateNote] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (activePhase) {
      setLocalPrivateNote(caseData.notes?.[activePhase]?.private?.text || '');
    }
  }, [caseData, activePhase]);

  const handleSavePrivateNote = () => {
    if (!activePhase) return;
    addPrivateNote(caseData.id, activePhase, localPrivateNote);
  };

  const handlePostMessage = () => {
    if (!activePhase || !newMessage.trim()) return;
    const message: Message = {
      author: isClientView ? 'client' : 'lawyer',
      text: newMessage,
      date: Date.now()
    };
    postPublicMessage(caseData.id, activePhase, message);
    setNewMessage('');
  };
  
  const handleSetCurrentPhase = (phaseName: string) => {
    setCurrentPhase(caseData.id, phaseName);
    updateStatus(caseData.id, 'in_progress');
  };

  const handleToggleActivity = (activityName: string) => {
    toggleActivityCompleted(caseData.id, activityName);
  };
  
  if (!workflow) return <div className="p-4 bg-red-100 text-red-800 rounded-lg">No se encontró un flujo de trabajo.</div>;
  
  const currentPhaseName = caseData.currentPhaseName;

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">Flujo del Proceso</h3>
      <p className="text-sm text-gray-500 mb-6">
        Duración estimada: 
        <span className="font-semibold"> {workflow.totalDuration} {workflow.totalDurationUnit || 'meses'}</span>.
        {currentPhaseName && <span className="ml-2 pl-2 border-l-2">Fase Actual: <span className="font-semibold text-blue-600">{currentPhaseName}</span></span>}
      </p>

      <div className="space-y-4">
        {workflow.phases.map((phase, index) => {
          const isCurrent = phase.name === currentPhaseName;
          const phaseNotes = caseData.notes?.[phase.name];
          const publicMessages = (phaseNotes && Array.isArray(phaseNotes.public)) ? phaseNotes.public : [];

          return (
            <div key={index} className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${isCurrent ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
              <button onClick={() => setActivePhase(activePhase === phase.name ? null : phase.name)} className="w-full flex justify-between items-center p-5 text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {isCurrent ? <CheckCircle className="w-5 h-5"/> : index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{phase.name}</h4>
                    <p className="text-sm text-gray-500">{phase.percentage}% del proceso</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activePhase === phase.name ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activePhase === phase.name && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="border-t-2 border-dashed pt-4 pb-5 px-5">
                      
                      <div className="mb-6">
                        <h5 className="font-semibold text-gray-700 flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4"/> Canal de Comunicación</h5>
                        <div className="bg-gray-50 p-3 rounded-lg border max-h-60 overflow-y-auto space-y-3">
                          {publicMessages.length > 0 ? (
                            publicMessages.map((msg, msgIndex) => (
                              <div key={msgIndex} className={`flex flex-col ${msg.author === 'lawyer' ? 'items-start' : 'items-end'}`}>
                                {/* --- CORRECCIÓN AQUÍ: Añadimos `text-gray-800` para el mensaje del abogado --- */}
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.author === 'lawyer' ? 'bg-white shadow-sm text-gray-800' : 'bg-blue-500 text-white'}`}>
                                  <p className="text-sm">{msg.text}</p>
                                  <p className={`text-xs mt-1 ${msg.author === 'lawyer' ? 'text-gray-400' : 'text-blue-200'}`}>{formatDate(msg.date)}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center p-4">No hay mensajes en esta fase.</p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostMessage()}
                            placeholder={isClientView ? "Escribe tu respuesta..." : "Escribe una actualización para el cliente..."}
                            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                          />
                          <button onClick={handlePostMessage} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><Send className="w-5 h-5"/></button>
                        </div>
                      </div>

                      {!isClientView && (
                        <Fragment>
                           <div className="mb-4">
                              <h5 className="font-semibold text-gray-700 flex items-center gap-2 mb-2"><Lock className="w-4 h-4"/> Notas Privadas</h5>
                              <textarea rows={3} value={localPrivateNote} onChange={(e) => setLocalPrivateNote(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="Escribe tus notas internas aquí..." />
                              {phaseNotes?.private?.date && <span className="text-xs text-gray-400">Última actualización: {formatDate(phaseNotes.private.date)}</span>}
                              <button onClick={handleSavePrivateNote} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Save className="w-3 h-3"/> Guardar nota privada</button>
                           </div>
                           {!isCurrent && <button onClick={() => handleSetCurrentPhase(phase.name)} className="w-full p-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">Marcar como Fase Actual</button>}
                        </Fragment>
                      )}

                      <h5 className="font-semibold text-gray-600 mt-6 mb-3 text-sm uppercase tracking-wider">Actividades de esta fase</h5>
                      <ul className="space-y-4">
                        {phase.activities.map((activity) => {
                          const completedTimestamp = caseData.completedActivities?.[activity.name];
                          const isCompleted = !!completedTimestamp;
                          return (
                            <li key={activity.name} className="flex items-start gap-3">
                              {!isClientView ? (
                                <input type="checkbox" checked={isCompleted} onChange={() => handleToggleActivity(activity.name)} className="mt-1 w-5 h-5 accent-blue-600 flex-shrink-0"/>
                              ) : (
                                <div className="mt-1 flex-shrink-0">
                                  {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500"/> : <div className="w-5 h-5 rounded-full bg-gray-200" />}
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <p className={`font-semibold text-gray-800 ${isCompleted ? 'line-through text-gray-500' : ''}`}>{activity.name}</p>
                                <p className={`text-sm text-gray-600 ${isCompleted ? 'line-through' : ''}`}>{activity.description}</p>
                                {isCompleted && <p className="text-xs text-gray-400 mt-1">Completado: {formatDate(completedTimestamp)}</p>}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  );
}