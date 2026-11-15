import { playQuindar } from "@/lib/gameAudio";
import { duck } from "@/lib/audio";
import { stopNarration } from "@/lib/narration";

export interface TutorSpeakOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  withRadioChirp?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Searches system voices for the warmest, most natural human tutor voice available.
 * Prioritizes modern Natural / Neural / Online voices (Edge, Chrome, Mac) over robotic synthesizers.
 */
export function getBestTutorVoice(lang = "en-US"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = (lang || "en-US").toLowerCase();
  const langPrefix = targetLang.slice(0, 2);

  const matchedVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  const pool = matchedVoices.length > 0 ? matchedVoices : voices;

  // 1. Natural / Neural / Online human-like voices (Microsoft Natural, Google Neural, etc.)
  const natural = pool.find((v) => /natural|neural|online|multilingual/i.test(v.name));
  if (natural) return natural;

  // 2. Google High Quality Voices
  const google = pool.find((v) => /google/i.test(v.name));
  if (google) return google;

  // 3. Known warm, friendly tutor voices
  const warm = pool.find((v) => /jenny|aria|guy|samantha|swara|neerja/i.test(v.name));
  if (warm) return warm;

  // 4. Default language voice
  return pool.find((v) => v.default) || pool[0] || null;
}

/**
 * Speaks text using a warm human tutor voice.
 * Prevents audio cutoffs (Chrome 15s bug), ducks background music,
 * and ensures sound effects NEVER overlap with speech.
 */
export function speakTutorText(options: TutorSpeakOptions): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onError?.(new Error("Speech synthesis not supported"));
    return () => {};
  }

  // 1. Clear any active speech and narrations so there is ZERO overlap
  stopNarration(true);
  window.speechSynthesis.cancel();

  // Duck background audio so the tutor's voice is crystal clear
  duck(true);

  let keepAliveInterval: ReturnType<typeof setInterval> | null = null;
  let chirpTimeout: ReturnType<typeof setTimeout> | null = null;
  let isCancelled = false;

  const cleanup = () => {
    isCancelled = true;
    if (chirpTimeout) {
      clearTimeout(chirpTimeout);
      chirpTimeout = null;
    }
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    duck(false);
  };

  const startSpeaking = () => {
    if (isCancelled) return;

    const utterance = new SpeechSynthesisUtterance(options.text);
    const lang = options.lang || "en-US";
    utterance.lang = lang;

    // Gentle, natural tutor cadence: not too fast, clear pauses
    utterance.rate = options.rate ?? (lang.startsWith("hi") ? 0.95 : 0.92);
    utterance.pitch = options.pitch ?? 1.0;

    const bestVoice = getBestTutorVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      if (isCancelled) return;
      options.onStart?.();

      // Chromium bugfix: Chrome cuts off speech synthesis after 15 seconds.
      // Cycling pause/resume every 10 seconds keeps long educational explanations alive.
      keepAliveInterval = setInterval(() => {
        if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    };

    utterance.onend = () => {
      cleanup();
      // Slight pause before completing to ensure the final syllable rings out cleanly
      setTimeout(() => {
        options.onEnd?.();
      }, 150);
    };

    utterance.onerror = (e) => {
      cleanup();
      options.onError?.(e);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      cleanup();
      options.onError?.(err);
    }
  };

  // If radio chirp is enabled, play it first, then wait 350ms so sound effects NEVER overlap with speech
  if (options.withRadioChirp) {
    try {
      playQuindar();
    } catch {
      // ignore audio context issues
    }
    chirpTimeout = setTimeout(() => {
      startSpeaking();
    }, 350);
  } else {
    startSpeaking();
  }

  return () => {
    cleanup();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };
}
