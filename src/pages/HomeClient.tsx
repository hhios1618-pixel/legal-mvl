import { useState } from "react";
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
  const create = useApp(s=>s.createIntake);

  const start = () => window.scrollTo({ top: document.body.clientHeight/4, behavior:"smooth" });

  return (
    <main>
      <header className="sticky top-0 z-30 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/10 grid place-content-center">⚖️</div>
            <span className="font-bold tracking-wide">Legal Chile</span>
            <span className="badge hidden sm:inline">DEMO</span>
          </div>
          <a className="btn btn-ghost hidden sm:inline-flex" href="/abogados">Panel Abogado</a>
        </div>
      </header>

      <Hero onStart={start}/>
      <ServiceGrid onPick={(t)=>{ setPick(t); setOpenIntake(true); }}/>
      <TrustStrip/>

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
      <StepsOverlay open={openSteps} type={pick} onClose={()=>setOpenSteps(false)} slaStartMs={slaStart}/>
      <footer className="border-t border-white/10 py-8 text-center text-white/60">© {new Date().getFullYear()} Legal Chile — DEMO</footer>
    </main>
  );
}