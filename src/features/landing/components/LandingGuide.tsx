import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Radio, Compass, Rocket } from "lucide-react";

export function LandingGuide() {
  return (
    <section id="how-to-play" className="relative py-12 md:py-16">
      {/* Background Section Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-warn-500/30 bg-warn-500/10 px-3.5 py-1 text-xs font-semibold text-warn-500">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive README & How to Play</span>
          </div>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-regolith-100 sm:text-5xl">
            How to Explore{" "}
            <span className="bg-gradient-to-r from-signal-500 to-warn-500 bg-clip-text text-transparent">
              Cosmosyy
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-regolith-300 sm:text-lg">
            Master the flight controls, leap across craters in low gravity, and recover lost relics in four simple steps!
          </p>
        </div>

        {/* Step 1: Destination Selection Featuring Moon & Mars Art */}
        <div className="mt-14">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-space-700/70 bg-gradient-to-b from-space-850/80 to-space-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500/20 font-mono text-sm font-bold text-signal-500">
                01
              </span>
              <h3 className="font-display text-2xl font-bold text-regolith-100 sm:text-3xl">
                Choose Your World: Moon vs. Mars
              </h3>
            </div>
            <p className="mt-2 text-sm text-regolith-300 sm:text-base">
              Select between crewed Apollo lunar landings or robotic Mars rovers and landers.
            </p>

            {/* Interactive Side-by-Side Planet Cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Moon Card with user cartoon moon */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center rounded-2xl border border-space-700/80 bg-space-900/90 p-6 text-center transition-all hover:border-signal-500/60 hover:shadow-xl hover:shadow-signal-500/10"
              >
                <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-space-700/60 bg-space-950 p-2 shadow-inner group-hover:border-signal-500/60 sm:h-52 sm:w-52">
                  <img
                    src="/art/moon.png"
                    alt="Cartoon Moon"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950/40 via-transparent to-transparent" />
                </div>

                <div className="mt-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-signal-500/15 px-3 py-0.5 text-xs font-bold text-signal-500">
                    <span>🌕 The Moon (Apollo 11–17)</span>
                  </div>
                  <h4 className="mt-2 font-display text-xl font-bold text-regolith-100">
                    6 Historical Landing Sites
                  </h4>
                  <p className="mt-1 text-xs text-regolith-400">
                    Sea of Tranquility, Ocean of Storms, Fra Mauro, Hadley Rille, Descartes, Taurus-Littrow.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-regolith-300">
                    Gravity: <span className="text-signal-500">1.62 m/s²</span> · Experience high lunar lopes!
                  </p>
                </div>
              </motion.div>

              {/* Mars Card with user cartoon mars */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center rounded-2xl border border-space-700/80 bg-space-900/90 p-6 text-center transition-all hover:border-warn-500/60 hover:shadow-xl hover:shadow-warn-500/10"
              >
                <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-space-700/60 bg-space-950 p-2 shadow-inner group-hover:border-warn-500/60 sm:h-52 sm:w-52">
                  <img
                    src="/art/mars.jpg"
                    alt="Cartoon Mars"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950/40 via-transparent to-transparent" />
                </div>

                <div className="mt-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-warn-500/15 px-3 py-0.5 text-xs font-bold text-warn-500">
                    <span>🪐 Mars (Robotic Explorers)</span>
                  </div>
                  <h4 className="mt-2 font-display text-xl font-bold text-regolith-100">
                    Viking, Pathfinder & Rovers
                  </h4>
                  <p className="mt-1 text-xs text-regolith-400">
                    Viking 1, Mars Pathfinder, Spirit, Opportunity, Curiosity, Perseverance.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-regolith-300">
                    Gravity: <span className="text-warn-500">3.72 m/s²</span> · Butterscotch sky & dust wind!
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Steps 2, 3, 4 Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col rounded-3xl border border-space-700/70 bg-space-900/80 p-6 shadow-xl backdrop-blur transition-all hover:border-signal-500/40 sm:p-7"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-500/20 font-mono text-xs font-bold text-signal-500">
                02
              </span>
              <Rocket className="h-5 w-5 text-signal-500" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-regolith-100 sm:text-2xl">
              Rocket Staging & Spaceflight
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-regolith-300">
              Watch the massive Saturn V fire into space. Experience real booster staging during coast, interplanetary cruise separation on Mars, and atmospheric entry.
            </p>
            <div className="mt-auto pt-6">
              <span className="inline-block rounded-lg bg-space-800/80 px-3 py-1.5 font-mono text-xs text-regolith-400">
                ⚡ Press [SPACE] at target lock
              </span>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col rounded-3xl border border-space-700/70 bg-space-900/80 p-6 shadow-xl backdrop-blur transition-all hover:border-warn-500/40 sm:p-7"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-warn-500/20 font-mono text-xs font-bold text-warn-500">
                03
              </span>
              <Sparkles className="h-5 w-5 text-warn-500" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-regolith-100 sm:text-2xl">
              Low-G Walking & Bounding
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-regolith-300">
              The Moon has 1/6th of Earth's gravity and Mars has 38%. Jump meters into the air, kick up real regolith dust clouds, and hear your suit breathing or Martian wind!
            </p>
            <div className="mt-auto pt-6">
              <span className="inline-block rounded-lg bg-space-800/80 px-3 py-1.5 font-mono text-xs text-regolith-400">
                🦘 [SPACE] to giant jump
              </span>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col rounded-3xl border border-space-700/70 bg-space-900/80 p-6 shadow-xl backdrop-blur transition-all hover:border-ok-500/40 sm:p-7"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ok-500/20 font-mono text-xs font-bold text-ok-500">
                04
              </span>
              <Radio className="h-5 w-5 text-ok-500" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-regolith-100 sm:text-2xl">
              Scan Relics & Plant Flag
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-regolith-300">
              Follow golden radar beacons to abandoned lunar modules, rover tracks, seismometers, and sample caches. Hold [E] to inspect and listen to voice archives, then plant your flag!
            </p>
            <div className="mt-auto pt-6">
              <span className="inline-block rounded-lg bg-space-800/80 px-3 py-1.5 font-mono text-xs text-regolith-400">
                🚩 [E] Scan · [F] Flag · [L] Launch
              </span>
            </div>
          </motion.div>

        </div>

        {/* Big Bottom Action Strip */}
        <div className="mt-12 text-center">
          <Link
            to="/missions"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-signal-500 to-warn-500 px-8 py-4 font-display text-xl font-bold text-space-950 shadow-xl shadow-signal-500/25 transition-transform hover:scale-105"
          >
            <span>Ready? Enter the Mission Select Hub</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
