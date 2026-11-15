import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Volume2, VolumeX, Rocket, Maximize2, Minimize2 } from "lucide-react";
import { gameAudio } from "@/lib/gameAudio";
import { useFullscreen } from "@/lib/fullscreen";

export function LandingNavbar() {
  const [soundPlaying, setSoundPlaying] = useState(false);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  const toggleSound = () => {
    gameAudio.unlock();
    if (soundPlaying) {
      gameAudio.stopLunarHum();
      gameAudio.stopSpaceDrone();
      setSoundPlaying(false);
    } else {
      gameAudio.startSpaceDrone();
      gameAudio.playQuindar();
      setSoundPlaying(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-2.5 py-2.5 sm:px-6 sm:py-4">
      <div className="mx-auto max-w-7xl">
        {/* Floating Capsule with Dual-Tone Gradient Glow Border (Orange on left, Blue on right) */}
        <div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-orange-500/80 via-white/10 to-sky-500/80 shadow-[0_4px_30px_rgba(0,0,0,0.7)] transition-all">
          <div className="relative flex items-center justify-between overflow-hidden rounded-full bg-space-950/85 backdrop-blur-xl px-3.5 py-2 sm:px-6 sm:py-2.5">
            {/* Ambient Orange & Blue Accent Lighting inside the capsule */}
            <div
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-10 w-36 rounded-full bg-orange-500/25 blur-xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-10 w-48 rounded-full bg-sky-500/25 blur-xl"
              aria-hidden="true"
            />

            {/* Brand Logo with 3-Dot Orbital Ring */}
            <Link
              to="/"
              className="group flex items-center gap-2 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
              aria-label="Cosmosyy Home"
            >
              {/* Golden Orbit Ring Icon with Orbiting Planet Dots */}
              <div className="relative flex h-7 w-7 items-center justify-center shrink-0">
                <svg
                  className="h-7 w-7 text-amber-400 transition-transform duration-700 group-hover:rotate-45"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Tilted elliptical orbit ring */}
                  <ellipse
                    cx="14"
                    cy="14"
                    rx="11"
                    ry="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    transform="rotate(-28 14 14)"
                    className="opacity-90 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  />
                  {/* 3 Orbiting Planet Dots */}
                  <circle cx="6" cy="16" r="1.6" fill="#FDE68A" />
                  <circle cx="14" cy="9.5" r="1.8" fill="#FBBF24" />
                  <circle cx="22" cy="12" r="1.5" fill="#F59E0B" />
                </svg>
              </div>

              {/* Brand Typography: Cosmos in White, yy in Amber Gold */}
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,140,0,0.3)]">
                Cosmos<span className="text-amber-400">yy</span>
              </span>
            </Link>

            {/* Action Buttons: Sound & Missions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Audio Preview Toggle Pill */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSound}
                aria-label={
                  soundPlaying ? "Mute space ambient sound" : "Play space ambient sound preview"
                }
                title={soundPlaying ? "Mute ambient sound" : "Play space ambient sound preview"}
                className={`flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  soundPlaying
                    ? "border-ok-500/70 bg-ok-500/20 text-ok-400 shadow-[0_0_12px_rgba(34,197,94,0.35)]"
                    : "border-white/20 bg-space-900/70 text-regolith-200 hover:text-white hover:border-white/40 hover:bg-space-800/80"
                }`}
              >
                {soundPlaying ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 animate-pulse text-ok-400 shrink-0" />
                    <span className="hidden xs:inline">Sound</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-regolith-300 shrink-0" />
                    <span className="hidden xs:inline">Sound</span>
                  </>
                )}
              </motion.button>

              {/* Focus Mode / Fullscreen Toggle */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Focus Mode"}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Focus Mode"}
                className={`flex min-h-[40px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isFullscreen
                    ? "border-signal-500/70 bg-signal-500/20 text-signal-400 shadow-[0_0_12px_rgba(255,107,44,0.3)]"
                    : "border-white/20 bg-space-900/70 text-regolith-200 hover:text-white hover:border-white/40 hover:bg-space-800/80"
                }`}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5 text-signal-400 shrink-0" />
                    <span className="hidden md:inline">Exit Focus</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5 text-regolith-300 shrink-0" />
                    <span className="hidden md:inline">Focus Mode</span>
                  </>
                )}
              </motion.button>

              {/* Start Mission Quick Pill */}
              <Link
                to="/missions"
                className="flex min-h-[40px] items-center gap-1.5 rounded-full border border-signal-500/70 bg-signal-500/20 px-4 py-1.5 text-xs font-bold text-signal-400 shadow-[0_0_14px_rgba(255,107,44,0.25)] transition-all hover:border-signal-400 hover:bg-signal-500/35 hover:text-white hover:shadow-signal-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
              >
                <Rocket className="h-3.5 w-3.5 text-signal-400 shrink-0" />
                <span className="hidden sm:inline">Launch Mission</span>
                <span className="inline sm:hidden">Missions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
