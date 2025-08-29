import React from "react";
import { motion } from "framer-motion";
import { SERVICE_LABEL, SERVICE_SUB } from "../data";
import { 
  Briefcase, Gavel, Baby, HeartCrack, Shield, Home, 
  Handshake, ScrollText, Scale, ShoppingBag, 
  Clock, AlertTriangle, ArrowRight, Star
} from "lucide-react";
import { ServiceType } from "../types";

const ICONS: Partial<Record<ServiceType, React.ReactNode>> = {
  dicom: <Briefcase className="w-5 h-5" />,
  embargo: <Gavel className="w-5 h-5" />,
  alimentos: <Baby className="w-5 h-5" />,
  divorcio: <HeartCrack className="w-5 h-5" />,
  vif: <Shield className="w-5 h-5" />,
  arriendo: <Home className="w-5 h-5" />,
  laboral: <Handshake className="w-5 h-5" />,
  herencias: <ScrollText className="w-5 h-5" />,
  penal: <Scale className="w-5 h-5" />,
  consumo: <ShoppingBag className="w-5 h-5" />,
};

// Metadata simplificada y profesional
const SERVICE_META: Partial<Record<ServiceType, {
  popular?: boolean;
  urgent?: boolean;
  timeEstimate: string;
  iconColor: string;
}>> = {
  dicom: { 
    popular: true, 
    timeEstimate: '2-3 días', 
    iconColor: 'text-blue-600'
  },
  embargo: { 
    urgent: true, 
    timeEstimate: '24-48h', 
    iconColor: 'text-red-600'
  },
  divorcio: { 
    popular: true, 
    timeEstimate: '1-2 semanas', 
    iconColor: 'text-purple-600'
  },
  alimentos: { 
    timeEstimate: '3-5 días', 
    iconColor: 'text-emerald-600'
  },
  vif: { 
    urgent: true, 
    timeEstimate: 'Inmediato', 
    iconColor: 'text-orange-600'
  },
  arriendo: { 
    popular: true, 
    timeEstimate: '1-3 días', 
    iconColor: 'text-cyan-600'
  },
  laboral: { 
    timeEstimate: '2-4 días', 
    iconColor: 'text-amber-600'
  },
  herencias: { 
    timeEstimate: '1-2 semanas', 
    iconColor: 'text-indigo-600'
  },
  penal: { 
    urgent: true, 
    timeEstimate: 'Inmediato', 
    iconColor: 'text-red-600'
  },
  consumo: { 
    timeEstimate: '1-2 días', 
    iconColor: 'text-teal-600'
  },
};

export default function ServiceGrid({ onPick }: { onPick: (t: ServiceType)=>void }) {
  const order: ServiceType[] = ["dicom","embargo","divorcio","alimentos","vif","arriendo","laboral","herencias","penal","consumo"];
  
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Section Header */}
        <motion.div 
          initial={{opacity:0,y:20}} 
          animate={{opacity:1,y:0}}
          className="text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Servicios Legales Especializados
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Seleccione su área legal para recibir orientación inmediata y personalizada
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.map((serviceType, index) => {
            const meta = SERVICE_META[serviceType];
            
            return (
              <motion.button
                key={serviceType}
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay:index * 0.05}}
                onClick={() => onPick(serviceType)}
                className="group relative p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left"
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    {meta?.popular && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                        <Star className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Popular</span>
                      </div>
                    )}
                    {meta?.urgent && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-medium text-red-700">Urgente</span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors ${meta?.iconColor || 'text-slate-600'}`}>
                    {ICONS[serviceType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-slate-900 transition-colors">
                      {SERVICE_LABEL[serviceType]}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{meta?.timeEstimate}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {SERVICE_SUB[serviceType]}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{opacity:0,y:20}} 
          animate={{opacity:1,y:0}}
          transition={{delay:0.6}}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-700">
              <span className="font-semibold text-emerald-600">+15,000</span> casos resueltos exitosamente
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}