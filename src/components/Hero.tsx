import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle, ArrowRight, Star, Users } from "lucide-react";

export default function Hero({ onStart }: { onStart: ()=>void }) {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-600"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-400"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-blue-300"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div 
            initial={{opacity:0,y:30}} 
            animate={{opacity:1,y:0}}
            transition={{duration:0.8}}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{opacity:0,scale:0.9}} 
              animate={{opacity:1,scale:1}}
              transition={{delay:0.2}}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white border border-blue-100 shadow-sm"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Certificado por el Colegio de Abogados</span>
            </motion.div>

            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Asesoría legal{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">inmediata</span>.{" "}
                <br className="hidden sm:block" />
                Sin letra chica.
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Resuelva su caso con guía paso a paso y contacto profesional en minutos.
              </p>
            </div>

            {/* Stats Row */}
            <motion.div 
              initial={{opacity:0,y:20}} 
              animate={{opacity:1,y:0}}
              transition={{delay:0.4}}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Respuesta</span>
                </div>
                <span className="text-xl font-bold text-gray-900">11 min</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Casos</span>
                </div>
                <span className="text-xl font-bold text-gray-900">+15K</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="text-xl font-bold text-gray-900">4.9/5</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{opacity:0,y:20}} 
              animate={{opacity:1,y:0}}
              transition={{delay:0.6}}
              className="space-y-4"
            >
              <button 
                onClick={onStart}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/25 hover:scale-105"
              >
                Comenzar ahora
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-sm text-gray-500">
                ✓ Sin registro previo • ✓ Respuesta garantizada • ✓ 100% seguro
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - App Preview Card */}
          <motion.div 
            initial={{opacity:0,y:30}} 
            animate={{opacity:1,y:0}}
            transition={{delay:0.3, duration:0.8}}
            className="relative"
          >
            {/* Main App Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Plataforma</div>
                    <div className="text-xl font-bold text-gray-900">Legal Chile</div>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-700">● EN LÍNEA</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Shield, text: "Transparencia total en procesos", color: "text-blue-600" },
                  { icon: Clock, text: "Tiempos de respuesta garantizados", color: "text-emerald-600" }, 
                  { icon: Users, text: "Acompañamiento personalizado", color: "text-purple-600" },
                  { icon: CheckCircle, text: "Sin costos ocultos", color: "text-green-600" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{opacity:0,x:20}}
                    animate={{opacity:1,x:0}}
                    transition={{delay:0.5 + index * 0.1}}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Certification Notice */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Certificación Oficial</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Plataforma certificada por el Colegio de Abogados de Chile. 
                  Todos nuestros profesionales están debidamente habilitados.
                </p>
              </div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{y:[-3,3,-3]}}
              transition={{repeat:Infinity, duration:4}}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{y:[3,-3,3]}}
              transition={{repeat:Infinity, duration:3}}
              className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
            >
              <Star className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

