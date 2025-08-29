import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle, AlertCircle, User, 
  FileText, Phone, Calendar, ArrowRight,
  Shield, Star, X, Download
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
  const isUrgent = type === "embargo" || type === "penal" || type === "vif";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div 
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          className="absolute inset-0 bg-black/50" 
          onClick={onClose}
        />
        
        {/* Modal - Bottom sheet on mobile, centered on desktop */}
        <motion.div
          initial={{opacity:0, y:100}}
          animate={{opacity:1, y:0}}
          exit={{opacity:0, y:100}}
          transition={{type:"spring", damping:30, stiffness:300}}
          className="relative w-full sm:max-w-2xl sm:mx-4"
        >
          {/* Main Card */}
          <div className="bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-slate-200">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              
              <div className="flex items-start justify-between mb-6 pr-12">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isUrgent 
                      ? 'bg-red-600' 
                      : 'bg-blue-700'
                  }`}>
                    {isUrgent ? (
                      <AlertCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-lg">⚖️</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Pasos Inmediatos
                    </h3>
                    <p className="text-sm text-slate-600">
                      {SERVICE_LABEL[type]}
                    </p>
                  </div>
                </div>

                {isUrgent && (
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-red-50 border border-red-200">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-red-700">URGENTE</span>
                  </div>
                )}
              </div>

              {/* Assignment Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Asignando abogado especialista</span>
                  <span className="text-sm font-medium text-slate-900">
                    {assignmentProgress < 95 ? `${Math.round(assignmentProgress)}%` : 'Completando...'}
                  </span>
                </div>
                
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${assignmentProgress}%`}}
                    transition={{duration:0.3}}
                    className={`h-full rounded-full ${
                      isUrgent 
                        ? 'bg-red-600' 
                        : 'bg-blue-600'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Tiempo estimado restante:</span>
                  </div>
                  <div className={`font-semibold ${isUrgent ? 'text-red-600' : 'text-emerald-600'}`}>
                    ~ {sla} min
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-4 sm:p-6 max-h-[50vh] overflow-y-auto">
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900 mb-2">
                  Prepare lo siguiente mientras procesamos su caso:
                </h4>
                <p className="text-sm text-slate-600">
                  Tener estos elementos listos acelerará significativamente el proceso
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{opacity:0, x:-10}}
                    animate={{opacity:1, x:0}}
                    transition={{delay:index * 0.05}}
                    className="group relative"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white ${
                        isUrgent 
                          ? 'bg-red-600' 
                          : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {item}
                        </p>
                        
                        {/* Step Icons */}
                        <div className="flex items-center gap-2 mt-2 text-slate-400">
                          {item.toLowerCase().includes('documento') && <FileText className="w-3 h-3" />}
                          {item.toLowerCase().includes('contacto') && <Phone className="w-3 h-3" />}
                          {item.toLowerCase().includes('fecha') && <Calendar className="w-3 h-3" />}
                          {item.toLowerCase().includes('persona') && <User className="w-3 h-3" />}
                          <span className="text-xs uppercase tracking-wide">
                            {item.toLowerCase().includes('urgente') ? 'Prioritario' : 'Recomendado'}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                  <Shield className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-slate-900">Confidencial</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                  <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-slate-900">Especialista</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                  <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-slate-900">Seguimiento</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-11 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium transition-colors"
                >
                  Entendido, continuar
                </button>
                
                <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors">
                  <Download className="w-4 h-4" />
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