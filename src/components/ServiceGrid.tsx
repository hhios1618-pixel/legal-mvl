import React from "react";
import { motion } from "framer-motion";
import { SERVICE_LABEL, SERVICE_SUB } from "../data";
import { 
  Briefcase, Gavel, Baby, HeartCrack, Shield, Home, 
  Handshake, ScrollText, Scale, ShoppingBag, 
  Clock, ArrowRight, Star, Zap,
  // --- NUEVOS ICONOS ---
  FileSpreadsheet, Repeat, Archive, Ban, Users,
  ChevronsUp, Wand2, BookOpen, ParkingCircle
} from "lucide-react";
import { ServiceType } from "../types";

// 1. AÑADIMOS ICONOS PARA LOS NUEVOS SERVICIOS
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
  liquidacion: <FileSpreadsheet className="w-6 h-6" />,
  renegociacion: <Repeat className="w-6 h-6" />,
  abandono: <Archive className="w-6 h-6" />,
  nulidad: <Ban className="w-6 h-6" />,
  familia: <Users className="w-6 h-6" />,
  recursos: <ChevronsUp className="w-6 h-6" />,
  especiales: <Wand2 className="w-6 h-6" />,
  ordinario: <BookOpen className="w-6 h-6" />,
  jpl: <ParkingCircle className="w-6 h-6" />,
};

// 2. AÑADIMOS METADATOS PARA LOS NUEVOS SERVICIOS
const SERVICE_META: Partial<Record<ServiceType, {
  popular?: boolean;
  urgent?: boolean;
  timeEstimate: string;
  iconColor: string;
  bgGradient: string;
}>> = {
  dicom: { popular: true, timeEstimate: '2-3 días', iconColor: 'text-blue-600', bgGradient: 'from-blue-50 to-blue-100' },
  embargo: { urgent: true, timeEstimate: '24-48h', iconColor: 'text-red-600', bgGradient: 'from-red-50 to-red-100' },
  divorcio: { popular: true, timeEstimate: '1-2 semanas', iconColor: 'text-purple-600', bgGradient: 'from-purple-50 to-purple-100' },
  alimentos: { timeEstimate: '3-5 días', iconColor: 'text-emerald-600', bgGradient: 'from-emerald-50 to-emerald-100' },
  vif: { urgent: true, timeEstimate: 'Inmediato', iconColor: 'text-orange-600', bgGradient: 'from-orange-50 to-orange-100' },
  arriendo: { popular: true, timeEstimate: '1-3 días', iconColor: 'text-cyan-600', bgGradient: 'from-cyan-50 to-cyan-100' },
  laboral: { timeEstimate: '2-4 días', iconColor: 'text-amber-600', bgGradient: 'from-amber-50 to-amber-100' },
  herencias: { timeEstimate: '1-2 semanas', iconColor: 'text-indigo-600', bgGradient: 'from-indigo-50 to-indigo-100' },
  penal: { urgent: true, timeEstimate: 'Inmediato', iconColor: 'text-red-600', bgGradient: 'from-red-50 to-red-100' },
  consumo: { timeEstimate: '1-2 días', iconColor: 'text-teal-600', bgGradient: 'from-teal-50 to-teal-100' },
  liquidacion: { popular: true, timeEstimate: '1-2 semanas', iconColor: 'text-blue-600', bgGradient: 'from-blue-50 to-blue-100' },
  renegociacion: { timeEstimate: '3-5 días', iconColor: 'text-emerald-600', bgGradient: 'from-emerald-50 to-emerald-100' },
  abandono: { timeEstimate: '1-2 semanas', iconColor: 'text-gray-600', bgGradient: 'from-gray-50 to-gray-100' },
  nulidad: { timeEstimate: '1-2 semanas', iconColor: 'text-orange-600', bgGradient: 'from-orange-50 to-orange-100' },
  familia: { popular: true, timeEstimate: '3-5 días', iconColor: 'text-rose-600', bgGradient: 'from-rose-50 to-rose-100' },
  recursos: { timeEstimate: '3-5 días', iconColor: 'text-indigo-600', bgGradient: 'from-indigo-50 to-indigo-100' },
  especiales: { timeEstimate: 'A definir', iconColor: 'text-purple-600', bgGradient: 'from-purple-50 to-purple-100' },
  ordinario: { timeEstimate: '1-2 semanas', iconColor: 'text-stone-600', bgGradient: 'from-stone-50 to-stone-100' },
  jpl: { timeEstimate: '3-5 días', iconColor: 'text-sky-600', bgGradient: 'from-sky-50 to-sky-100' },
};


export default function ServiceGrid({ onPick }: { onPick: (t: ServiceType)=>void }) {
  // 3. HACEMOS LA LISTA DINÁMICA: Toma todos los servicios definidos en SERVICE_LABEL
  const order = Object.keys(SERVICE_LABEL) as ServiceType[];
  
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
            const meta = SERVICE_META[serviceType] || { timeEstimate: 'A definir', iconColor: 'text-gray-600', bgGradient: 'from-gray-50 to-gray-100' };
            
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
                    {meta.popular && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-semibold">Popular</span>
                      </div>
                    )}
                    {meta.urgent && (
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
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${meta.bgGradient} group-hover:scale-110 transition-transform duration-300 ${meta.iconColor}`}>
                    {ICONS[serviceType] || <Briefcase className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-gray-900 transition-colors mb-1">
                      {SERVICE_LABEL[serviceType]}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">{meta.timeEstimate}</span>
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
      </div>
    </section>
  );
}