import { motion } from "framer-motion";
import { 
  Eye, Clock, Users, Shield, CheckCircle, 
  Award, Star, Lock, Zap, Target
} from "lucide-react";

export default function TrustStrip() {
  const trustPillars = [
    {
      icon: <Eye className="w-7 h-7" />,
      title: "Transparencia Total",
      description: "Antes de pagar, verá pasos, tiempos y documentos necesarios.",
      metric: "100%",
      metricLabel: "Transparencia",
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Respuesta Inmediata",
      description: "Casos urgentes priorizados con tiempos garantizados.",
      metric: "11 min",
      metricLabel: "Tiempo promedio",
      color: "emerald",
      bgGradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Acompañamiento Real",
      description: "Guía paso a paso personalizada, sin letra chica.",
      metric: "98%",
      metricLabel: "Satisfacción",
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { icon: <Award className="w-5 h-5" />, value: "15,000+", label: "Casos resueltos", color: "text-blue-600" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Calificación", color: "text-yellow-500" },
    { icon: <Shield className="w-5 h-5" />, value: "2018", label: "Desde", color: "text-emerald-600" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "98%", label: "Éxito", color: "text-purple-600" }
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Main Trust Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{opacity:0,y:40}}
              animate={{opacity:1,y:0}}
              transition={{delay:index * 0.15}}
              className="group relative"
            >
              {/* Main Card */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pillar.bgGradient} opacity-5 rounded-full -translate-y-16 translate-x-16`} />
                
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${pillar.bgGradient} text-white shadow-lg`}>
                    {pillar.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Metric Display */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${pillar.bgGradient} bg-clip-text text-transparent`}>
                        {pillar.metric}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {pillar.metricLabel}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.bgGradient} flex items-center justify-center shadow-lg`}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.5}}
          className="relative"
        >
          {/* Background */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-3xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-blue-500"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-purple-500"></div>
            </div>
            
            <div className="text-center mb-8 relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Respaldados por Resultados
              </h3>
              <p className="text-gray-600 text-lg">
                Métricas que demuestran nuestro compromiso con la excelencia
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{opacity:0,scale:0.8}}
                  animate={{opacity:1,scale:1}}
                  transition={{delay:0.6 + index * 0.1}}
                  className="text-center group"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-white border border-gray-200 group-hover:border-gray-300 group-hover:shadow-lg transition-all duration-300 mb-3">
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.8}}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-emerald-700 font-semibold">
              Certificado SSL • Datos protegidos • Confidencialidad garantizada
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Información sujeta a verificación durante el proceso de consulta.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

