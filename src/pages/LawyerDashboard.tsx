import { useEffect, useState } from "react";
import { useApp } from "../store";
import { CaseStatus, LegalCase } from "../types";
import { SERVICE_LABEL } from "../data";
import { Filter, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import clsx from "clsx";

const STATUS_LABEL: Record<CaseStatus,string> = {
  new: "Nuevo", claimed: "Tomado", in_progress: "En curso", waiting_client: "Esperando cliente", closed: "Cerrado"
};

export default function LawyerDashboard() {
  const me = useApp(s=>s.me);
  const listNew = useApp(s=>s.listNewForMe);
  const listMine = useApp(s=>s.listMine);
  const claim = useApp(s=>s.claimCase);
  const update = useApp(s=>s.updateStatus);
  const reset = useApp(s=>s.reset);

  const [tab, setTab] = useState<"nuevos"|"mios">("nuevos");
  const [specialty, setSpecialty] = useState<string>("");
  const [selected, setSelected] = useState<LegalCase | null>(null);

  useEffect(()=>{ setSelected(null); }, [tab]);

  const nuevos = listNew().filter(c=>!specialty || c.type===specialty);
  const mios = listMine();
  const list = tab==="nuevos" ? nuevos : mios;

  return (
    <main className="min-h-screen bg-[#0e1330] text-white">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold">Legal Chile — Panel de Abogados (DEMO)</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/70">Hola, {me.name} · {me.specialties.join(", ")}</span>
            <button onClick={reset} className="tab">Reiniciar DEMO</button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-4">
        <div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button onClick={()=>setTab("nuevos")} className={clsx("tab", tab==="nuevos" && "tab-active")}>Nuevos</button>
            <button onClick={()=>setTab("mios")} className={clsx("tab", tab==="mios" && "tab-active")}>Mis casos</button>
            {tab==="nuevos" && (
              <div className="ml-auto flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/60"/>
                <select value={specialty} onChange={e=>setSpecialty(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm">
                  <option value="">Todas</option>
                  {me.specialties.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {list.length === 0 ? (
              <li className="text-white/60 text-sm">No hay casos en esta vista.</li>
            ) : list.map(c=>(
              <li key={c.id} className={clsx("rounded-xl border p-4 bg-white/5 border-white/10", selected?.id===c.id && "border-white/30")}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/10">{SERVICE_LABEL[c.type]}</span>
                    {c.priority===2 && <span className="text-xs px-2 py-1 rounded bg-red-500/20 border border-red-400/30">URGENTE</span>}
                    <span className="text-xs text-white/60">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-white/60">{STATUS_LABEL[c.status]}</div>
                </div>
                <div className="mt-2 text-sm">
                  <div><b>{c.name}</b>{c.city?` · ${c.city}`:""} · <a className="underline" href={`mailto:${c.email}`}>{c.email}</a></div>
                  <p className="text-white/70 mt-1">{c.description}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {tab==="nuevos" ? (
                    <button onClick={()=>{ const ok=claim(c.id); if(!ok) alert("Otro abogado lo tomó (DEMO)."); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-tr from-[#1c6bff] to-[#00c2ff] text-sm">
                      <CheckCircle2 className="w-4 h-4"/> Tomar caso
                    </button>
                  ) : (
                    <>
                      <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm"
                              value={c.status}
                              onChange={e=>update(c.id, e.target.value as any)}>
                        {Object.keys(STATUS_LABEL).map(s=><option key={s} value={s}>{STATUS_LABEL[s as CaseStatus]}</option>)}
                      </select>
                      <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-sm">
  <MessageCircle className="w-4 h-4"/> WhatsApp (DEMO)
</button>
<button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-sm">
  <Phone className="w-4 h-4"/> Llamar (DEMO)
</button>
                    </>
                  )}
                  <button onClick={()=>setSelected(c)} className="tab ml-auto">Ver detalle</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar detalle */}
        <aside className="hidden lg:block">
          <div className="glass p-4 sticky top-20">
            {!selected ? (
              <div className="text-white/60 text-sm">Seleccione un caso para ver el detalle.</div>
            ) : (
              <>
                <div className="text-sm text-white/70">Detalle</div>
                <div className="text-lg font-semibold mt-1">{selected.name}</div>
                <div className="text-xs text-white/60">{selected.city ?? "—"} · {new Date(selected.createdAt).toLocaleString()}</div>
                <div className="mt-3 text-sm">
                  <b>Servicio:</b> {SERVICE_LABEL[selected.type]}<br/>
                  <b>Prioridad:</b> {selected.priority === 2 ? "URGENTE" : "Normal"}<br/>
                  <b>Estado:</b> {STATUS_LABEL[selected.status]}
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Timeline (DEMO)</div>
                  <ul className="text-sm text-white/80 mt-1 space-y-1">
                    <li>• Ingresó hace pocos minutos</li>
                    <li>• {selected.status !== "new" ? "Tomado por usted" : "Disponible para tomar"}</li>
                    <li>• Mensaje inicial preparado</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Sugerencia (DEMO)</div>
                  <p className="text-sm text-white/70 mt-1">
                    Presente, valide identidad y solicite documentos clave. Mantenga tono claro, empático y directo.
                  </p>
                </div>
                <div className="mt-3 text-sm text-white/60">Rating abogado: 4.8 (132) · SLA: 11 min (DEMO)</div>
              </>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}