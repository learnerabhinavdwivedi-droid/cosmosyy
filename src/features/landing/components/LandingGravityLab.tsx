import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, Sparkles, ArrowUp } from "lucide-react";
import { playBeep, playThud } from "../../../lib/gameAudio";

type PlanetId = "earth" | "mars" | "moon";

interface GravityConfig {
  name: string;
  badge: string;
  gravity: number; // m/s²
  gravityRatio: string;
  jumpHeightMeters: number;
  hangTimeSec: number;
  weight60kg: number;
  dustColor: string;
  themeColor: string;
  jumpDuration: number;
  jumpPixelY: number;
  fact: string;
}

const PLANETS: Record<PlanetId, GravityConfig> = {
  earth: {
    name: "Earth",
    badge: "🌍 Earth (1G)",
    gravity: 9.8,
    gravityRatio: "1.00x",
    jumpHeightMeters: 0.5,
    hangTimeSec: 0.64,
    weight60kg: 60,
    dustColor: "#8c7853",
    themeColor: "from-blue-500/20 to-emerald-500/10 border-blue-500/40 text-blue-400",
    jumpDuration: 0.65,
    jumpPixelY: -50,
    fact: "Standard Earth gravity. A full space suit (80 kg) makes movement heavy and tiring.",
  },
  mars: {
    name: "Mars",
    badge: "🪐 Mars (0.38G)",
    gravity: 3.72,
    gravityRatio: "0.38x",
    jumpHeightMeters: 1.3,
    hangTimeSec: 1.68,
    weight60kg: 22.8,
    dustColor: "#c4856a",
    themeColor: "from-warn-500/20 to-amber-500/10 border-warn-500/40 text-warn-500",
    jumpDuration: 1.5,
    jumpPixelY: -110,
    fact: "38% of Earth gravity! You jump 2.6x higher and fall back down in slow motion through butterscotch dust.",
  },
  moon: {
    name: "Moon",
    badge: "🌕 Moon (0.16G)",
    gravity: 1.62,
    gravityRatio: "0.16x",
    jumpHeightMeters: 3.0,
    hangTimeSec: 3.86,
    weight60kg: 10,
    dustColor: "#cfcbc2",
    themeColor: "from-signal-500/20 to-warn-500/10 border-signal-500/40 text-signal-500",
    jumpDuration: 2.8,
    jumpPixelY: -175,
    fact: "1/6th of Earth gravity! Astronauts famously 'bunny-hopped' across crater rims because leaping is easier than walking.",
  },
};

