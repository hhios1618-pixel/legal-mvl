import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, Phone, Mail, MapPin, Bell, Search } from "lucide-react";
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
    <main className="min-h-screen bg-gray-50">
      {/* App-style Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section - App Style */}
            <motion.div 
              initial={{opacity:0,x:-20}} 
              animate={{opacity:1,x:0}}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <span className="text-xl">⚖️</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Legal Chile</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Certificado • Seguro • Confiable</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation - Modern */}
            <motion.nav 
              initial={{opacity:0,y:-10}} 
              animate={{opacity:1,y:0}}
              className="hidden lg:flex items-center gap-6"
            >
              <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
                Servicios
              </a>
              <a href="#nosotros" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
                Nosotros
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
                Contacto
              </a>
              <div className="w-px h-6 bg-gray-200" />
              <a 
                href="/abogados" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Panel Abogado
              </a>
            </motion.nav>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - App Style */}
          {mobileMenuOpen && (
            <motion.div
              initial={{opacity:0,height:0}}
              animate={{opacity:1,height:'auto'}}
              exit={{opacity:0,height:0}}
              className="lg:hidden mt-4 pt-4 border-t border-gray-100"
            >
              <nav className="flex flex-col gap-2">
                <a href="#servicios" className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl font-medium">
                  Servicios
                </a>
                <a href="#nosotros" className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl font-medium">
                  Nosotros
                </a>
                <a href="#contacto" className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl font-medium">
                  Contacto
                </a>
                <a 
                  href="/abogados" 
                  className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold transition-all text-center shadow-lg"
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

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <span className="text-lg">⚖️</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Legal Chile</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-base">
                Asesoría legal inmediata y transparente. Conectamos personas con abogados 
                especializados para resolver casos de manera eficiente y confiable.
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Certificado por el Colegio de Abogados de Chile</span>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-base">Servicios</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Derecho Civil</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Derecho Laboral</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Derecho Penal</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Derecho Familiar</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-base">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <span>Santiago, Chile</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <span>+56 2 2XXX XXXX</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <span>contacto@legalchile.cl</span>
                </li>
                <li className="text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                  Lun - Vie: 9:00 - 18:00
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-500">
              © {new Date().getFullYear()} Legal Chile — Todos los derechos reservados
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Términos de Servicio</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Política de Privacidad</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

