import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle, AlertCircle, User, 
  FileText, Phone, Calendar, ArrowRight,
  Shield, Star, X, Download, ArrowLeft
} from "lucide-react";
import { CHECKLIST, SERVICE_LABEL } from "../data";
import { ServiceType } from "../types";

export default function StepsOverlay({
  open, type, onClose, slaStartMs
}: { 
  open: boolean; 
  type: ServiceType | null; 
  onClose: ()=>void; 
  slaStartMs: number; 
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [assignmentProgress, setAssignmentProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      // Simulate assignment progress
      const elapsed = Date.now() - slaStartMs;
      const progress = Math.min((elapsed / (10 * 60 * 1000)) * 100, 95); // 10 min = 95%
      setAssignmentProgress(progress);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, slaStartMs]);

  if (!open || !type) return null;

  const items = CHECKLIST[type];
  const mins = Math.floor((currentTime - slaStartMs) / 60000);
  const sla = Math.max(1, 10 - mins);
  const isUrgent = false; // Removemos la lógica de urgencia por tipos no válidos

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div 
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        {/* Modal - Full screen on mobile, centered on desktop */}
        <motion.div
          initial={{opacity:0, y:100, scale:0.95}}
          animate={{opacity:1, y:0, scale:1}}
          exit={{opacity:0, y:100, scale:0.95}}
          transition={{type:"spring", damping:25, stiffness:300}}
          className="relative w-full h-full sm:h-auto sm:max-w-2xl sm:mx-4 sm:max-h-[90vh]"
        >
          {/* Main Card */}
          <div className="bg-white h-full sm:h-auto sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header - App-style */}
            <div className={`relative px-4 py-6 ${isUrgent ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white`}>
              <button 
                onClick={onClose}
                className="absolute left-4 top-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center pt-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${isUrgent ? 'bg-white/20' : 'bg-white/20'} backdrop-blur-sm flex items-center justify-center`}>
                  {isUrgent ? (
                    <AlertCircle className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-2xl">⚖️</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">
                  Pasos Inmediatos
                </h3>
                <p className="text-blue-100 text-sm">
                  {SERVICE_LABEL[type]}
                </p>
                
                {isUrgent && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-3 rounded-full bg-white/20 backdrop-blur-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">CASO URGENTE</span>
                  </div>
                )}
              </div>

              {/* Assignment Status */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Asignando abogado especialista</span>
                  <span className="text-white font-semibold">
                    {assignmentProgress < 95 ? `${Math.round(assignmentProgress)}%` : 'Completando...'}
                  </span>
                </div>
                
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${assignmentProgress}%`}}
                    transition={{duration:0.3}}
                    className="h-full bg-white rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Clock className="w-4 h-4" />
                    <span>Tiempo estimado restante:</span>
                  </div>
                  <div className="font-bold text-white">
                    ~ {sla} min
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Prepare lo siguiente mientras procesamos su caso:
                </h4>
                <p className="text-gray-600">
                  Tener estos elementos listos acelerará significativamente el proceso
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{opacity:0, x:-20}}
                    animate={{opacity:1, x:0}}
                    transition={{delay:index * 0.1}}
                    className="group relative"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg ${
                        isUrgent 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 leading-relaxed font-medium">
                          {item}
                        </p>
                        
                        {/* Step Icons */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 text-gray-500">
                            {item.toLowerCase().includes('documento') && <FileText className="w-4 h-4" />}
                            {item.toLowerCase().includes('contacto') && <Phone className="w-4 h-4" />}
                            {item.toLowerCase().includes('fecha') && <Calendar className="w-4 h-4" />}
                            {item.toLowerCase().includes('persona') && <User className="w-4 h-4" />}
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              {item.toLowerCase().includes('urgente') ? 'Prioritario' : 'Recomendado'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                  <Shield className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Confidencial</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Especialista</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Seguimiento</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-14 px-6 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold transition-all duration-200 hover:border-gray-300"
                >
                  Entendido, continuar
                </button>
                
                <button className="flex items-center justify-center gap-3 h-14 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Download className="w-5 h-5" />
                  Descargar checklist
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

