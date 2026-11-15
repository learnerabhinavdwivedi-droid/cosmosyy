import { Howl, Howler } from "howler";
import type { GamePhase } from "@/store/useGameStore";

const NARRATED_PHASES: GamePhase[] = [
  "flight",
  "coast",
  "orbit",
  "targetLocked",
  "descent",
  "touchdown",
  "stepOut",
  "explore",
  "flagReady",
  "flagPlanted",
  "launch",
];

function narrationPath(missionId: string, phase: GamePhase): string {
  return `/audio/narration/${missionId}/${phase}.mp3`;
}

function planetFallbackPath(missionId: string, phase: GamePhase): string {
  if (missionId.startsWith("mars-")) {
    return `/audio/narration/mars/${phase}.mp3`;
  }
  if (missionId.startsWith("deep-") || missionId.startsWith("deepspace-")) {
    return `/audio/narration/${phase}.mp3`;
  }
  return `/audio/narration/moon/${phase}.mp3`;
}

function fallbackPath(phase: GamePhase): string {
  return `/audio/narration/${phase}.mp3`;
}

const howls = new Map<string, Howl>();
const stopTimers = new WeakMap<Howl, ReturnType<typeof setTimeout>>();
let currentNarration: Howl | null = null;
let narrationBusy = false;
const completionListeners = new Set<() => void>();
let volume = 0.9;
let activeMissionId = "apollo-11";

function notifyComplete(): void {
  narrationBusy = false;
  if (completionListeners.size === 0) return;
  const cbs = Array.from(completionListeners);
  completionListeners.clear();
  for (const cb of cbs) cb();
}

function getKey(missionId: string, phase: GamePhase): string {
  return `${missionId}:${phase}`;
}

export function preloadNarration(missionId?: string): void {
  const id = missionId || activeMissionId;
  activeMissionId = id;

  for (const phase of NARRATED_PHASES) {
    const key = getKey(id, phase);
    if (howls.has(key)) continue;

    const primary = narrationPath(id, phase);
    const planetFb = planetFallbackPath(id, phase);
    const fallback = fallbackPath(phase);

    howls.set(
      key,
      new Howl({
        src: [primary, planetFb, fallback],
        preload: true,
        volume,
      }),
    );
  }
}

export function playNarration(phase: GamePhase, missionId?: string): void {
  const id = missionId || activeMissionId;

  if (currentNarration) {
    const prev = currentNarration;
    prev.off("end");
    prev.off("loaderror");
    prev.off("playerror");
    prev.off("stop");
    prev.fade(prev.volume(), 0, 250);
    const prevTimer = stopTimers.get(prev);
    if (prevTimer) clearTimeout(prevTimer);
    stopTimers.set(
      prev,
      setTimeout(() => {
        prev.stop();
        stopTimers.delete(prev);
      }, 280),
    );
  }

  const key = getKey(id, phase);
  let howl = howls.get(key);

  if (!howl) {
    const fallbackKey = getKey("apollo-11", phase);
    howl = howls.get(fallbackKey);
  }

  if (!howl) {
    currentNarration = null;
    notifyComplete();
    return;
  }

  // Cancel any pending fade-stop if replaying this Howl instance
  const pendingStop = stopTimers.get(howl);
  if (pendingStop) {
    clearTimeout(pendingStop);
    stopTimers.delete(howl);
  }
  howl.stop();
  howl.off("end");
  howl.off("loaderror");
  howl.off("playerror");
  howl.off("stop");

  currentNarration = howl;
  narrationBusy = true;

  const markDone = () => {
    if (currentNarration === howl) {
      notifyComplete();
    }
  };

  howl.once("end", markDone);
  howl.once("loaderror", markDone);
  howl.once("playerror", markDone);
  howl.once("stop", markDone);

  howl.volume(volume);
  howl.play();
}

export function onNarrationComplete(cb: () => void, maxWaitMs = 12000): () => void {
  if (!narrationBusy || !currentNarration) {
    cb();
    return () => {};
  }

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    clearTimeout(safetyTimer);
    completionListeners.delete(finish);
    cb();
  };

  const safetyTimer = setTimeout(finish, maxWaitMs);
  completionListeners.add(finish);

  return () => {
    if (settled) return;
    settled = true;
    clearTimeout(safetyTimer);
    completionListeners.delete(finish);
  };
}

export function stopNarration(immediate = false): void {
  if (currentNarration) {
    const h = currentNarration;
    h.off("end");
    h.off("loaderror");
    h.off("playerror");
    h.off("stop");
    const prevTimer = stopTimers.get(h);
    if (prevTimer) clearTimeout(prevTimer);
    if (immediate) {
      try {
        h.stop();
      } catch {}
      stopTimers.delete(h);
    } else {
      h.fade(h.volume(), 0, 300);
      stopTimers.set(
        h,
        setTimeout(() => {
          try {
            h.stop();
          } catch {}
          stopTimers.delete(h);
        }, 320),
      );
    }
    currentNarration = null;
  }
  narrationBusy = false;
  completionListeners.clear();
  notifyComplete();
}

export function setNarrationVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (currentNarration) currentNarration.volume(volume);
}

export function unlockAudio(): void {
  const ctx = Howler.ctx;
  if (ctx && ctx.state === "suspended") void ctx.resume();
}
