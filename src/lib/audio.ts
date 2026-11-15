import { Howl, Howler } from "howler";

export type Bus = "master" | "sfx" | "narration" | "music";

interface SoundEntry {
  howl: Howl;
  bus: Bus;
}

const sounds = new Map<string, SoundEntry>();
const busVolumes: Record<Bus, number> = {
  master: 0.8,
  sfx: 1,
  narration: 1,
  music: 0.6,
};

let ducking = false;
let captionCallback: ((text: string, duration: number) => void) | null = null;

function effectiveVolume(bus: Bus): number {
  return busVolumes.master * busVolumes[bus] * (ducking && bus !== "narration" ? 0.3 : 1);
}

export function unlock(): void {
  const ctx = Howler.ctx;
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
}

export function register(
  id: string,
  src: string | string[],
  bus: Bus = "sfx",
  opts: { loop?: boolean; volume?: number } = {},
): void {
  if (sounds.has(id)) return;
  const howl = new Howl({
    src: Array.isArray(src) ? src : [src],
    loop: opts.loop ?? false,
    volume: (opts.volume ?? 1) * effectiveVolume(bus),
    preload: true,
  });
  sounds.set(id, { howl, bus });
}

export function play(id: string): number | undefined {
  const entry = sounds.get(id);
  if (!entry) return undefined;
  entry.howl.volume(effectiveVolume(entry.bus));
  return entry.howl.play();
}

export function stop(id: string): void {
  sounds.get(id)?.howl.stop();
}

export function stopAll(): void {
  Howler.stop();
}

export function setBus(bus: Bus, volume: number): void {
  busVolumes[bus] = Math.max(0, Math.min(1, volume));
  for (const [, entry] of sounds) {
    if (entry.bus === bus || bus === "master") {
      entry.howl.volume(effectiveVolume(entry.bus));
    }
  }
}

export function getBus(bus: Bus): number {
  return busVolumes[bus];
}

export function duck(on: boolean): void {
  ducking = on;
  for (const [, entry] of sounds) {
    entry.howl.volume(effectiveVolume(entry.bus));
  }
}

export function onCaption(cb: (text: string, duration: number) => void): void {
  captionCallback = cb;
}

export function narrate(cueId: string, caption?: string, durationMs?: number): number | undefined {
  duck(true);
  const soundId = play(cueId);
  const entry = sounds.get(cueId);

  if (caption && captionCallback && durationMs) {
    captionCallback(caption, durationMs);
  }

  if (entry) {
    entry.howl.once("end", () => {
      duck(false);
    });
  }

  return soundId;
}

export function mute(on: boolean): void {
  Howler.mute(on);
}

export function isMuted(): boolean {
  return (Howler as unknown as { _muted: boolean })._muted ?? false;
}

export const audio = {
  unlock,
  register,
  play,
  stop,
  stopAll,
  setBus,
  getBus,
  duck,
  onCaption,
  narrate,
  mute,
  isMuted,
} as const;
