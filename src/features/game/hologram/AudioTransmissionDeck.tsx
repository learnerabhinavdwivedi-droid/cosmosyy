import { useRef, useEffect, useState, useCallback } from "react";
import { Howl } from "howler";
import { stopNarration } from "@/lib/narration";
import type { ObjectTheme } from "./types";

interface AudioTransmissionDeckProps {
  missionId: string;
  objectId: string;
  objectName?: string;
  firstPersonLog?: string;
  theme: ObjectTheme;
  hasStory?: boolean;
  onOpenStory?: () => void;
}

export function AudioTransmissionDeck({
  missionId,
  objectId,
  objectName: _objectName,
  firstPersonLog,
  theme,
  hasStory,
  onOpenStory,
}: AudioTransmissionDeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [hasAudio, setHasAudio] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCaptions, setShowCaptions] = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 20 energetic equalizer bars
  const idleBars = [35, 55, 72, 45, 82, 60, 92, 50, 78, 65, 88, 48, 70, 42, 65, 80, 52, 74, 40, 60];
  const [liveBars, setLiveBars] = useState(idleBars);

  // Stop surface narration when hologram audio mounts
  useEffect(() => {
    stopNarration();
  }, []);

  // Load and play audio when object changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const audioUrl = `/audio/heritage/${missionId}/${objectId}.mp3`;

    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      volume: 0.95,
      onload: () => {
        setHasAudio(true);
        setDuration(sound.duration());
      },
      onloaderror: () => {
        setHasAudio(false);
      },
      onend: () => {
        setIsPlaying(false);
        setAudioProgress(1);
        setCurrentTime(sound.duration());
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      },
    });

    soundRef.current = sound;

    return () => {
      sound.stop();
      sound.unload();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [missionId, objectId]);

  // Audio progress animation loop
  const updateProgress = useCallback(() => {
    if (!soundRef.current || !soundRef.current.playing()) return;

    const seek = soundRef.current.seek() as number;
    const dur = soundRef.current.duration();

    if (dur > 0) {
      setCurrentTime(seek);
      setAudioProgress(seek / dur);

      // Organic dynamic bar fluctuation
      setLiveBars((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 25),
      );
    }

    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, []);

  const togglePlay = () => {
    if (!soundRef.current || !hasAudio) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    } else {
      soundRef.current.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (newPct: number) => {
    if (!soundRef.current || !hasAudio) return;
    const dur = soundRef.current.duration();
    const newTime = dur * newPct;
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
    setAudioProgress(newPct);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="mt-2.5 rounded-xl border p-2.5 backdrop-blur-md shrink-0 flex flex-col gap-2"
      style={{
        borderColor: theme.border,
        background: "rgba(10,14,22,0.85)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{ background: theme.primary }}
          />
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: theme.primary }}
          >
            {isPlaying ? "Telemetry Transmission Live" : "Dormant Voice Log"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {firstPersonLog && (
            <button
              type="button"
              onClick={() => setShowCaptions((v) => !v)}
              className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold transition cursor-pointer border ${
                showCaptions
                  ? "border-cyan-500 bg-cyan-950/60 text-cyan-300"
                  : "border-space-700 bg-space-800/60 text-regolith-400 hover:text-regolith-200"
              }`}
              title="Toggle transcript caption"
            >
              CC
            </button>
          )}
          {hasStory && onOpenStory && (
            <button
              type="button"
              onClick={onOpenStory}
              className="flex items-center gap-1 rounded-full border border-sky-400 bg-sky-500/25 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase text-sky-200 hover:bg-sky-500/40 hover:scale-105 active:scale-95 transition cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.3)] animate-pulse"
              title="Launch Cinematic 3D Story [T]"
            >
              <span>🎬</span>
              <span>3D Story</span>
            </button>
          )}
          <span className="font-mono text-[10px] text-regolith-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Responsive audio visualizer + Controls row */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={!hasAudio}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-bold text-xs transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
          style={{
            borderColor: theme.border,
            background: theme.primaryDim,
            color: theme.primary,
          }}
          aria-label={isPlaying ? "Pause voice log" : "Play voice log"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* Visualizer and Scrub Track */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex h-5 items-end justify-between gap-1 px-0.5">
            {(isPlaying ? liveBars : idleBars).map((h, i) => (
              <div
                key={i}
                className="w-full rounded-t transition-all duration-75"
                style={{
                  height: `${isPlaying ? h : Math.max(15, h * 0.25)}%`,
                  background: isPlaying ? theme.primary : "rgba(148,163,184,0.22)",
                  boxShadow: isPlaying ? `0 0 5px ${theme.glow}` : "none",
                }}
              />
            ))}
          </div>

          {/* Scrubber progress bar */}
          <div
            className="relative h-1.5 w-full cursor-pointer rounded-full bg-space-800 overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              handleSeek(pct);
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.round(audioProgress * 100)}%`,
                background: theme.primary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Clean, toggleable transcript preview */}
      {showCaptions && firstPersonLog && (
        <div className="rounded-lg border border-space-800/80 bg-space-950/70 p-2 mt-0.5">
          <p className="text-[11px] italic leading-snug text-regolith-300">
            "{firstPersonLog}"
          </p>
        </div>
      )}
    </div>
  );
}
