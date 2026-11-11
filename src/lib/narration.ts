import { Howl, Howler } from "howler";
import type { GamePhase } from "@/store/useGameStore";

const NARRATED_PHASES: GamePhase[] = [
  "flight", "coast", "orbit", "targetLocked", "descent",
  "touchdown", "stepOut", "explore", "flagReady", "flagPlanted", "launch",
];

function narrationPath(missionId: string, phase: GamePhase): string {
  return `/audio/narration/${missionId}/${phase}.mp3`;
}

function planetFallbackPath(missionId: string, phase: GamePhase): string {
  const planet = missionId.startsWith("mars-") ? "mars" : "moon";
  return `/audio/narration/${planet}/${phase}.mp3`;
}

function fallbackPath(phase: GamePhase): string {
  return `/audio/narration/${phase}.mp3`;
}

const howls = new Map<string, Howl>();
let currentNarration: Howl | null = null;
let volume = 0.9;
let activeMissionId = "apollo-11";

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
    currentNarration.fade(currentNarration.volume(), 0, 300);
    const prev = currentNarration;
    setTimeout(() => prev.stop(), 350);
  }

  const key = getKey(id, phase);
  let howl = howls.get(key);

  if (!howl) {
    const fallbackKey = getKey("apollo-11", phase);
    howl = howls.get(fallbackKey);
  }

  if (!howl) return;
  currentNarration = howl;
  howl.volume(volume);
  howl.play();
}

export function stopNarration(): void {
  if (currentNarration) {
    currentNarration.fade(currentNarration.volume(), 0, 500);
    const h = currentNarration;
    setTimeout(() => h.stop(), 550);
    currentNarration = null;
  }
}

export function setNarrationVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (currentNarration) currentNarration.volume(volume);
}

export function unlockAudio(): void {
  const ctx = Howler.ctx;
  if (ctx && ctx.state === "suspended") void ctx.resume();
}
