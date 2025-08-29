import { motion } from "framer-motion";
import { 
  Eye, Clock, Users, Shield, CheckCircle, 
  Award, Star, Lock
} from "lucide-react";

export default function TrustStrip() {
  const trustPillars = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Transparencia Total",
      description: "Antes de pagar, verá pasos, tiempos y documentos necesarios.",
      metric: "100%",
      metricLabel: "Transparencia",
      color: "blue"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Respuesta Inmediata",
      description: "Casos urgentes priorizados con tiempos garantizados.",
      metric: "11 min",
      metricLabel: "Tiempo promedio",
      color: "emerald"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Acompañamiento Real",
      description: "Guía paso a paso personalizada, sin letra chica.",
      metric: "98%",
      metricLabel: "Satisfacción",
      color: "purple"
    }
  ];

  const stats = [
    { icon: <Award className="w-4 h-4" />, value: "15,000+", label: "Casos resueltos" },
    { icon: <Star className="w-4 h-4" />, value: "4.9/5", label: "Calificación" },
    { icon: <Shield className="w-4 h-4" />, value: "2018", label: "Desde" },
    { icon: <CheckCircle className="w-4 h-4" />, value: "98%", label: "Éxito" }
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Main Trust Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{delay:index * 0.1}}
              className="group relative"
            >
              {/* Main Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                {/* Icon */}
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl ${
                    pillar.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    pillar.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {pillar.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Metric Display */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className={`text-2xl font-bold ${
                        pillar.color === 'blue' ? 'text-blue-600' :
                        pillar.color === 'emerald' ? 'text-emerald-600' :
                        'text-purple-600'
                      }`}>
                        {pillar.metric}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        {pillar.metricLabel}
                      </div>
                    </div>
                    <CheckCircle className={`w-5 h-5 ${
                      pillar.color === 'blue' ? 'text-blue-600' :
                      pillar.color === 'emerald' ? 'text-emerald-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.4}}
          className="relative"
        >
          {/* Background */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Respaldados por Resultados
              </h3>
              <p className="text-sm text-slate-600">
                Métricas que demuestran nuestro compromiso con la excelencia
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{opacity:0,scale:0.9}}
                  animate={{opacity:1,scale:1}}
                  transition={{delay:0.5 + index * 0.05}}
                  className="text-center group"
                >
                  <div className="inline-flex p-2 rounded-lg bg-white border border-slate-200 group-hover:border-slate-300 transition-colors mb-2">
                    <div className="text-slate-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.6}}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              Certificado SSL • Datos protegidos • Confidencialidad garantizada
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Información sujeta a verificación durante el proceso de consulta.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
