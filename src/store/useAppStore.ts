import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Quality = "low" | "medium" | "high";
export type MissionStatus = "locked" | "available" | "in-progress" | "completed";
export type AudioLanguage = "english" | "hinglish";

export interface MissionProgress {
  status: MissionStatus;
  xp: number;
  flagPlanted: boolean;
  objectsFound: string[];
  bestTimeMs?: number;
  stars?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export const ACHIEVEMENT_DEFS: Achievement[] = [
  { id: "first_steps", title: "First Steps", description: "Complete your first mission", icon: "👣" },
  { id: "moon_walker", title: "Moon Walker", description: "Complete all 6 Apollo missions", icon: "🌙" },
  { id: "mars_pioneer", title: "Mars Pioneer", description: "Complete your first Mars mission", icon: "🔴" },
  { id: "mars_conqueror", title: "Mars Conqueror", description: "Complete all 9 Mars missions", icon: "🏔" },
  { id: "deep_voyager", title: "Deep Voyager", description: "Complete a Deep Space mission", icon: "🌌" },
  { id: "full_sweep", title: "Full Sweep", description: "Complete all 20 missions", icon: "🏆" },
  { id: "relic_hunter", title: "Relic Hunter", description: "Find 25 heritage objects total", icon: "🔍" },
  { id: "master_collector", title: "Master Collector", description: "Find 75 heritage objects total", icon: "💎" },
  { id: "completionist", title: "Completionist", description: "Find all objects in any mission", icon: "✅" },
  { id: "perfectionist", title: "Perfectionist", description: "Earn 3 stars on 10 missions", icon: "⭐" },
  { id: "speed_demon", title: "Speed Demon", description: "Complete any mission in under 3 minutes", icon: "⚡" },
  { id: "xp_500", title: "Rising Star", description: "Earn 500 total XP", icon: "🌟" },
  { id: "xp_2000", title: "Space Legend", description: "Earn 2000 total XP", icon: "🚀" },
  { id: "xp_5000", title: "Cosmic Master", description: "Earn 5000 total XP", icon: "👑" },
  { id: "combo_king", title: "Combo King", description: "Hit a 4x scan combo", icon: "🔥" },
  { id: "flag_bearer", title: "Flag Bearer", description: "Plant 5 flags across missions", icon: "🚩" },
];

export interface RankDef {
  name: string;
  minXp: number;
  icon: string;
}

export const RANKS: RankDef[] = [
  { name: "Cadet", minXp: 0, icon: "○" },
  { name: "Pilot", minXp: 100, icon: "◐" },
  { name: "Captain", minXp: 300, icon: "●" },
  { name: "Commander", minXp: 600, icon: "◆" },
  { name: "Flight Director", minXp: 1000, icon: "◈" },
  { name: "Mission Specialist", minXp: 1600, icon: "★" },
  { name: "Chief Scientist", minXp: 2500, icon: "✦" },
  { name: "Flight Legend", minXp: 3500, icon: "✧" },
  { name: "Space Pioneer", minXp: 5000, icon: "◇" },
  { name: "Cosmos Master", minXp: 7500, icon: "✪" },
];

interface PlayerState {
  name: string;
}

export interface SettingsState {
  volume: number;
  sfxVolume?: number;
  musicVolume?: number;
  narrationVolume?: number;
  tutorRate?: number;
  audioLanguage?: AudioLanguage;
  captions: boolean;
  quality: Quality;
  reducedMotion: boolean;
}

interface ProgressState {
  missions: Record<string, MissionProgress>;
  totalXp: number;
  achievements: string[];
  totalObjectsFound: number;
}

interface SessionState {
  demoMode: boolean;
  missionStartTime: number | null;
  comboCount: number;
  lastScanTime: number;
  pendingAchievements: string[];
  pendingRankUp: string | null;
}

interface AppState {
  player: PlayerState;
  settings: SettingsState;
  progress: ProgressState;
  session: SessionState;

