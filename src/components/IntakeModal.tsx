import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, User, Mail, MapPin, FileText, 
  Shield, CheckCircle, AlertCircle, Clock, Lock, ArrowLeft
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
      urgent: false // Removemos la lógica de urgencia por tipos no válidos 
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        {/* Modal - Full screen on mobile, centered on desktop */}
        <motion.div
          initial={{opacity:0, y:100, scale:0.95}}
          animate={{opacity:1, y:0, scale:1}}
          exit={{opacity:0, y:100, scale:0.95}}
          transition={{type:"spring", damping:25, stiffness:300}}
          className="relative w-full h-full sm:h-auto sm:max-w-md sm:mx-4 sm:max-h-[90vh]"
        >
          {/* Main Card */}
          <div className="bg-white h-full sm:h-auto sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header - App-style */}
            <div className="relative px-4 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <button 
                onClick={onClose}
                className="absolute left-4 top-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="text-center pt-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-xl font-bold mb-1 text-white">
                  {SERVICE_LABEL[type]}
                </h3>
                <p className="text-blue-100 text-sm">
                  Complete sus datos para comenzar
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-100">Progreso</span>
                  <span className="text-white font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${progress}%`}}
                    transition={{duration:0.3}}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  Nombre completo *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ingrese su nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      border: '2px solid #e5e7eb'
                    }}
                    className="w-full h-14 px-4 rounded-xl focus:border-blue-500 focus:ring-0 placeholder:text-gray-400 transition-all duration-200 outline-none text-base font-medium"
                  />
                  {name && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {nameValid ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  Correo electrónico *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      border: '2px solid #e5e7eb'
                    }}
                    className="w-full h-14 px-4 rounded-xl focus:border-blue-500 focus:ring-0 placeholder:text-gray-400 transition-all duration-200 outline-none text-base font-medium"
                  />
                  {email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* City Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  Ciudad (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Santiago, Valparaíso, Concepción..."
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    border: '2px solid #e5e7eb'
                  }}
                  className="w-full h-14 px-4 rounded-xl focus:border-blue-500 focus:ring-0 placeholder:text-gray-400 transition-all duration-200 outline-none text-base font-medium"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Descripción de su caso (opcional)
                </label>
                <textarea
                  placeholder="Describa brevemente su situación legal..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={4}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    border: '2px solid #e5e7eb'
                  }}
                  className="w-full px-4 py-4 rounded-xl focus:border-blue-500 focus:ring-0 placeholder:text-gray-400 transition-all duration-200 outline-none resize-none text-base font-medium"
                />
              </div>

              {/* Privacy Consent */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={ok}
                        onChange={e => setOk(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        ok 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {ok && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-gray-700 leading-relaxed">
                      <span className="font-medium">Autorizo el uso de mis datos</span> para contactarme y orientarme legalmente.{" "}
                      <span className="text-blue-600 underline font-medium">Ver política de privacidad</span>
                    </div>
                  </label>
                </div>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Sus datos están protegidos con encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Respuesta en 5-15 min</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span>Conexión segura</span>
                </div>
              </div>

              <button
                disabled={disabled || isSubmitting}
                onClick={handleSubmit}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-base shadow-lg disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
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

