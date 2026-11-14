import { useRef, useEffect, useState, useCallback } from "react";
import { Howl } from "howler";
import { gameAudio } from "@/lib/gameAudio";
import { stopNarration } from "@/lib/narration";
import type { ObjectTheme } from "./types";

interface AudioTransmissionDeckProps {
  missionId: string;
  objectId: string;
  objectName: string;
  firstPersonLog?: string;
  theme: ObjectTheme;
}

export function AudioTransmissionDeck({
  missionId,
  objectId,
  objectName,
  firstPersonLog,
  theme,
}: AudioTransmissionDeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [hasAudio, setHasAudio] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const soundRef = useRef<Howl | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 20 energetic equalizer bars with undulating natural frequency spectrum
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

      // Animate equalizer bars with rhythmic bounce
      setLiveBars((prev) =>
        prev.map((_, i) => {
          const t = Date.now() * 0.007;
          const wave = Math.sin(t + i * 0.45) * 0.5 + 0.5;
          const wave2 = Math.cos(t * 1.3 - i * 0.3) * 0.5 + 0.5;
          return Math.floor(25 + (wave * 0.6 + wave2 * 0.4) * 75);
        })
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
      if (audioProgress >= 1) {
        soundRef.current.seek(0);
        setAudioProgress(0);
      }
      soundRef.current.play();
      setIsPlaying(true);
      gameAudio.playScanTick();
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (pct: number) => {
    if (!soundRef.current || !hasAudio) return;
    const dur = soundRef.current.duration();
    if (dur > 0) {
      const targetSec = dur * pct;
      soundRef.current.seek(targetSec);
      setCurrentTime(targetSec);
      setAudioProgress(pct);
      if (!isPlaying) {
        soundRef.current.play();
        setIsPlaying(true);
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="mt-2.5 rounded-xl border p-3 backdrop-blur-md shrink-0 flex flex-col gap-2"
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
        <span className="font-mono text-[10px] text-regolith-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* 20-bar responsive audio visualizer */}
      <div className="flex h-7 items-end justify-between gap-1 px-1 py-0.5">
        {(isPlaying ? liveBars : idleBars).map((h, i) => (
          <div
            key={i}
            className="w-full rounded-t transition-all duration-75"
            style={{
              height: `${isPlaying ? h : Math.max(12, h * 0.28)}%`,
              background: isPlaying ? theme.primary : "rgba(148,163,184,0.25)",
              boxShadow: isPlaying ? `0 0 6px ${theme.glow}` : "none",
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

      {/* Play/Pause & Subtitle preview */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!hasAudio}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-bold text-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
          style={{
            borderColor: theme.border,
            background: theme.primaryDim,
            color: theme.primary,
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <p className="line-clamp-2 text-[11px] italic leading-tight text-regolith-300">
          "{firstPersonLog || `${objectName} telemetry voice log.`}"
        </p>
      </div>
    </div>
  );
}