  setPlayerName: (name: string) => void;
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  addXp: (missionId: string, amount: number) => void;
  findObject: (missionId: string, objectId: string) => void;
  plantFlag: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  startMission: (missionId: string) => void;
  setDemoMode: (on: boolean) => void;
  resetProgress: () => void;
  getRank: () => RankDef;
  getRankProgress: () => { current: RankDef; next: RankDef | null; progressPct: number };
  getMissionStars: (missionId: string, totalObjects: number) => number;
  getOverallStats: () => {
    missionsCompleted: number;
    totalMissions: number;
    objectsFound: number;
    totalObjects: number;
    completionPct: number;
    threeStarCount: number;
    flagsPlanted: number;
  };
  startMissionTimer: () => void;
  registerScan: () => number;
  popPendingAchievements: () => string[];
  popPendingRankUp: () => string | null;
  checkAndUnlockAchievement: (id: string) => void;
  checkAllAchievements: () => void;
}

const DEFAULT_MISSIONS: Record<string, MissionProgress> = {
  "apollo-11": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-12": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-14": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-15": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-16": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "apollo-17": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-viking1": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-viking2": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-pathfinder": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-spirit": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-opportunity": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-curiosity": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-perseverance": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-phoenix": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "mars-insight": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "deep-dawn": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "deep-near": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "deep-voyager": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "deep-kepler": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
  "deepspace-pioneer": { status: "available", xp: 0, flagPlanted: false, objectsFound: [] },
};

export const XP_LAND = 50;
export const XP_OBJECT = 50;
export const XP_FLAG = 100;
export const XP_COMPLETE = 100;

export const MOON_MISSION_ORDER = [
  "apollo-11",
  "apollo-12",
  "apollo-14",
  "apollo-15",
  "apollo-16",
  "apollo-17",
];

export const MARS_MISSION_ORDER = [
  "mars-viking1",
  "mars-viking2",
  "mars-pathfinder",
  "mars-spirit",
  "mars-opportunity",
  "mars-curiosity",
  "mars-perseverance",
  "mars-phoenix",
  "mars-insight",
];

export const DEEPSPACE_MISSION_ORDER = [
  "deep-near",
  "deep-dawn",
  "deepspace-pioneer",
  "deep-kepler",
  "deep-voyager",
];

export const MISSION_ORDER = [
  ...MOON_MISSION_ORDER,
  ...MARS_MISSION_ORDER,
  ...DEEPSPACE_MISSION_ORDER,
];

export function getNextMissionId(currentId: string): string | null {
  const isMars = currentId.startsWith("mars-");
  const isDeep = currentId.startsWith("deep-") || currentId.startsWith("deepspace-");
  const order = isMars
    ? MARS_MISSION_ORDER
    : isDeep
    ? DEEPSPACE_MISSION_ORDER
    : MOON_MISSION_ORDER;
  const idx = order.indexOf(currentId);
  if (idx >= 0 && idx < order.length - 1) return order[idx + 1] ?? null;
  return null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      player: { name: "" },
      settings: {
        volume: 0.8,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        narrationVolume: 0.9,
        tutorRate: 0.95,
        audioLanguage: "english",
        captions: true,
        quality: "medium",
        reducedMotion: false,
      },
      progress: {
        missions: { ...DEFAULT_MISSIONS },
        totalXp: 0,
        achievements: [],
        totalObjectsFound: 0,
      },
      session: {
        demoMode: false,
        missionStartTime: null,
        comboCount: 0,
        lastScanTime: 0,
        pendingAchievements: [],
        pendingRankUp: null,
      },

      setPlayerName: (name) => set((s) => ({ player: { ...s.player, name } })),

      setSetting: (key, value) => {
        set((s) => ({ settings: { ...s.settings, [key]: value } }));
        if (key === "audioLanguage") {
          import("@/i18n").then((mod) => {
            const target = value === "hinglish" ? "hi" : "en";
            if (mod.default.language !== target) {
              void mod.default.changeLanguage(target);
            }
          });
        }
      },

      addXp: (missionId, amount) => {
        const prevRank = get().getRank();
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
        });
        const newRank = get().getRank();
        if (newRank.name !== prevRank.name) {
          set((s) => ({
            session: { ...s.session, pendingRankUp: newRank.name },
          }));
        }
        get().checkAllAchievements();
      },

      findObject: (missionId, objectId) => {
        const prevRank = get().getRank();
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission) return s;
          const found = mission.objectsFound ?? [];
          if (found.includes(objectId)) return s;
          const newFound = [...found, objectId];
          return {
            progress: {
              ...s.progress,
              totalXp: s.progress.totalXp + XP_OBJECT,
              totalObjectsFound: (s.progress.totalObjectsFound ?? 0) + 1,
              missions: {
                ...s.progress.missions,
                [missionId]: {
                  ...mission,
                  xp: mission.xp + XP_OBJECT,
                  objectsFound: newFound,
                },
              },
            },
          };
        });
        get().registerScan();
        const newRank = get().getRank();
        if (newRank.name !== prevRank.name) {
          set((s) => ({
            session: { ...s.session, pendingRankUp: newRank.name },
          }));
        }
        get().checkAllAchievements();
      },

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

      completeMission: (missionId) => {
        const prevRank = get().getRank();
        set((s) => {
          const mission = s.progress.missions[missionId];
          if (!mission || mission.status === "completed") return s;

          const elapsed = s.session.missionStartTime
            ? Date.now() - s.session.missionStartTime
            : null;
          const bestTime =
            elapsed && (!mission.bestTimeMs || elapsed < mission.bestTimeMs)
              ? elapsed
              : mission.bestTimeMs;

          const updatedMission = {
            ...mission,
            xp: mission.xp + XP_COMPLETE,
            status: "completed" as MissionStatus,
            bestTimeMs: bestTime,
          };

          const updatedMissions: Record<string, MissionProgress> = {
            ...s.progress.missions,
            [missionId]: updatedMission,
          };

          const isMars = missionId.startsWith("mars-");
          const isDeep =
            missionId.startsWith("deep-") || missionId.startsWith("deepspace-");
          const planetOrder = isMars
            ? MARS_MISSION_ORDER
            : isDeep
              ? DEEPSPACE_MISSION_ORDER
              : MOON_MISSION_ORDER;
          const idx = planetOrder.indexOf(missionId);
          if (idx >= 0 && idx < planetOrder.length - 1) {
            const nextId = planetOrder[idx + 1];
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
              totalObjectsFound: Object.values(updatedMissions).reduce(
                (sum, m) => sum + (m.objectsFound?.length ?? 0),
                0,
              ),
            },
          };
        });
        const newRank = get().getRank();
        if (newRank.name !== prevRank.name) {
          set((s) => ({
            session: { ...s.session, pendingRankUp: newRank.name },
          }));
        }
        if (
          get().session.missionStartTime &&
          Date.now() - get().session.missionStartTime! < 180000
        ) {
          get().checkAndUnlockAchievement("speed_demon");
        }
        get().checkAllAchievements();
      },

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
            session: {
              ...s.session,
              missionStartTime: Date.now(),
              comboCount: 0,
              lastScanTime: 0,
            },
          };
        }),

      setDemoMode: (on) =>
        set((s) => ({ session: { ...s.session, demoMode: on } })),

      resetProgress: () =>
        set((s) => ({
          player: { name: "" },
          progress: {
            missions: { ...DEFAULT_MISSIONS },
            totalXp: 0,
            achievements: [],
            totalObjectsFound: 0,
          },
          session: { ...s.session, pendingAchievements: [], pendingRankUp: null },
        })),

      getRank: () => {
        const xp = get().progress.totalXp;
        let rank = RANKS[0]!;
        for (const r of RANKS) {
          if (xp >= r.minXp) rank = r;
        }
        return rank;
      },

      getRankProgress: () => {
        const xp = get().progress.totalXp;
        let idx = 0;
        for (let i = 0; i < RANKS.length; i++) {
          if (xp >= RANKS[i]!.minXp) idx = i;
        }
        const current = RANKS[idx]!;
        const next = idx < RANKS.length - 1 ? RANKS[idx + 1]! : null;
        const progressPct = next
          ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))
          : 1;
        return { current, next, progressPct };
      },

      getMissionStars: (missionId, totalObjects) => {
        const m = get().progress.missions[missionId];
        if (!m || m.status !== "completed") return 0;
        let stars = 1;
        if ((m.objectsFound?.length ?? 0) >= totalObjects) stars = 2;
        if (stars === 2 && m.flagPlanted) stars = 3;
        return stars;
      },

      getOverallStats: () => {
        const missions = get().progress.missions;
        const missionIds = Object.keys(missions);
        let completed = 0;
        let objectsFound = 0;
        let threeStarCount = 0;
        let flagsPlanted = 0;
        for (const id of missionIds) {
          const m = missions[id]!;
          if (m.status === "completed") completed++;
          objectsFound += m.objectsFound?.length ?? 0;
          if (m.flagPlanted) flagsPlanted++;
          if (m.stars && m.stars >= 3) threeStarCount++;
        }
        return {
          missionsCompleted: completed,
          totalMissions: 20,
          objectsFound,
          totalObjects: 113,
          completionPct: Math.round((completed / 20) * 100),
          threeStarCount,
          flagsPlanted,
        };
      },

      startMissionTimer: () =>
        set((s) => ({
          session: {
            ...s.session,
            missionStartTime: Date.now(),
            comboCount: 0,
            lastScanTime: 0,
          },
        })),

      registerScan: () => {
        const now = Date.now();
        const s = get().session;
        const elapsed = now - s.lastScanTime;
        const newCombo = elapsed < 15000 && s.comboCount > 0 ? s.comboCount + 1 : 1;
        set((state) => ({
          session: {
            ...state.session,
            comboCount: newCombo,
            lastScanTime: now,
          },
        }));
        if (newCombo >= 4) {
          get().checkAndUnlockAchievement("combo_king");
        }
        return newCombo;
      },

      popPendingAchievements: () => {
        const pending = get().session.pendingAchievements ?? [];
        if (pending.length === 0) return [];
        set((s) => ({ session: { ...s.session, pendingAchievements: [] } }));
        return pending;
      },

      popPendingRankUp: () => {
        const pending = get().session.pendingRankUp;
        if (!pending) return null;
        set((s) => ({ session: { ...s.session, pendingRankUp: null } }));
        return pending;
      },

      checkAndUnlockAchievement: (id) => {
        const state = get();
        if (state.progress.achievements.includes(id)) return;
        set((s) => ({
          progress: {
            ...s.progress,
            achievements: [...(s.progress.achievements ?? []), id],
          },
          session: {
            ...s.session,
            pendingAchievements: [...(s.session.pendingAchievements ?? []), id],
          },
        }));
      },

      checkAllAchievements: () => {
        const state = get();
        const { missions, totalXp, achievements = [] } = state.progress;
        const unlock = (id: string) => {
          if (!achievements.includes(id)) state.checkAndUnlockAchievement(id);
        };

        const completedIds = Object.keys(missions).filter(
          (id) => missions[id]?.status === "completed",
        );
        const moonDone = MOON_MISSION_ORDER.filter((id) =>
          completedIds.includes(id),
        ).length;
        const marsDone = MARS_MISSION_ORDER.filter((id) =>
          completedIds.includes(id),
        ).length;
        const deepDone = DEEPSPACE_MISSION_ORDER.filter((id) =>
          completedIds.includes(id),
        ).length;
        const totalFound = Object.values(missions).reduce(
          (sum, m) => sum + (m.objectsFound?.length ?? 0),
          0,
        );
        const flagCount = Object.values(missions).filter((m) => m.flagPlanted).length;
        const threeStarCount = Object.values(missions).filter(
          (m) => m.stars && m.stars >= 3,
        ).length;

        if (completedIds.length >= 1) unlock("first_steps");
        if (moonDone >= 6) unlock("moon_walker");
        if (marsDone >= 1) unlock("mars_pioneer");
        if (marsDone >= 9) unlock("mars_conqueror");
        if (deepDone >= 1) unlock("deep_voyager");
        if (completedIds.length >= 20) unlock("full_sweep");
        if (totalFound >= 25) unlock("relic_hunter");
        if (totalFound >= 75) unlock("master_collector");
        if (totalXp >= 500) unlock("xp_500");
        if (totalXp >= 2000) unlock("xp_2000");
        if (totalXp >= 5000) unlock("xp_5000");
        if (threeStarCount >= 10) unlock("perfectionist");
        if (flagCount >= 5) unlock("flag_bearer");
      },
    }),
    {
      name: "cosmosyy-v2",
      partialize: (state) => ({
        player: state.player,
        settings: state.settings,
        progress: state.progress,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<Pick<AppState, "player" | "settings" | "progress">> | undefined;
        if (!p) return current;
        const pp = p.progress;
        return {
          ...current,
          player: { ...current.player, ...(p.player ?? {}) },
          settings: { ...current.settings, ...(p.settings ?? {}) },
          progress: {
            missions: { ...current.progress.missions, ...(pp?.missions ?? {}) },
            totalXp: pp?.totalXp ?? current.progress.totalXp,
            achievements: Array.isArray(pp?.achievements)
              ? pp.achievements
              : current.progress.achievements,
            totalObjectsFound:
              typeof pp?.totalObjectsFound === "number"
                ? pp.totalObjectsFound
                : current.progress.totalObjectsFound,
          },
        };
      },
    },
  ),
);
