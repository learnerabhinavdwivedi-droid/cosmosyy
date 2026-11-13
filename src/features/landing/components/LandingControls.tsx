import { motion } from "motion/react";
import { Gamepad2, Award, ShieldCheck } from "lucide-react";

export function LandingControls() {
  const controls = [
    { key: "W A S D", label: "Walk / Drive", desc: "Move across the surface" },
    { key: "SHIFT", label: "Sprint", desc: "Run faster on terrain" },
    { key: "SPACE", label: "Low-G Jump", desc: "Leap meters in 1/6th gravity" },
    { key: "E", label: "Scan Hardware", desc: "Hold to inspect & listen" },
    { key: "F", label: "Plant Flag", desc: "Mark your discovery" },
    { key: "L", label: "Launch Home", desc: "Ascent stage fire & return" },
  ];

  const ranks = [
    {
      level: "Cadet",
      xp: "0 – 99 XP",
      color: "border-regolith-400/40 text-regolith-300",
      desc: "Your journey begins. Touch down safely and scan your first artifact.",
    },
    {
      level: "Pilot",
      xp: "100 – 299 XP",
      color: "border-warn-500/50 text-warn-500",
      desc: "Master the lunar rover, plant your flag, and complete Apollo 11 & 12.",
    },
    {
      level: "Commander",
      xp: "300+ XP",
      color: "border-signal-500/60 text-signal-500",
      desc: "Veteran explorer of all 12 Moon and Mars missions. The solar system is yours!",
    },
  ];

  return (
    <section className="relative py-14 md:py-20 border-t border-space-800/80 bg-space-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Explorer Controls Cheat Sheet */}
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
                  Keyboard & mouse controls for full freedom on the lunar and Martian surface.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {controls.map((c) => (
                <motion.div
                  key={c.key}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="flex flex-col rounded-2xl border border-space-700/60 bg-space-900/90 p-4 shadow-sm backdrop-blur"
                >
                  <div className="inline-block self-start rounded-lg border border-space-600/80 bg-space-800/90 px-2.5 py-1 font-mono text-xs font-bold text-warn-500 shadow-inner">
                    {c.key}
                  </div>
                  <h4 className="mt-3 font-display text-base font-bold text-regolith-200">
                    {c.label}
                  </h4>
                  <p className="mt-0.5 text-xs text-regolith-400">
                    {c.desc}
                  </p>
                </motion.div>
              ))}
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

            <div className="mt-8 flex flex-col gap-3.5">
              {ranks.map((r) => (
                <div
                  key={r.level}
                  className={`rounded-2xl border bg-space-900/70 p-4 backdrop-blur ${r.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-display text-lg font-bold">
                        {r.level}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-regolith-300">
                      {r.xp}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-regolith-300">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
