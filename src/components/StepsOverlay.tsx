import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle, AlertCircle, User, 
  FileText, Phone, Calendar, ArrowRight,
  Zap, Shield, Star, X, Download
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
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{opacity:0, y:50, scale:0.95}}
          animate={{opacity:1, y:0, scale:1}}
          exit={{opacity:0, y:50, scale:0.95}}
          transition={{type:"spring", damping:25, stiffness:300}}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Main Card */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10" />
            {isUrgent && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />
            )}
            
            {/* Header */}
            <div className="relative p-8 pb-6 border-b border-white/10">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-white/70 group-hover:text-white" />
              </button>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isUrgent 
                      ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {isUrgent ? <AlertCircle className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Pasos Inmediatos
                    </h3>
                    <p className="text-lg text-white/80">
                      {SERVICE_LABEL[type]}
                    </p>
                  </div>
                </div>

                {isUrgent && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">URGENTE</span>
                  </div>
                )}
              </div>

              {/* Assignment Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Asignando abogado especialista</span>
                  <span className="text-white font-medium">
                    {assignmentProgress < 95 ? `${Math.round(assignmentProgress)}%` : 'Completando...'}
                  </span>
                </div>
                
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${assignmentProgress}%`}}
                    transition={{duration:0.5}}
                    className={`h-full rounded-full ${
                      isUrgent 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>Tiempo estimado restante:</span>
                  </div>
                  <div className={`font-bold ${isUrgent ? 'text-orange-400' : 'text-green-400'}`}>
                    ~ {sla} min
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative p-8 max-h-96 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Prepare lo siguiente mientras procesamos su caso:
                </h4>
                <p className="text-white/70 text-sm">
                  Tener estos elementos listos acelerará significativamente el proceso
                </p>
              </div>

              {/* Steps Timeline */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{opacity:0, x:-20}}
                    animate={{opacity:1, x:0}}
                    transition={{delay:index * 0.1}}
                    className="group relative"
                  >
                    {/* Timeline Line */}
                    {index < items.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/20" />
                    )}
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group-hover:scale-[1.02]">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${
                        isUrgent 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white leading-relaxed">
                          {item}
                        </p>
                        
                        {/* Step Icons */}
                        <div className="flex items-center gap-2 mt-2 text-white/50">
                          {item.toLowerCase().includes('documento') && <FileText className="w-4 h-4" />}
                          {item.toLowerCase().includes('contacto') && <Phone className="w-4 h-4" />}
                          {item.toLowerCase().includes('fecha') && <Calendar className="w-4 h-4" />}
                          {item.toLowerCase().includes('persona') && <User className="w-4 h-4" />}
                          <span className="text-xs uppercase tracking-wide">
                            {item.toLowerCase().includes('urgente') ? 'Prioritario' : 'Recomendado'}
                          </span>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white/50" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative p-8 pt-6 border-t border-white/10">
              {/* Status Cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-white">Confidencial</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Su información está protegida
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-medium text-white">Especialista</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Abogado experto en el área
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-white">Seguimiento</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Acompañamiento completo
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-300 hover:scale-[1.02]"
                >
                  Entendido, continuar
                </button>
                
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <Download className="w-4 h-4" />
                  Descargar checklist
                </button>
              </div>

              {/* Demo Notice */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-medium">DEMO:</span>
                  <span className="text-amber-400/80">
                    Simulación de asignación. Los tiempos reales pueden variar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}