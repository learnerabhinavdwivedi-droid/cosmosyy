import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StoryScene } from "./StoryScene";
import { useStoryPlayer } from "./useStoryPlayer";
import type { ObjectStoryPacket } from "./storySchema";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Subtitles,
  Sparkles,
  Compass,
  X,
} from "lucide-react";

export interface ObjectStoryCardProps {
  packet: ObjectStoryPacket;
  onClose?: () => void;
  onSwitchToInspect?: () => void;
  autoPlay?: boolean;
}

export function ObjectStoryCard({
  packet,
  onClose,
  onSwitchToInspect,
  autoPlay = true,
}: ObjectStoryCardProps) {
  const { t, i18n } = useTranslation();
  const [state, dispatch] = useStoryPlayer(packet.scenes.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-start playback on mount if requested
  useEffect(() => {
    if (autoPlay && state.status === "idle") {
      dispatch({ type: "START" });
    }
  }, [autoPlay, state.status, dispatch]);

  // System prefers-reduced-motion check
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const currentScene = packet.scenes[state.sceneIndex] ?? packet.scenes[0]!;
  const isLastScene = state.sceneIndex === packet.scenes.length - 1;

  // Active caption text based on mode and language
  const captionText = useMemo(() => {
    if (!currentScene) return "";
    const isHindi = i18n.language.startsWith("hi");
    if (isHindi && currentScene.hindi) {
      return state.mode === "kids" ? currentScene.hindi.kids : currentScene.hindi.explorer;
    }
    return state.mode === "kids" ? currentScene.kids : currentScene.explorer;
  }, [currentScene, state.mode, i18n.language]);

  // Clean narration audio / Web Speech Synthesis with fallback timer
  const stopNarration = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const triggerAutoAdvance = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      dispatch({ type: "NEXT" });
    }, 900);
  }, [dispatch]);

  // Play narration whenever scene or mode changes while active
  useEffect(() => {
    stopNarration();

    if (state.status !== "playing") return;

    const words = captionText.split(/\s+/).filter(Boolean).length;
    // Word-count reading duration in ms (approx 140 WPM + padding)
    const readingDurationMs = Math.max(4500, words * 420 + 1500);

    if (state.sound && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(captionText);
      utterance.lang = i18n.language.startsWith("hi") ? "hi-IN" : "en-US";
      utterance.rate = state.mode === "kids" ? 0.92 : 1.0;
      utterance.pitch = 1.02;

      utterance.onend = () => {
        dispatch({ type: "SCENE_AUDIO_END" });
        triggerAutoAdvance();
      };

      utterance.onerror = () => {
        // Fallback to word-count duration timer if speech synthesis fails
        audioTimerRef.current = setTimeout(() => {
          dispatch({ type: "SCENE_AUDIO_END" });
          triggerAutoAdvance();
        }, readingDurationMs);
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        audioTimerRef.current = setTimeout(() => {
          dispatch({ type: "SCENE_AUDIO_END" });
          triggerAutoAdvance();
        }, readingDurationMs);
      }
    } else {
      // Sound muted: timer-based reading pacing
      audioTimerRef.current = setTimeout(() => {
        dispatch({ type: "SCENE_AUDIO_END" });
        triggerAutoAdvance();
      }, readingDurationMs);
    }

    return () => {
      stopNarration();
    };
  }, [
    state.status,
    state.sceneIndex,
    state.mode,
    state.sound,
    captionText,
    i18n.language,
    dispatch,
    triggerAutoAdvance,
    stopNarration,
  ]);

  // Global Keyboard Navigation (Never steal keys when typing in an input!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (state.status === "idle") dispatch({ type: "START" });
          else if (state.status === "playing") dispatch({ type: "PAUSE" });
          else if (state.status === "paused") dispatch({ type: "RESUME" });
          else if (state.status === "ended") dispatch({ type: "REPLAY" });
          break;
        case "ArrowRight":
          e.preventDefault();
          dispatch({ type: "NEXT" });
          break;
        case "ArrowLeft":
          e.preventDefault();
          dispatch({ type: "PREV" });
          break;
        case "r":
        case "R":
          e.preventDefault();
          dispatch({ type: "REPLAY" });
          break;
        case "c":
        case "C":
          e.preventDefault();
          dispatch({ type: "TOGGLE_CC" });
          break;
        case "m":
        case "M":
          e.preventDefault();
          dispatch({ type: "TOGGLE_SOUND" });
          break;
        case "Escape":
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.status, dispatch, onClose]);

  // Pause on page tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.status === "playing") {
        dispatch({ type: "PAUSE" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.status, dispatch]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 select-none touch-manipulation"
      role="region"
      aria-label={`${packet.name} 3D Story Card`}
    >
      {/* Responsive Cinematic Stage: Fullscreen on mobile, 16:9 Cinema Framed on desktop */}
      <div className="relative h-full w-full sm:h-auto sm:aspect-[16/9] sm:max-w-5xl sm:max-h-[92vh] sm:rounded-2xl overflow-hidden border-0 sm:border border-sky-500/30 bg-space-950 shadow-2xl shadow-sky-950/50 flex flex-col">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0">
          <StoryScene
            packet={packet}
            sceneIndex={state.sceneIndex}
            action={currentScene.action}
            cameraKeyframe={currentScene.camera}
            reduceMotion={reducedMotion}
            isPlaying={state.status === "playing"}
          />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-sky-400/40 bg-sky-950/80 px-3 py-1 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-sky-300 backdrop-blur shadow">
              {packet.name}
            </span>
            <span className="hidden sm:inline-block rounded-full bg-space-900/80 px-2.5 py-0.5 font-mono text-[9px] text-regolith-400 border border-space-700">
              {currentScene.beat.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Free 3D Orbit / Specs Mode Switcher */}
            {onSwitchToInspect && (
              <button
                type="button"
                onClick={onSwitchToInspect}
                className="flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-950/80 px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-900/60 hover:scale-105 active:scale-95 transition cursor-pointer min-h-[36px] shadow-sm backdrop-blur"
                title="Switch to Free 3D Orbit & NASA Specs"
              >
                <span>🔍</span>
                <span className="hidden xs:inline">Free 3D</span>
              </button>
            )}

            {/* Mode Selector Pill (Kids / Explorer) */}
            <div className="flex rounded-full border border-space-700 bg-space-950/80 p-0.5 backdrop-blur shadow-sm">
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_MODE", mode: "kids" })}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold transition cursor-pointer min-h-[36px] ${
                  state.mode === "kids"
                    ? "bg-amber-400 text-space-950 shadow"
                    : "text-regolith-300 hover:text-white"
                }`}
                aria-pressed={state.mode === "kids"}
              >
                <Sparkles className="h-3 w-3" />
                <span>{t("story.kids", { defaultValue: "Kids" })}</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_MODE", mode: "explorer" })}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold transition cursor-pointer min-h-[36px] ${
                  state.mode === "explorer"
                    ? "bg-sky-400 text-space-950 shadow"
                    : "text-regolith-300 hover:text-white"
                }`}
                aria-pressed={state.mode === "explorer"}
              >
                <Compass className="h-3 w-3" />
                <span>{t("story.explorer", { defaultValue: "Explorer" })}</span>
              </button>
            </div>

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-300 backdrop-blur transition hover:border-space-500 hover:text-white active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label={t("common.close", { defaultValue: "Close" })}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {/* Start Overlay (Mandatory first tap for browser audio policy) */}
        {state.status === "idle" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-space-950/80 backdrop-blur-md px-4 text-center">
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-wider text-regolith-100 mb-2">
              {packet.name}
            </h2>
            <p className="max-w-md text-xs sm:text-sm text-regolith-400 mb-6">
              {packet.facts[0]?.text || "A cinematic first-person journey on the lunar surface."}
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "START" })}
              className="group flex items-center gap-3 rounded-full border border-sky-400/80 bg-sky-500/20 px-8 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-sky-300 shadow-xl shadow-sky-500/20 backdrop-blur transition hover:bg-sky-500/30 hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
            >
              <Play className="h-5 w-5 fill-current transition group-hover:scale-110" />
              <span>{t("story.playStory", { defaultValue: "Play Story" })}</span>
            </button>
          </div>
        )}

        {/* Spacer pushing controls & captions to bottom */}
        <div className="flex-1 pointer-events-none" />

        {/* Captions Overlay with aria-live */}
        {state.cc && (
          <div
            className="relative z-20 px-4 sm:px-12 py-3 text-center pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="inline-block max-w-2xl rounded-xl border border-space-700/60 bg-space-950/80 px-4 py-2.5 backdrop-blur-md shadow-lg">
              <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium text-regolith-100">
                {captionText}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Control Bar */}
        <footer className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-3 border-t border-space-800/80 bg-space-950/85 backdrop-blur-md">
          {/* Playback Transport Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {state.status === "playing" ? (
              <button
                type="button"
                onClick={() => dispatch({ type: "PAUSE" })}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-200 transition hover:border-space-500 hover:text-white active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label={t("story.pause", { defaultValue: "Pause" })}
              >
                <Pause className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (state.status === "idle") dispatch({ type: "START" });
                  else if (state.status === "ended") dispatch({ type: "REPLAY" });
                  else dispatch({ type: "RESUME" });
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-400 bg-sky-500/20 text-sky-300 transition hover:bg-sky-500/30 active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label={t("story.resume", { defaultValue: "Play" })}
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => dispatch({ type: "REPLAY" })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-300 transition hover:border-space-500 hover:text-white active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label={t("story.replay", { defaultValue: "Replay" })}
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: "PREV" })}
              disabled={state.sceneIndex === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-300 transition hover:border-space-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label={t("story.prev", { defaultValue: "Previous Scene" })}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: "NEXT" })}
              disabled={isLastScene}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-300 transition hover:border-space-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label={t("story.next", { defaultValue: "Next Scene" })}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Scene Dots Progress Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2" role="tablist">
            {packet.scenes.map((sc, i) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => dispatch({ type: "JUMP", sceneIndex: i })}
                className={`h-2.5 rounded-full transition-all cursor-pointer min-w-[20px] sm:min-w-[24px] ${
                  i === state.sceneIndex
                    ? "w-7 sm:w-9 bg-sky-400 shadow-sm shadow-sky-400/50"
                    : i < state.sceneIndex
                      ? "w-2.5 bg-space-500 hover:bg-space-400"
                      : "w-2.5 bg-space-800 hover:bg-space-700"
                }`}
                aria-label={`Scene ${i + 1}: ${sc.beat}`}
                aria-selected={i === state.sceneIndex}
              />
            ))}
          </div>

          {/* Audio & Caption Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_CC" })}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] ${
                state.cc
                  ? "border-sky-400 bg-sky-500/20 text-sky-300"
                  : "border-space-700 bg-space-900/80 text-regolith-400 hover:text-white"
              }`}
              aria-label={t("story.captions", { defaultValue: "Toggle Captions" })}
              aria-pressed={state.cc}
            >
              <Subtitles className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] ${
                state.sound
                  ? "border-sky-400 bg-sky-500/20 text-sky-300"
                  : "border-space-700 bg-space-900/80 text-regolith-400 hover:text-white"
              }`}
              aria-label={t("story.sound", { defaultValue: "Toggle Sound" })}
              aria-pressed={state.sound}
            >
              {state.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
