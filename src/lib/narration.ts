import { Howl, Howler } from "howler";
import type { GamePhase } from "@/store/useGameStore";

const NARRATION_FILES: Partial<Record<GamePhase, string>> = {
  flight: "/audio/narration/flight.mp3",
  coast: "/audio/narration/coast.mp3",
  orbit: "/audio/narration/orbit.mp3",
  targetLocked: "/audio/narration/targetLocked.mp3",
  descent: "/audio/narration/descent.mp3",
  touchdown: "/audio/narration/touchdown.mp3",
  stepOut: "/audio/narration/stepOut.mp3",
  explore: "/audio/narration/explore.mp3",
  flagReady: "/audio/narration/flagReady.mp3",
  flagPlanted: "/audio/narration/flagPlanted.mp3",
  launch: "/audio/narration/launch.mp3",
};

const howls = new Map<string, Howl>();
let currentNarration: Howl | null = null;
let volume = 0.9;

export function preloadNarration(): void {
  for (const [phase, src] of Object.entries(NARRATION_FILES)) {
    if (howls.has(phase)) continue;
    howls.set(
      phase,
      new Howl({ src: [src], preload: true, volume }),
    );
  }
}

export function playNarration(phase: GamePhase): void {
  if (currentNarration) {
    currentNarration.fade(currentNarration.volume(), 0, 300);
    const prev = currentNarration;
    setTimeout(() => prev.stop(), 350);
  }

  const howl = howls.get(phase);
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
