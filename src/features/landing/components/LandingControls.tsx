import { useState } from "react";
import { motion } from "motion/react";
import { Gamepad2, Award, ShieldCheck, Sparkles, Smartphone, CheckCircle2 } from "lucide-react";
import { playBeep } from "../../../lib/gameAudio";
import { useAppStore } from "../../../store/useAppStore";

export function LandingControls() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const getRank = useAppStore((s) => s.getRank);
  const currentRank = getRank();

  const controls = [
    { key: "W A S D", label: "Walk / Drive", desc: "Move across the surface", freq: 440 },
    { key: "SHIFT", label: "Sprint", desc: "Run faster on terrain", freq: 520 },
    { key: "SPACE", label: "Low-G Jump", desc: "Leap meters in 1/6th gravity", freq: 660 },
    { key: "E", label: "Scan Hardware", desc: "Hold to inspect & listen", freq: 780 },
    { key: "F", label: "Plant Flag", desc: "Mark your discovery", freq: 880 },
    { key: "L", label: "Launch Home", desc: "Ascent stage fire & return", freq: 990 },
  ];

  const ranks = [
    {
      level: "Cadet",
      xp: "0 – 99 XP",
      minXp: 0,
      maxXp: 99,
      color: "border-regolith-400/40 text-regolith-300",
      desc: "Your journey begins. Touch down safely and scan your first artifact.",
    },
    {
      level: "Pilot",
      xp: "100 – 299 XP",
      minXp: 100,
      maxXp: 299,
      color: "border-warn-500/50 text-warn-500",
      desc: "Master the lunar rover, plant your flag, and complete Apollo 11 & 12.",
    },
    {
      level: "Commander",
      xp: "300+ XP",
      minXp: 300,
      maxXp: 9999,
      color: "border-signal-500/60 text-signal-500",
      desc: "Veteran explorer of all 12 Moon and Mars missions. The solar system is yours!",
    },
  ];

  const handleKeyClick = (key: string, freq: number) => {
    setActiveKey(key);
    playBeep(freq, 0.1);
    setTimeout(() => {
      setActiveKey((prev) => (prev === key ? null : prev));
    }, 300);
  };

  return (
    <section
      id="controls"
      className="relative py-12 md:py-16 border-t border-space-800/60 bg-transparent"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Explorer Controls Cheat Sheet with Interactive Testing */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-500/20 text-signal-500">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-regolith-100 sm:text-3xl">
                  Explorer Controls Cheat Sheet
                </h3>
                <p className="text-xs text-regolith-400">
                  Tap any key to test the tactile sound feedback. Full keyboard & mouse support!
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {controls.map((c) => {
                const isPressed = activeKey === c.key;
                return (
                  <motion.div
                    key={c.key}
                    role="button"
                    tabIndex={0}
                    aria-label={`Test control key: ${c.key} - ${c.label}`}
                    onClick={() => handleKeyClick(c.key, c.freq)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleKeyClick(c.key, c.freq);
                      }
                    }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex min-h-[44px] cursor-pointer flex-col rounded-2xl border p-4 shadow-sm backdrop-blur transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 ${
                      isPressed
                        ? "border-signal-500 bg-signal-500/15 shadow-md shadow-signal-500/20 scale-105"
                        : "border-space-700/60 bg-space-900/90 hover:border-space-500"
                    }`}
                  >
                    <div
                      className={`inline-block self-start rounded-lg border px-2.5 py-1 font-mono text-xs font-bold shadow-inner transition-colors ${
                        isPressed
                          ? "border-signal-500 bg-signal-500 text-space-950"
                          : "border-space-600/80 bg-space-800/90 text-warn-500"
                      }`}
                    >
                      {c.key}
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-regolith-200">
                      {c.label}
                    </h4>
                    <p className="mt-0.5 text-xs text-regolith-400">{c.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Touch Controls Guidance Banner */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 p-4 text-xs text-sky-200 backdrop-blur">
              <Smartphone className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sky-100">Touch & Mobile Ready Ergonomics</p>
                <p className="mt-0.5 text-sky-200/90 leading-relaxed">
                  On phones and tablets, interactive virtual thumbsticks and large on-screen action
                  buttons activate automatically in the 3D surface view.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Explorer Passport & Ranks */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warn-500/20 text-warn-500">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-regolith-100 sm:text-3xl">
                  Explorer Passport Ranks
                </h3>
                <p className="text-xs text-regolith-400">
                  Earn XP from touchdowns, relic scans, and flag planting.
                </p>
              </div>
            </div>

            {/* Live Passport Status Card */}
            <div className="mt-6 rounded-2xl border border-signal-500/40 bg-gradient-to-br from-space-900/95 to-space-950 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-regolith-400">
                    Active Explorer Status
                  </p>
                  <p className="font-display text-xl font-black text-white">
                    Rank: <span className="text-signal-500">{currentRank}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-regolith-400">
                    Total Progress
                  </p>
                  <p className="font-mono text-xl font-bold text-amber-400">
                    {totalXp} <span className="text-xs font-normal text-regolith-400">XP</span>
                  </p>
                </div>
              </div>
              {/* Progress bar to next rank */}
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-space-800">
                  <div
                    className="h-full bg-gradient-to-r from-signal-500 via-warn-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(8, (totalXp / 300) * 100))}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] font-mono text-regolith-400">
                  <span>Cadet (0 XP)</span>
                  <span>Pilot (100 XP)</span>
                  <span>Commander (300 XP)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {ranks.map((r) => {
                const isActive = currentRank === r.level;
                return (
                  <div
                    key={r.level}
                    className={`rounded-2xl border bg-space-900/70 p-4 backdrop-blur transition-all ${
                      isActive
                        ? "border-signal-500 ring-2 ring-signal-500/30 bg-space-900/90"
                        : r.color
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-signal-500 shrink-0" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 shrink-0" />
                        )}
                        <span className="font-display text-lg font-bold text-regolith-100">
                          {r.level}
                        </span>
                        {isActive && (
                          <span className="rounded-full bg-signal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal-500">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-semibold text-regolith-300">
                        {r.xp}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-regolith-300">{r.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Badge */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-space-800 bg-space-900/40 p-3 text-xs text-regolith-400">
              <Sparkles className="h-4 w-4 text-signal-500 shrink-0" />
              <span>XP saves automatically to your browser passport storage.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