export function LandingGravityLab() {
  const [activePlanet, setActivePlanet] = useState<PlanetId>("moon");
  const [isJumping, setIsJumping] = useState(false);

  const current = PLANETS[activePlanet];

  const triggerJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    playBeep(activePlanet === "moon" ? 950 : activePlanet === "mars" ? 780 : 600, 0.1);

    setTimeout(() => {
      playThud();
      setIsJumping(false);
    }, current.jumpDuration * 1000);
  };

  const handleSelect = (p: PlanetId) => {
    setActivePlanet(p);
    playBeep(700, 0.08);
  };

  return (
    <section id="gravity-lab" className="relative py-12 md:py-16 border-t border-space-800/60 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal-500/30 bg-signal-500/10 px-3.5 py-1 text-xs font-semibold text-signal-500 backdrop-blur">
            <Gauge className="h-3.5 w-3.5 text-warn-500" />
            <span>Interactive Gravity Simulator</span>
          </div>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-regolith-100 sm:text-5xl">
            Test Lunar & Martian{" "}
            <span className="bg-gradient-to-r from-signal-500 to-warn-500 bg-clip-text text-transparent">
              Low Gravity
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-regolith-300">
            See how high our cartoon explorer leaps on each world. Notice how slow and floaty the Moon's 1.62 m/s² feels!
          </p>
        </div>

        {/* Planet Switcher Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3 px-2">
          {(["earth", "mars", "moon"] as PlanetId[]).map((pid) => {
            const p = PLANETS[pid];
            const isSelected = activePlanet === pid;
            return (
              <button
                key={pid}
                onClick={() => handleSelect(pid)}
                aria-pressed={isSelected}
                aria-label={`Select ${p.name} Gravity: ${p.gravity} meters per second squared`}
                className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-sm font-bold transition-all sm:px-5 sm:py-3 sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 ${
                  isSelected
                    ? "bg-gradient-to-r from-signal-500 to-warn-500 text-space-950 shadow-lg shadow-signal-500/25 scale-105"
                    : "border border-space-700 bg-space-900/80 text-regolith-300 hover:border-space-500 hover:bg-space-800"
                }`}
              >
                <span>{p.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Stage */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-space-700/80 bg-space-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            
            {/* Visual Leaping Canvas Stage */}
            <div
              role="button"
              tabIndex={0}
              aria-label={`Interactive low-gravity leaping canvas. Currently simulating ${current.name}. Click or press Enter to leap.`}
              onClick={triggerJump}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerJump();
                }
              }}
              className="relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl border border-space-800 bg-space-950/80 p-6 lg:col-span-7 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 transition-all hover:border-space-600"
            >
              {/* Star sparkles */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Height Ruler Markers */}
              <div className="pointer-events-none absolute left-4 top-4 bottom-14 flex flex-col justify-between font-mono text-[10px] text-regolith-400">
                <span>3.0m (Moon Peak)</span>
                <span>2.0m</span>
                <span>1.3m (Mars Peak)</span>
                <span>0.5m (Earth Peak)</span>
                <span>0.0m Ground</span>
              </div>

              {/* Ground Line */}
              <div
                className="absolute bottom-10 left-0 right-0 h-2 transition-colors duration-500"
                style={{ backgroundColor: current.dustColor }}
              />

              {/* Floating Leaping Mascot */}
              <div className="relative z-10 flex w-full justify-center pb-2">
                <motion.div
                  animate={
                    isJumping
                      ? {
                          y: [0, current.jumpPixelY, 0],
                          rotate: activePlanet === "moon" ? [0, -12, 12, 0] : [0, -6, 0],
                        }
                      : { y: 0, rotate: 0 }
                  }
                  transition={
                    isJumping
                      ? {
                          duration: current.jumpDuration,
                          ease: "easeInOut",
                          times: [0, 0.45, 1],
                        }
                      : { duration: 0.2 }
                  }
                  className="relative flex flex-col items-center"
                >
                  {/* Dust Puff when landing */}
                  {isJumping && (
                    <motion.div
                      initial={{ scale: 0.2, opacity: 0.8 }}
                      animate={{ scale: [0.5, 1.8, 2.5], opacity: [0.8, 0.4, 0] }}
                      transition={{ duration: 0.6, delay: current.jumpDuration * 0.85 }}
                      className="absolute -bottom-2 h-4 w-20 rounded-full blur-sm"
                      style={{ backgroundColor: current.dustColor }}
                    />
                  )}

                  <img
                    src="/art/astronaut.png"
                    alt="Leaping Cartoon Astronaut Mascot"
                    className="h-28 w-28 object-contain drop-shadow-[0_8px_16px_rgba(255,107,44,0.3)] sm:h-32 sm:w-32"
                  />
                </motion.div>
              </div>

              {/* Jump Trigger CTA */}
              <div className="relative z-20 flex justify-center pt-3">
                <button
                  onClick={triggerJump}
                  disabled={isJumping}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-signal-500 to-warn-500 px-6 py-2.5 font-display text-sm font-bold text-space-950 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>{isJumping ? "Leaping in Low-G..." : `Leap on ${current.name}!`}</span>
                </button>
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className="flex flex-col justify-center lg:col-span-5" aria-live="polite" aria-atomic="true">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warn-500" />
                <h3 className="font-display text-2xl font-bold text-regolith-100">
                  {current.name} Physics Telemetry
                </h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlanet}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 flex flex-col gap-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-space-700/80 bg-space-950/60 p-3.5">
                      <p className="text-xs text-regolith-400">Surface Gravity</p>
                      <p className="mt-1 font-mono text-xl font-bold text-regolith-100">
                        {current.gravity} <span className="text-xs text-regolith-400">m/s²</span>
                      </p>
                      <p className="text-[11px] font-medium text-warn-500">{current.gravityRatio} Earth</p>
                    </div>

                    <div className="rounded-xl border border-space-700/80 bg-space-950/60 p-3.5">
                      <p className="text-xs text-regolith-400">Max Leap Height</p>
                      <p className="mt-1 font-mono text-xl font-bold text-signal-500">
                        {current.jumpHeightMeters} <span className="text-xs text-regolith-400">meters</span>
                      </p>
                      <p className="text-[11px] font-medium text-regolith-400">
                        {(current.jumpHeightMeters / 0.5).toFixed(1)}x Earth jump
                      </p>
                    </div>

                    <div className="rounded-xl border border-space-700/80 bg-space-950/60 p-3.5">
                      <p className="text-xs text-regolith-400">Air Hang-Time</p>
                      <p className="mt-1 font-mono text-xl font-bold text-ok-500">
                        {current.hangTimeSec} <span className="text-xs text-regolith-400">sec</span>
                      </p>
                      <p className="text-[11px] font-medium text-regolith-400">Floaty suspension</p>
                    </div>

                    <div className="rounded-xl border border-space-700/80 bg-space-950/60 p-3.5">
                      <p className="text-xs text-regolith-400">60 kg Body Weight</p>
                      <p className="mt-1 font-mono text-xl font-bold text-warn-500">
                        {current.weight60kg} <span className="text-xs text-regolith-400">kg</span>
                      </p>
                      <p className="text-[11px] font-medium text-regolith-400">Feels super light!</p>
                    </div>
                  </div>

                  {/* Planet Fun Fact Box */}
                  <div className="rounded-2xl border border-space-700/80 bg-space-950/70 p-4">
                    <p className="text-xs font-medium leading-relaxed text-regolith-300">
                      💡 {current.fact}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
