import React from "react";
import { motion } from "framer-motion";
import { SERVICE_LABEL, SERVICE_SUB } from "../data";
import { 
  Briefcase, Gavel, Baby, HeartCrack, Shield, Home, 
  Handshake, ScrollText, Scale, ShoppingBag, 
  Clock, AlertTriangle, ArrowRight, Star, Zap
} from "lucide-react";
import { ServiceType } from "../types";

const ICONS: Partial<Record<ServiceType, React.ReactNode>> = {
  societario: <Briefcase className="w-6 h-6" />,
  contratos: <ScrollText className="w-6 h-6" />,
  compliance: <Shield className="w-6 h-6" />,
  pi: <Star className="w-6 h-6" />,
  laboral: <Handshake className="w-6 h-6" />,
  litigios: <Scale className="w-6 h-6" />,
  ma: <Zap className="w-6 h-6" />,
  tributario: <ShoppingBag className="w-6 h-6" />,
};

// Metadata simplificada y profesional
const SERVICE_META: Partial<Record<ServiceType, {
  popular?: boolean;
  urgent?: boolean;
  timeEstimate: string;
  iconColor: string;
  bgGradient: string;
}>> = {
  societario: { 
    popular: true, 
    timeEstimate: '2-3 semanas', 
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100'
  },
  contratos: { 
    popular: true, 
    timeEstimate: '1-2 semanas', 
    iconColor: 'text-green-600',
    bgGradient: 'from-green-50 to-green-100'
  },
  compliance: { 
    timeEstimate: '3-4 semanas', 
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100'
  },
  pi: { 
    timeEstimate: '2-6 meses', 
    iconColor: 'text-pink-600',
    bgGradient: 'from-pink-50 to-pink-100'
  },
  laboral: { 
    popular: true, 
    timeEstimate: '1-3 semanas', 
    iconColor: 'text-orange-600',
    bgGradient: 'from-orange-50 to-orange-100'
  },
  litigios: { 
    urgent: true, 
    timeEstimate: '1-6 meses', 
    iconColor: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100'
  },
  ma: { 
    timeEstimate: '2-4 meses', 
    iconColor: 'text-indigo-600',
    bgGradient: 'from-indigo-50 to-indigo-100'
  },
  tributario: { 
    timeEstimate: '2-4 semanas', 
    iconColor: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100'
  },
};

export default function ServiceGrid({ onPick }: { onPick: (t: ServiceType)=>void }) {
  const order: ServiceType[] = ["societario","contratos","compliance","pi","laboral","litigios","ma","tributario"];
  
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Section Header */}
        <motion.div 
          initial={{opacity:0,y:30}} 
          animate={{opacity:1,y:0}}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Servicios Legales Especializados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seleccione su área legal para recibir orientación inmediata y personalizada
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.map((serviceType, index) => {
            const meta = SERVICE_META[serviceType];
            
            return (
              <motion.button
                key={serviceType}
                initial={{opacity:0,y:30}}
                animate={{opacity:1,y:0}}
                transition={{delay:index * 0.08}}
                onClick={() => onPick(serviceType)}
                className="group relative p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-xl transition-all duration-300 text-left hover:scale-105"
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    {meta?.popular && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-semibold">Popular</span>
                      </div>
                    )}
                    {meta?.urgent && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
                        <Zap className="w-3 h-3" />
                        <span className="text-xs font-semibold">Urgente</span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${meta?.bgGradient} group-hover:scale-110 transition-transform duration-300 ${meta?.iconColor || 'text-gray-600'}`}>
                    {ICONS[serviceType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-gray-900 transition-colors mb-1">
                      {SERVICE_LABEL[serviceType]}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">{meta?.timeEstimate}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {SERVICE_SUB[serviceType]}
                </p>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{opacity:0,y:30}} 
          animate={{opacity:1,y:0}}
          transition={{delay:0.8}}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-gray-200 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base text-gray-700">
              <span className="font-bold text-emerald-600">+15,000</span> casos resueltos exitosamente
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

