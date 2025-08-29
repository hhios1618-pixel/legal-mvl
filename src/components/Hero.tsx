import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function Hero({ onStart }: { onStart: ()=>void }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}}
            transition={{duration:0.6}}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{opacity:0,y:10}} 
              animate={{opacity:1,y:0}}
              transition={{delay:0.2}}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Certificado por el Colegio de Abogados</span>
            </motion.div>

            {/* Main Headline */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
                Asesoría legal{" "}
                <span className="text-blue-700">inmediata</span>.{" "}
                <br className="hidden sm:block" />
                Sin letra chica.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Resuelva su caso con guía paso a paso y contacto profesional en minutos.
              </p>
            </div>

            {/* Stats Row */}
            <motion.div 
              initial={{opacity:0,y:10}} 
              animate={{opacity:1,y:0}}
              transition={{delay:0.4}}
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">Respuesta:</span>
                <span className="font-semibold text-slate-900">11 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">Casos resueltos:</span>
                <span className="font-semibold text-slate-900">+15,000</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{opacity:0,y:10}} 
              animate={{opacity:1,y:0}}
              transition={{delay:0.6}}
            >
              <button 
                onClick={onStart}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-700/25"
              >
                Comenzar ahora
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Trust Card */}
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}}
            transition={{delay:0.3, duration:0.6}}
            className="relative"
          >
            {/* Main Trust Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
                    <span className="text-lg">⚖️</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Institucional</div>
                    <div className="text-lg font-bold text-slate-900">Legal Chile</div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-700">● ACTIVO</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {[
                  "Transparencia total en procesos",
                  "Tiempos de respuesta garantizados", 
                  "Acompañamiento personalizado",
                  "Sin costos ocultos"
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{opacity:0,x:10}}
                    animate={{opacity:1,x:0}}
                    transition={{delay:0.5 + index * 0.1}}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Certification Notice */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Certificación</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plataforma certificada por el Colegio de Abogados de Chile. 
                  Todos nuestros profesionales están debidamente habilitados.
                </p>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{y:[-2,2,-2]}}
              transition={{repeat:Infinity, duration:3}}
              className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
