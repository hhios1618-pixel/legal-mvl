import React from "react";
import { motion } from "framer-motion";
import { SERVICE_LABEL, SERVICE_SUB } from "../data";
import { 
  Briefcase, Gavel, Baby, HeartCrack, Shield, Home, 
  Handshake, ScrollText, Scale, ShoppingBag, 
  Clock, TrendingUp, AlertCircle, ArrowRight, Star
} from "lucide-react";
import { ServiceType } from "../types";

const ICONS: Partial<Record<ServiceType, React.ReactNode>> = {
  dicom: <Briefcase className="w-6 h-6" />,
  embargo: <Gavel className="w-6 h-6" />,
  alimentos: <Baby className="w-6 h-6" />,
  divorcio: <HeartCrack className="w-6 h-6" />,
  vif: <Shield className="w-6 h-6" />,
  arriendo: <Home className="w-6 h-6" />,
  laboral: <Handshake className="w-6 h-6" />,
  herencias: <ScrollText className="w-6 h-6" />,
  penal: <Scale className="w-6 h-6" />,
  consumo: <ShoppingBag className="w-6 h-6" />,
};

// Metadata para cada servicio
const SERVICE_META: Partial<Record<ServiceType, {
  popular?: boolean;
  urgent?: boolean;
  timeEstimate: string;
  complexity: 'Básico' | 'Intermedio' | 'Avanzado';
  iconColor: string;
  bgGradient: string;
}>> = {
  dicom: { 
    popular: true, 
    timeEstimate: '2-3 días', 
    complexity: 'Básico',
    iconColor: 'text-blue-400',
    bgGradient: 'from-blue-500/10 to-blue-600/5'
  },
  embargo: { 
    urgent: true, 
    timeEstimate: '24-48h', 
    complexity: 'Avanzado',
    iconColor: 'text-red-400',
    bgGradient: 'from-red-500/10 to-red-600/5'
  },
  divorcio: { 
    popular: true, 
    timeEstimate: '1-2 semanas', 
    complexity: 'Intermedio',
    iconColor: 'text-purple-400',
    bgGradient: 'from-purple-500/10 to-purple-600/5'
  },
  alimentos: { 
    timeEstimate: '3-5 días', 
    complexity: 'Intermedio',
    iconColor: 'text-green-400',
    bgGradient: 'from-green-500/10 to-green-600/5'
  },
  vif: { 
    urgent: true, 
    timeEstimate: 'Inmediato', 
    complexity: 'Avanzado',
    iconColor: 'text-orange-400',
    bgGradient: 'from-orange-500/10 to-orange-600/5'
  },
  arriendo: { 
    popular: true, 
    timeEstimate: '1-3 días', 
    complexity: 'Básico',
    iconColor: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 to-cyan-600/5'
  },
  laboral: { 
    timeEstimate: '2-4 días', 
    complexity: 'Intermedio',
    iconColor: 'text-amber-400',
    bgGradient: 'from-amber-500/10 to-amber-600/5'
  },
  herencias: { 
    timeEstimate: '1-2 semanas', 
    complexity: 'Avanzado',
    iconColor: 'text-indigo-400',
    bgGradient: 'from-indigo-500/10 to-indigo-600/5'
  },
  penal: { 
    urgent: true, 
    timeEstimate: 'Inmediato', 
    complexity: 'Avanzado',
    iconColor: 'text-red-400',
    bgGradient: 'from-red-500/10 to-red-600/5'
  },
  consumo: { 
    timeEstimate: '1-2 días', 
    complexity: 'Básico',
    iconColor: 'text-teal-400',
    bgGradient: 'from-teal-500/10 to-teal-600/5'
  },
};

export default function ServiceGrid({ onPick }: { onPick: (t: ServiceType)=>void }) {
  const order: ServiceType[] = ["dicom","embargo","divorcio","alimentos","vif","arriendo","laboral","herencias","penal","consumo"];
  
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      {/* Section Header */}
      <motion.div 
        initial={{opacity:0,y:20}} 
        animate={{opacity:1,y:0}}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Servicios Legales Especializados
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Seleccione su área legal para recibir orientación inmediata y personalizada
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {order.map((serviceType, index) => {
          const meta = SERVICE_META[serviceType];
          
          return (
            <motion.button
              key={serviceType}
              initial={{opacity:0,y:30}}
              animate={{opacity:1,y:0}}
              transition={{delay:index * 0.1}}
              onClick={() => onPick(serviceType)}
              className="group relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-left hover:scale-105 hover:shadow-2xl hover:shadow-black/20"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${meta?.bgGradient || 'from-white/5 to-white/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Badges */}
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {meta?.popular && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">Popular</span>
                    </div>
                  )}
                  {meta?.urgent && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-xs font-medium text-red-400">Urgente</span>
                    </div>
                  )}
                </div>
                
                {/* Complexity Indicator */}
                <div className="flex gap-1">
                  {[1,2,3].map((level) => (
                    <div 
                      key={level}
                      className={`w-1.5 h-1.5 rounded-full ${
                        (meta?.complexity === 'Básico' && level <= 1) ||
                        (meta?.complexity === 'Intermedio' && level <= 2) ||
                        (meta?.complexity === 'Avanzado' && level <= 3)
                          ? 'bg-white/60' 
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Icon and Title */}
              <div className="relative flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-white/10 group-hover:bg-white/15 transition-colors ${meta?.iconColor || 'text-white'}`}>
                  {ICONS[serviceType]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors">
                    {SERVICE_LABEL[serviceType]}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/60">{meta?.timeEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="relative text-sm text-white/70 mb-4 leading-relaxed">
                {SERVICE_SUB[serviceType]}
              </p>

              {/* Action Row */}
              <div className="relative flex items-center justify-between">
                <span className="text-xs text-white/50 uppercase tracking-wide font-medium">
                  {meta?.complexity}
                </span>
                <div className="flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  Ver pasos
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{opacity:0,y:20}} 
        animate={{opacity:1,y:0}}
        transition={{delay:1}}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="text-sm text-white/80">
            <span className="font-semibold text-green-400">+15,000</span> casos resueltos exitosamente
          </span>
        </div>
      </motion.div>
    </section>
  );
}