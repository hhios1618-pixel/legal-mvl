import { motion } from "framer-motion";
import { 
  Eye, Clock, Users, Shield, CheckCircle, 
  Award, FileText, MessageCircle, Star,
  TrendingUp, Lock, Zap
} from "lucide-react";

export default function TrustStrip() {
  const trustPillars = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparencia Total",
      description: "Antes de pagar, verá pasos, tiempos y documentos necesarios.",
      metric: "100%",
      metricLabel: "Transparencia",
      features: ["Sin costos ocultos", "Proceso visible", "Documentos claros"],
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Respuesta Inmediata",
      description: "Casos urgentes priorizados con tiempos garantizados.",
      metric: "11 min",
      metricLabel: "Tiempo promedio",
      features: ["Priorización inteligente", "Disponibilidad 24/7", "Respuesta garantizada"],
      color: "amber",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Acompañamiento Real",
      description: "Guía paso a paso personalizada, sin letra chica.",
      metric: "98%",
      metricLabel: "Satisfacción",
      features: ["Guía personalizada", "Soporte continuo", "Seguimiento completo"],
      color: "green",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { icon: <Award className="w-5 h-5" />, value: "15,000+", label: "Casos resueltos" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Calificación promedio" },
    { icon: <Shield className="w-5 h-5" />, value: "2018", label: "Años de experiencia" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "98%", label: "Casos exitosos" }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      {/* Main Trust Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {trustPillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{opacity:0,y:30}}
            animate={{opacity:1,y:0}}
            transition={{delay:index * 0.2}}
            className="group relative"
          >
            {/* Main Card */}
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
              {/* Background Gradient */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon with Glow */}
              <div className="relative mb-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${pillar.gradient} shadow-lg`}>
                  <div className="text-white">
                    {pillar.icon}
                  </div>
                </div>
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.gradient} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              </div>

              {/* Content */}
              <div className="relative space-y-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Metric Display */}
                <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-center">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${pillar.gradient} bg-clip-text text-transparent`}>
                      {pillar.metric}
                    </div>
                    <div className="text-xs text-white/60 uppercase tracking-wide">
                      {pillar.metricLabel}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {pillar.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 text-${pillar.color}-400`} />
                          <span className="text-sm text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${pillar.gradient}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.8}}
        className="relative"
      >
        {/* Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-900/50 via-blue-900/20 to-slate-900/50" />
        <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10" />
        
        {/* Content */}
        <div className="relative p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Respaldados por Resultados
            </h3>
            <p className="text-white/70">
              Métricas que demuestran nuestro compromiso con la excelencia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{opacity:0,scale:0.8}}
                animate={{opacity:1,scale:1}}
                transition={{delay:1 + index * 0.1}}
                className="text-center group"
              >
                <div className="inline-flex p-3 rounded-2xl bg-white/10 group-hover:bg-white/15 transition-colors mb-3">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wide">
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
        transition={{delay:1.2}}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
          <Lock className="w-5 h-5 text-green-400" />
          <span className="text-sm text-green-400 font-medium">
            Certificado SSL • Datos protegidos • Confidencialidad garantizada
          </span>
        </div>
        <p className="text-xs text-white/50 mt-3">
          Esta es una demostración. Los datos y métricas son referenciales.
        </p>
      </motion.div>
    </section>
  );
}