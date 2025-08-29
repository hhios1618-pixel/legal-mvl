import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, User, Mail, MapPin, FileText, 
  Shield, CheckCircle, AlertCircle, Clock,
  Lock, Eye, EyeOff
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showPrivacy, setShowPrivacy] = useState(false);
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
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
          className="relative w-full max-w-2xl"
        >
          {/* Main Card */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />
            
            {/* Header */}
            <div className="relative p-8 pb-6 border-b border-white/10">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-white/70 group-hover:text-white" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  ⚖️
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {SERVICE_LABEL[type]}
                  </h3>
                  <p className="text-white/70">
                    Complete la información para comenzar su asesoría
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progreso del formulario</span>
                  <span className="text-white/80 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width:`${progress}%`}}
                    transition={{duration:0.5}}
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="relative p-8 space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <User className="w-4 h-4" />
                  Nombre completo *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ingrese su nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  {name && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {nameValid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <Mail className="w-4 h-4" />
                  Correo electrónico *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  {email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <MapPin className="w-4 h-4" />
                  Ciudad (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Santiago, Valparaíso, Concepción..."
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <FileText className="w-4 h-4" />
                  Descripción de su caso (opcional)
                </label>
                <textarea
                  placeholder="Describa brevemente su situación legal..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                />
              </div>

              {/* Privacy Consent */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={ok}
                        onChange={e => setOk(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        ok 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-white/30 hover:border-white/50'
                      }`}>
                        {ok && (
                          <CheckCircle className="w-5 h-5 text-white -m-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-sm text-white/80 leading-relaxed">
                      Autorizo el uso de mis datos para contactarme y orientarme legalmente.{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacy(!showPrivacy)}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {showPrivacy ? 'Ocultar' : 'Ver'} política de privacidad
                      </button>
                    </div>
                  </label>
                  
                  <AnimatePresence>
                    {showPrivacy && (
                      <motion.div
                        initial={{height:0, opacity:0}}
                        animate={{height:'auto', opacity:1}}
                        exit={{height:0, opacity:0}}
                        className="mt-3 pt-3 border-t border-white/10 text-xs text-white/60 leading-relaxed"
                      >
                        <p>
                          <strong>DEMO:</strong> Esta es una demostración. Sus datos no serán almacenados 
                          ni utilizados para ningún propósito real. En un entorno de producción, 
                          sus datos estarían protegidos bajo las leyes de protección de datos vigentes.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Lock className="w-4 h-4" />
                  <span>Sus datos están protegidos con encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative p-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>Tiempo estimado de respuesta: 5-15 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <Shield className="w-4 h-4" />
                  <span>Conexión segura</span>
                </div>
              </div>

              <button
                disabled={disabled || isSubmitting}
                onClick={handleSubmit}
                className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
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
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
