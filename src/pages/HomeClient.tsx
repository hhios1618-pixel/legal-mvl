import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, Phone, Mail, MapPin } from "lucide-react";
import Hero from "../components/Hero";
import ServiceGrid from "../components/ServiceGrid";
import IntakeModal from "../components/IntakeModal";
import StepsOverlay from "../components/StepsOverlay";
import TrustStrip from "../components/TrustStrip";
import { ServiceType } from "../types";
import { useApp } from "../store";

export default function HomeClient() {
  const [pick, setPick] = useState<ServiceType | null>(null);
  const [openIntake, setOpenIntake] = useState(false);
  const [openSteps, setOpenSteps] = useState(false);
  const [slaStart, setSlaStart] = useState<number>(Date.now());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const create = useApp(s=>s.createIntake);

  const start = () => window.scrollTo({ top: document.body.clientHeight/4, behavior:"smooth" });

  return (
    <main className="min-h-screen bg-white">
      {/* Corporate Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <motion.div 
              initial={{opacity:0,x:-20}} 
              animate={{opacity:1,x:0}}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
                  <span className="text-lg">⚖️</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">Legal Chile</span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-3 h-3" />
                  <span>Certificado • Seguro • Confiable</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav 
              initial={{opacity:0,y:-10}} 
              animate={{opacity:1,y:0}}
              className="hidden lg:flex items-center gap-8"
            >
              <a href="#servicios" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Servicios
              </a>
              <a href="#nosotros" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Nosotros
              </a>
              <a href="#contacto" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Contacto
              </a>
              <div className="w-px h-5 bg-slate-300" />
              <a 
                href="/abogados" 
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-all duration-200 text-sm"
              >
                Panel Abogado
              </a>
            </motion.nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{opacity:0,height:0}}
              animate={{opacity:1,height:'auto'}}
              exit={{opacity:0,height:0}}
              className="lg:hidden mt-4 pt-4 border-t border-slate-200"
            >
              <nav className="flex flex-col gap-3">
                <a href="#servicios" className="text-slate-600 hover:text-slate-900 transition-colors py-2 text-sm">
                  Servicios
                </a>
                <a href="#nosotros" className="text-slate-600 hover:text-slate-900 transition-colors py-2 text-sm">
                  Nosotros
                </a>
                <a href="#contacto" className="text-slate-600 hover:text-slate-900 transition-colors py-2 text-sm">
                  Contacto
                </a>
                <a 
                  href="/abogados" 
                  className="mt-2 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-all text-center text-sm"
                >
                  Panel Abogado
                </a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative">
        <Hero onStart={start}/>
        <div id="servicios">
          <ServiceGrid onPick={(t)=>{ setPick(t); setOpenIntake(true); }}/>
        </div>
        <TrustStrip/>
      </div>

      {/* Modals */}
      <IntakeModal
        open={openIntake}
        type={pick}
        onClose={()=>setOpenIntake(false)}
        onSubmit={(p)=>{
          create(p);
          setOpenIntake(false);
          setSlaStart(Date.now());
          setOpenSteps(true);
        }}
      />
      
      <StepsOverlay 
        open={openSteps} 
        type={pick} 
        onClose={()=>setOpenSteps(false)} 
        slaStartMs={slaStart}
      />

      {/* Corporate Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
                  <span className="text-sm">⚖️</span>
                </div>
                <span className="text-lg font-bold text-slate-900">Legal Chile</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                Asesoría legal inmediata y transparente. Conectamos personas con abogados 
                especializados para resolver casos de manera eficiente y confiable.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Certificado por el Colegio de Abogados de Chile</span>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Servicios</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Derecho Civil</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Derecho Laboral</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Derecho Penal</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Derecho Familiar</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Contacto</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Santiago, Chile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+56 2 2XXX XXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contacto@legalchile.cl</span>
                </li>
                <li className="text-slate-500">Lun - Vie: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Legal Chile — Todos los derechos reservados
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">Términos de Servicio</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}