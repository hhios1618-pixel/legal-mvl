import { motion } from "framer-motion";
import { Shield, Clock, Users, Award, CheckCircle } from "lucide-react";

export default function Hero({ onStart }: { onStart: ()=>void }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-slate-900/50 rounded-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="relative grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{opacity:0,y:30}} 
          animate={{opacity:1,y:0}}
          transition={{duration:0.8}}
          className="space-y-8"
        >
          {/* Trust Badge */}
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}}
            transition={{delay:0.2}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">Certificado por el Colegio de Abogados</span>
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
              Asesoría legal{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent">
                  inmediata
                </span>
                <motion.div
                  initial={{scaleX:0}}
                  animate={{scaleX:1}}
                  transition={{delay:1, duration:0.8}}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                />
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light leading-relaxed max-w-2xl">
              Resuelva su caso con guía paso a paso y contacto profesional en minutos. 
              <span className="text-white font-medium"> Sin letra chica.</span>
            </p>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}}
            transition={{delay:0.4}}
            className="flex flex-wrap gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-white/70">Respuesta promedio:</span>
              <span className="font-bold text-amber-400">11 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white/70">Casos resueltos:</span>
              <span className="font-bold text-blue-400">+15,000</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-white/70">Desde:</span>
              <span className="font-bold text-white">2018</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}}
            transition={{delay:0.6}}
          >
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10 flex items-center gap-2">
                Comenzar ahora
                <motion.div
                  animate={{x:[0,4,0]}}
                  transition={{repeat:Infinity, duration:1.5}}
                >
                  →
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-amber-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column - Trust Card */}
        <motion.div 
          initial={{opacity:0,y:30}} 
          animate={{opacity:1,y:0}}
          transition={{delay:0.3, duration:0.8}}
          className="relative"
        >
          {/* Main Trust Card */}
          <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  ⚖️
                </div>
                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Institucional</div>
                  <div className="text-2xl font-bold text-white">Legal Chile</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-xs font-medium text-green-400">● ACTIVO</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-6">
              {[
                "Transparencia total en procesos",
                "Tiempos de respuesta garantizados", 
                "Acompañamiento personalizado",
                "Sin costos ocultos"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{opacity:0,x:20}}
                  animate={{opacity:1,x:0}}
                  transition={{delay:0.5 + index * 0.1}}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Demo Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm font-medium text-amber-400">DEMO</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Esta es una demostración 100% simulada para mostrar la experiencia de usuario. 
                Los tiempos y procesos son referenciales.
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{y:[-10,10,-10]}}
            transition={{repeat:Infinity, duration:4}}
            className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg"
          >
            <Award className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            animate={{y:[10,-10,10]}}
            transition={{repeat:Infinity, duration:3}}
            className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
