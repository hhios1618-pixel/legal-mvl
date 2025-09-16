// src/store.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LegalCase, Lawyer, CaseStatus, ServiceType, CaseNotes, Message } from "./types";
import { SEED_CASES, SEED_LAWYERS, WORKFLOWS } from "./data";

const initialState = {
  cases: SEED_CASES,
  lawyers: SEED_LAWYERS,
  me: SEED_LAWYERS[0],
  myCaseIds: [],
};

type AppState = {
  cases: LegalCase[];
  lawyers: Lawyer[];
  me: Lawyer;
  myCaseIds: string[];
  reset: () => void;
  createIntake: (payload: {
    type: ServiceType; name: string; email: string; city?: string; description?: string; urgent?: boolean;
  }) => LegalCase;
  claimCase: (caseId: string) => void;
  updateStatus: (caseId: string, status: CaseStatus) => void;
  addPrivateNote: (caseId: string, phaseName: string, note: string) => void;
  postPublicMessage: (caseId: string, phaseName: string, message: Message) => void;
  setCurrentPhase: (caseId: string, phaseName: string) => void;
  toggleActivityCompleted: (caseId: string, activityName: string) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => {
        localStorage.removeItem('legal-app-storage');
        window.location.reload();
      },
      createIntake: ({ type, name, email, city, description, urgent }) => {
        const c: LegalCase = {
          id: "cx" + Math.random().toString(36).slice(2, 9),
          createdAt: Date.now(),
          type, 
          priority: urgent ? 2 : 1,
          name, 
          email, 
          city, 
          description,
          status: "new",
          notes: {},
          currentPhaseName: WORKFLOWS[type]?.phases[0]?.name || '',
          completedActivities: {},
        };
        set(state => ({ 
          cases: [c, ...state.cases],
          myCaseIds: [...state.myCaseIds, c.id] 
        }));
        return c;
      },
      claimCase: (caseId: string) => {
        set(state => ({
          cases: state.cases.map(c => 
            (c.id === caseId && c.status === 'new' && !c.assignedLawyerId) 
              ? { ...c, status: 'claimed', assignedLawyerId: get().me.id } 
              : c
          ),
        }));
      },
      updateStatus: (caseId, status) => {
        set(state => ({
          cases: state.cases.map(c =>
            c.id === caseId ? { ...c, status } : c
          ),
        }));
      },
      addPrivateNote: (caseId, phaseName, note) => {
        set(state => ({
          cases: state.cases.map(c => {
            if (c.id === caseId) {
              const newNotes = { ...c.notes };
              newNotes[phaseName] = { 
                ...newNotes[phaseName], 
                private: { text: note, date: Date.now() } 
              };
              return { ...c, notes: newNotes };
            }
            return c;
          }),
        }));
      },
      postPublicMessage: (caseId, phaseName, message) => {
        set(state => ({
          cases: state.cases.map(c => {
            if (c.id === caseId) {
              const newNotes = { ...c.notes };
              const currentPublicNotes = newNotes[phaseName]?.public || [];
              newNotes[phaseName] = { 
                ...newNotes[phaseName], 
                public: [...currentPublicNotes, message] 
              };
              return { ...c, notes: newNotes };
            }
            return c;
          }),
        }));
      },
      setCurrentPhase: (caseId, phaseName) => {
        set(state => ({
          cases: state.cases.map(c => 
            c.id === caseId ? { ...c, currentPhaseName: phaseName } : c
          ),
        }));
      },
      toggleActivityCompleted: (caseId, activityName) => {
        set(state => ({
          cases: state.cases.map(c => {
            if (c.id === caseId) {
              const newCompleted = { ...c.completedActivities };
              if (newCompleted[activityName]) {
                delete newCompleted[activityName];
              } else {
                newCompleted[activityName] = Date.now();
              }
              return { ...c, completedActivities: newCompleted };
            }
            return c;
          }),
        }));
      },
    }),
    {
      name: 'legal-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cases: state.cases, myCaseIds: state.myCaseIds }),
    }
  )
);