import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, User, Mail, MapPin, FileText, 
  Shield, CheckCircle, AlertCircle, Clock, Lock
} from "lucide-react";
import { ServiceType } from "../types";
import { SERVICE_LABEL } from "../data";

export default function IntakeModal({
  open, onClose, type, onSubmit
}: {
  open: boolean; 
  type: ServiceType | null; 
  onClose: ()=>void;
  onSubmit: (payload: { 
    type: ServiceType; 
    name: string; 
    email: string; 
    city?: string; 
    description?: string; 
    urgent?: boolean; 
  })=>void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [desc, setDesc] = useState("");
  const [ok, setOk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    setNameValid(name.trim().length >= 2);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [name, email]);

  const disabled = !nameValid || !emailValid || !ok;
  const progress = ((nameValid ? 1 : 0) + (emailValid ? 1 : 0) + (ok ? 1 : 0)) / 3 * 100;

  const handleSubmit = async () => {
    if (!type || disabled) return;
    
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({ 
      type, 
      name, 
      email, 
      city, 
      description: desc, 
      urgent: type === "embargo" || type === "penal" || type === "vif" 
    });
    
    setIsSubmitting(false);
  };

  if (!open || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
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
          className="relative w-full sm:max-w-lg sm:mx-4"
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
              
              <div className="flex items-center gap-3 mb-4 pr-12">
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
                  <span className="text-lg">⚖️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {SERVICE_LABEL[type]}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Complete la información para comenzar
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progreso</span>
                  <span className="text-slate-900 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${progress}%`}}
                    transition={{duration:0.3}}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="w-4 h-4" />
                  Nombre completo *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ingrese su nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none"
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {nameValid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail className="w-4 h-4" />
                  Correo electrónico *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none"
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="w-4 h-4" />
                  Ciudad (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Santiago, Valparaíso, Concepción..."
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="w-4 h-4" />
                  Descripción de su caso (opcional)
                </label>
                <textarea
                  placeholder="Describa brevemente su situación legal..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none resize-none"
                />
              </div>

              {/* Privacy Consent */}
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={ok}
                        onChange={e => setOk(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        ok 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}>
                        {ok && (
                          <CheckCircle className="w-5 h-5 text-white -m-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                      Autorizo el uso de mis datos para contactarme y orientarme legalmente.{" "}
                      <span className="text-blue-600 underline">Ver política de privacidad</span>
                    </div>
                  </label>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3 h-3" />
                  <span>Sus datos están protegidos con encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Respuesta en 5-15 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span>Conexión segura</span>
                </div>
              </div>

              <button
                disabled={disabled || isSubmitting}
                onClick={handleSubmit}
                className="w-full h-12 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Comenzar asesoría ahora
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
