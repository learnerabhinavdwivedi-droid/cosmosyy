import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Quality = "low" | "medium" | "high";
export type MissionStatus = "locked" | "available" | "in-progress" | "completed";

export interface MissionProgress {
  status: MissionStatus;
  xp: number;
  flagPlanted: boolean;
  objectsFound: string[];
}

interface PlayerState {
  name: string;
}

interface SettingsState {
  volume: number;
  captions: boolean;
  quality: Quality;
  reducedMotion: boolean;
}

interface ProgressState {
  missions: Record<string, MissionProgress>;
  totalXp: number;
}

interface SessionState {
  demoMode: boolean;
}

interface AppState {
  player: PlayerState;
  settings: SettingsState;
  progress: ProgressState;
  session: SessionState;

  setPlayerName: (name: string) => void;
  setSetting: <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => void;
  addXp: (missionId: string, amount: number) => void;
  findObject: (missionId: string, objectId: string) => void;
  plantFlag: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  startMission: (missionId: string) => void;
  setDemoMode: (on: boolean) => void;
  getRank: () => "Cadet" | "Pilot" | "Commander";
}

const DEFAULT_MISSIONS: Record<string, MissionProgress> = {
  "apollo-11": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-12": { status: "locked", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-14": { status: "locked", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-15": { status: "locked", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-16": { status: "locked", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-17": { status: "locked", xp: 0, flagPlanted: false, objectsFound: [] },
};

export const XP_LAND = 50;
export const XP_OBJECT = 50;
export const XP_FLAG = 100;
export const XP_COMPLETE = 100;

export const MISSION_ORDER = [
  "apollo-11", "apollo-12", "apollo-14",
  "apollo-15", "apollo-16", "apollo-17",
];

export function getNextMissionId(currentId: string): string | null {
  const idx = MISSION_ORDER.indexOf(currentId);
  if (idx >= 0 && idx < MISSION_ORDER.length - 1) return MISSION_ORDER[idx + 1] ?? null;
  return null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      player: { name: "" },
      settings: {
        volume: 0.8,
        captions: true,
        quality: "medium",
        reducedMotion: false,
      },
      progress: {
        missions: { ...DEFAULT_MISSIONS },
        totalXp: 0,
      },
      session: { demoMode: false },

      setPlayerName: (name) =>
        set((s) => ({ player: { ...s.player, name } })),

      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      addXp: (missionId, amount) =>
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission) return s;
          return {
            progress: {
              ...s.progress,
              totalXp: s.progress.totalXp + amount,
              missions: {
                ...s.progress.missions,
                [missionId]: { ...mission, xp: mission.xp + amount },
              },
            },
          };
        }),

      findObject: (missionId, objectId) =>
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission) return s;
          if (mission.objectsFound.includes(objectId)) return s;
          return {
            progress: {
              ...s.progress,
              totalXp: s.progress.totalXp + XP_OBJECT,
              missions: {
                ...s.progress.missions,
                [missionId]: {
                  ...mission,
                  xp: mission.xp + XP_OBJECT,
                  objectsFound: [...mission.objectsFound, objectId],
                },
              },
            },
          };
        }),

      plantFlag: (missionId) =>
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission || mission.flagPlanted) return s;
          return {
            progress: {
              ...s.progress,
              totalXp: s.progress.totalXp + XP_FLAG,
              missions: {
                ...s.progress.missions,
                [missionId]: {
                  ...mission,
                  xp: mission.xp + XP_FLAG,
                  flagPlanted: true,
                },
              },
            },
          };
        }),

      completeMission: (missionId) =>
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission || mission.status === "completed") return s;

          const updatedMissions = {
            ...s.progress.missions,
            [missionId]: {
              ...mission,
              xp: mission.xp + XP_COMPLETE,
              status: "completed" as MissionStatus,
            },
          };

          const idx = MISSION_ORDER.indexOf(missionId);
          if (idx >= 0 && idx < MISSION_ORDER.length - 1) {
            const nextId = MISSION_ORDER[idx + 1];
            if (nextId) {
              const next = updatedMissions[nextId];
              if (next && next.status === "locked") {
                updatedMissions[nextId] = { ...next, status: "available" };
              }
            }
          }

          return {
            progress: {
              ...s.progress,
              totalXp: s.progress.totalXp + XP_COMPLETE,
              missions: updatedMissions,
            },
          };
        }),

      startMission: (missionId) =>
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission || mission.status === "locked") return s;
          return {
            progress: {
              ...s.progress,
              missions: {
                ...s.progress.missions,
                [missionId]: { ...mission, status: "in-progress" },
              },
            },
          };
        }),

      setDemoMode: (on) => set({ session: { demoMode: on } }),

      getRank: () => {
        const xp = get().progress.totalXp;
        if (xp >= 300) return "Commander";
        if (xp >= 100) return "Pilot";
        return "Cadet";
      },
    }),
    {
      name: "cosmosyy-v2",
      partialize: (state) => ({
        player: state.player,
        settings: state.settings,
        progress: state.progress,
      }),
    },
  ),
);
