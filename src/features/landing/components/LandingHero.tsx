import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Rocket, BookOpen, Sparkles, Compass } from "lucide-react";

export function LandingHero() {
  const scrollToGuide = () => {
    const el = document.getElementById("how-to-play");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background Cosmic Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-signal-500/15 via-warn-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-scan-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-signal-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Playful Hero Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:col-span-7 lg:text-left"
          >
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-signal-500/30 bg-signal-500/10 px-3.5 py-1 text-xs font-semibold text-signal-500 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-warn-500" />
              <span>3D Moon & Mars Historical Simulator</span>
            </div>

            {/* Catchy Main Heading */}
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-regolith-100 sm:text-6xl md:text-7xl">
              Ready for Liftoff,{" "}
              <span className="bg-gradient-to-r from-signal-500 via-warn-500 to-amber-300 bg-clip-text text-transparent">
                Little Explorer?
              </span>
            </h1>

            {/* Childish & Welcoming Subtitle */}
            <p className="mt-4 text-base leading-relaxed text-regolith-300 sm:text-lg md:text-xl">
              Blast off on genuine Saturn V rockets, leap in lunar low gravity, and scan historical rovers and Apollo landers left behind on other worlds. Real NASA terrain, zero boring lectures!
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/missions"
                  className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-signal-500 via-signal-500 to-warn-500 px-8 py-4 font-display text-xl font-bold text-space-950 shadow-xl shadow-signal-500/30 transition-all hover:shadow-2xl hover:shadow-signal-500/40"
                >
                  <Rocket className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  <span>START MISSION</span>
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToGuide}
                className="flex items-center gap-2.5 rounded-2xl border border-space-700 bg-space-900/80 px-6 py-4 font-display text-lg font-semibold text-regolith-200 backdrop-blur transition-colors hover:border-space-500 hover:bg-space-800"
              >
                <BookOpen className="h-5 w-5 text-signal-500" />
                <span>How to Play</span>
              </motion.button>
            </div>

            {/* Quick Stat Pills */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-space-800 bg-space-900/60 p-3 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-regolith-100">6</p>
                <p className="text-xs text-regolith-400">Apollo Landing Sites</p>
              </div>
              <div className="rounded-xl border border-space-800 bg-space-900/60 p-3 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-signal-500">6</p>
                <p className="text-xs text-regolith-400">Mars Rovers & Landers</p>
              </div>
              <div className="rounded-xl border border-space-800 bg-space-900/60 p-3 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-warn-500">1/6th G</p>
                <p className="text-xs text-regolith-400">Real Lunar Bounding</p>
              </div>
              <div className="rounded-xl border border-space-800 bg-space-900/60 p-3 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-ok-500">60+</p>
                <p className="text-xs text-regolith-400">Historical Relics</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Cartoon Astronaut Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:col-span-5"
          >
            {/* Mascot Container */}
            <div className="relative">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 -m-6 animate-pulse rounded-full bg-gradient-to-tr from-signal-500/25 via-warn-500/20 to-transparent blur-2xl" />

              {/* Orbital Ring Element */}
              <div className="pointer-events-none absolute -inset-8 rounded-full border border-signal-500/20 [animation:spin_28s_linear_infinite]" />

              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-10 -left-6 z-20 max-w-[210px] rounded-2xl border border-space-700/80 bg-space-900/95 p-3 shadow-xl backdrop-blur-md sm:-top-8 sm:-left-12"
              >
                <div className="flex items-start gap-2">
                  <Compass className="h-4 w-4 shrink-0 text-signal-500" />
                  <p className="text-xs leading-snug font-medium text-regolith-200">
                    "Hey Explorer! Pick a mission and come jump on the Moon with me!"
                  </p>
                </div>
                <div className="absolute -bottom-2 left-10 h-3 w-3 rotate-45 border-r border-b border-space-700/80 bg-space-900" />
              </motion.div>

              {/* Astronaut Mascot with Gentle Floating Animation */}
              <motion.div
                animate={{
                  y: [0, -16, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.06, rotate: 0 }}
                className="relative z-10 flex h-72 w-72 items-center justify-center rounded-full border-4 border-signal-500/40 bg-gradient-to-b from-space-800/80 via-space-900/90 to-space-950 p-4 shadow-2xl shadow-signal-500/30 sm:h-80 sm:w-80 md:h-96 md:w-96"
              >
                <img
                  src="/art/astronaut.png"
                  alt="Cosmosyy Cartoon Astronaut Mascot"
                  className="h-full w-full object-contain drop-shadow-[0_15px_30px_rgba(255,107,44,0.4)]"
                />

                {/* Badge Tag */}
                <div className="absolute -bottom-3 rounded-full border border-warn-500/50 bg-space-950 px-4 py-1 text-xs font-bold text-warn-500 shadow-lg">
                  🧑‍🚀 Commander Cadet
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
