import { create } from "zustand";

export type GamePhase =
  | "select"
  | "flight"
  | "coast"
  | "orbit"
  | "targetLocked"
  | "descent"
  | "touchdown"
  | "stepOut"
  | "explore"
  | "inspect"
  | "flagReady"
  | "flagPlanted"
  | "launch"
  | "report";

export type GameEvent =
  | "LAUNCH_MISSION"
  | "START_COAST"
  | "REACH_ORBIT"
  | "LOCK_TARGET"
  | "BEGIN_DESCENT"
  | "TOUCH_DOWN"
  | "OPEN_HATCH"
  | "STEP_OUT"
  | "SKIP_TO_SURFACE"
  | "START_INSPECT"
  | "EXIT_INSPECT"
  | "ALL_FOUND"
  | "PLANT_FLAG"
  | "LAUNCH_HOME"
  | "SHOW_REPORT"
  | "BACK_TO_SELECT";

const TRANSITIONS: Record<GamePhase, Partial<Record<GameEvent, GamePhase>>> = {
  select: { LAUNCH_MISSION: "flight" },
  flight: { START_COAST: "coast", SKIP_TO_SURFACE: "explore" },
  coast: { REACH_ORBIT: "orbit", SKIP_TO_SURFACE: "explore" },
  orbit: { LOCK_TARGET: "targetLocked", SKIP_TO_SURFACE: "explore" },
  targetLocked: { BEGIN_DESCENT: "descent", SKIP_TO_SURFACE: "explore" },
  descent: { TOUCH_DOWN: "touchdown", SKIP_TO_SURFACE: "explore" },
  touchdown: { OPEN_HATCH: "stepOut", SKIP_TO_SURFACE: "explore" },
  stepOut: { STEP_OUT: "explore", SKIP_TO_SURFACE: "explore" },
  explore: { START_INSPECT: "inspect", ALL_FOUND: "flagReady" },
  inspect: { EXIT_INSPECT: "explore" },
  flagReady: { START_INSPECT: "inspect", PLANT_FLAG: "flagPlanted" },
  flagPlanted: { LAUNCH_HOME: "launch" },
  launch: { SHOW_REPORT: "report" },
  report: { BACK_TO_SELECT: "select" },
};

interface InspectState {
  objectId: string | null;
}

interface GameState {
  phase: GamePhase;
  missionId: string | null;
  inspecting: InspectState;
  objectsFoundThisRun: string[];
  flightBeatIndex: number;

  send: (event: GameEvent, payload?: Record<string, string>) => void;
  setMission: (id: string) => void;
  addFoundObject: (id: string) => void;
  setFlightBeat: (index: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>()((set, get) => ({
  phase: "select",
  missionId: null,
  inspecting: { objectId: null },
  objectsFoundThisRun: [],
  flightBeatIndex: 0,

  send: (event, payload) => {
    const { phase } = get();
    const phaseTransitions = TRANSITIONS[phase];
    const nextPhase = phaseTransitions[event];

    if (!nextPhase) {
      console.warn(`[GameStore] No transition: ${phase} + ${event}`);
      return;
    }

    const updates: Partial<GameState> = { phase: nextPhase };

    if (event === "START_INSPECT" && payload?.objectId) {
      updates.inspecting = { objectId: payload.objectId };
    }
    if (event === "EXIT_INSPECT") {
      updates.inspecting = { objectId: null };
    }
    if (event === "BACK_TO_SELECT") {
      updates.missionId = null;
      updates.objectsFoundThisRun = [];
      updates.flightBeatIndex = 0;
    }

    set(updates);
  },

  setMission: (id) => set({ missionId: id }),
  addFoundObject: (id) =>
    set((s) => {
      if (s.objectsFoundThisRun.includes(id)) return s;
      return { objectsFoundThisRun: [...s.objectsFoundThisRun, id] };
    }),
  setFlightBeat: (index) => set({ flightBeatIndex: index }),
  reset: () =>
    set({
      phase: "select",
      missionId: null,
      inspecting: { objectId: null },
      objectsFoundThisRun: [],
      flightBeatIndex: 0,
    }),
}));

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__game = {
    get store() {
      return useGameStore.getState();
    },
    send: (event: GameEvent, payload?: Record<string, string>) =>
      useGameStore.getState().send(event, payload),
    teleport: (_x: number, _z: number) => {
      console.log("[__game] teleport not yet wired to character controller");
    },
  };
}
