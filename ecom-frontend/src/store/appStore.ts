import { create } from "zustand";

export type AppInitPhase = "idle" | "authCheck" | "ready" | "public" | "error";

interface AppState {
  initPhase: AppInitPhase;
  phaseMessage?: string;
  setInitPhase: (phase: AppInitPhase, phaseMessage?: string) => void;
  resetInitPhase: (phase?: AppInitPhase) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // === App Initialization Phase Properties start===
  initPhase: "idle",
  phaseMessage: undefined,
  setInitPhase: (phase, phaseMessage) =>
    set({ initPhase: phase, phaseMessage }),
  resetInitPhase: (phase = "idle") =>
    set({ initPhase: phase, phaseMessage: undefined }),
  // === App Initialization Phase Properties end===
}));

export const isBlockingPhase = (phase: AppInitPhase) =>
  phase === "idle" || phase === "authCheck";
