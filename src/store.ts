import { create } from "zustand";
import { LegalCase, Lawyer, CaseStatus, ServiceType } from "./types";
import { SEED_CASES, SEED_LAWYERS } from "./data";

type AppState = {
  cases: LegalCase[];
  lawyers: Lawyer[];
  me: Lawyer; // abogado “logueado” en demo
  reset: () => void;

  // CLIENTE
  createIntake: (payload: {
    type: ServiceType; name: string; email: string; city?: string; description?: string; urgent?: boolean;
  }) => LegalCase;

  // ABOGADO
  listNewForMe: () => LegalCase[];
  listMine: () => LegalCase[];
  claimCase: (caseId: string) => boolean;
  updateStatus: (caseId: string, status: CaseStatus) => void;
};

const seed = () => ({
  cases: JSON.parse(JSON.stringify(SEED_CASES)) as LegalCase[],
  lawyers: JSON.parse(JSON.stringify(SEED_LAWYERS)) as Lawyer[],
});

export const useApp = create<AppState>((set, get) => {
  const { cases, lawyers } = seed();
  return {
    cases, lawyers,
    me: lawyers[0], // María por defecto
    reset: () => {
      const s = seed();
      set({ cases: s.cases, lawyers: s.lawyers });
    },
    createIntake: ({ type, name, email, city, description, urgent }) => {
      const c: LegalCase = {
        id: "cx" + Math.random().toString(36).slice(2, 9),
        createdAt: Date.now(),
        type, priority: urgent ? 2 : 1,
        name, email, city, description,
        status: "new",
      };
      set({ cases: [c, ...get().cases] });
      return c;
    },
    listNewForMe: () => {
      const me = get().me;
      return get().cases
        .filter(c => c.status === "new" && me.specialties.includes(c.type))
        .sort((a,b)=> (b.priority - a.priority) || (a.createdAt - b.createdAt));
    },
    listMine: () => {
      const me = get().me;
      return get().cases
        .filter(c => c.assignedLawyerId === me.id)
        .sort((a,b)=> b.createdAt - a.createdAt);
    },
    claimCase: (caseId: string) => {
      const me = get().me;
      const all = get().cases.slice();
      const idx = all.findIndex(c=>c.id===caseId);
      if (idx<0) return false;
      const c = all[idx];
      if (c.status !== "new" || c.assignedLawyerId) return false;
      c.assignedLawyerId = me.id;
      c.status = "claimed";
      set({ cases: all });
      return true;
    },
    updateStatus: (caseId, status) => {
      const all = get().cases.slice();
      const idx = all.findIndex(c=>c.id===caseId);
      if (idx<0) return;
      all[idx].status = status;
      set({ cases: all });
    },
  };
});