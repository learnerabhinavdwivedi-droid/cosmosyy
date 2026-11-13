import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, BookOpen, Sparkles, Compass, Volume2 } from "lucide-react";
import { playQuindar, playBeep } from "../../../lib/gameAudio";

const ASTRONAUT_QUOTES = [
  "Hey Explorer! Tap me to do a zero-g backflip!",
  "Did you know? Moon footprints stay for over 100 million years without wind!",
  "On Mars, gravity is 38% of Earth — your leaps are 2.6x higher!",
  "Saturn V burned 20 metric tonnes of rocket fuel per second at launch!",
  "Over 60 real NASA historical relics are waiting for you to scan!",
];

export function LandingHero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDegree, setFlipDegree] = useState(0);

  const scrollToGuide = () => {
    const el = document.getElementById("how-to-play");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    playBeep(650, 0.08);
  };

  const handleAstronautClick = () => {
    playQuindar();
    setIsFlipping(true);
    setFlipDegree((prev) => prev + 360);
    setQuoteIndex((prev) => (prev + 1) % ASTRONAUT_QUOTES.length);
    setTimeout(() => {
      setIsFlipping(false);
    }, 900);
  };

  const handleStartMissionClick = () => {
    playQuindar();
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
                  onClick={handleStartMissionClick}
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

          {/* Right Column: Floating Cut-Out Cartoon Astronaut Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:col-span-5"
          >
            <div className="relative flex flex-col items-center">
              
              {/* Outer Cosmic Nebular Glow behind transparent mascot */}
              <div className="pointer-events-none absolute -inset-10 animate-pulse rounded-full bg-gradient-to-tr from-signal-500/20 via-warn-500/20 to-blue-500/10 blur-3xl" />

              {/* Orbital Rings around mascot */}
              <div className="pointer-events-none absolute -inset-12 rounded-full border border-signal-500/20 [animation:spin_35s_linear_infinite]" />
              <div className="pointer-events-none absolute -inset-6 rounded-full border border-dashed border-warn-500/20 [animation:spin_25s_linear_infinite_reverse]" />

              {/* Dynamic Interactive Speech Bubble */}
              <div className="relative z-20 mb-4 max-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-space-700/90 bg-space-900/95 p-3.5 shadow-2xl backdrop-blur-md"
                  >
                    <div className="flex items-start gap-2.5">
                      <Compass className="h-4 w-4 shrink-0 text-signal-500 mt-0.5" />
                      <p className="text-xs leading-snug font-medium text-regolith-200">
                        "{ASTRONAUT_QUOTES[quoteIndex]}"
                      </p>
                    </div>
                    {/* Speech Triangle pointing down towards astronaut */}
                    <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-space-700/90 bg-space-900" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Transparent Mascot with Zero-G Float + Click Flip */}
              <motion.div
                onClick={handleAstronautClick}
                title="Click me to do a zero-g backflip!"
                animate={{
                  y: isFlipping ? [0, -35, 0] : [0, -18, 0],
                  rotate: flipDegree,
                }}
                transition={{
                  y: {
                    duration: isFlipping ? 0.9 : 4.5,
                    repeat: isFlipping ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 0.85,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 cursor-pointer select-none"
              >
                {/* Astronaut Cutout Image */}
                <img
                  src="/art/astronaut.png"
                  alt="Cosmosyy Cartoon Astronaut Mascot"
                  className="h-64 w-auto object-contain drop-shadow-[0_20px_40px_rgba(255,107,44,0.45)] sm:h-76 md:h-88 transition-transform"
                />

                {/* Gentle Thruster Embers Glow beneath feet */}
                <div className="pointer-events-none absolute -bottom-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-signal-500/40 blur-md animate-pulse" />
              </motion.div>

              {/* Playful Click Me Badge */}
              <motion.button
                onClick={handleAstronautClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-warn-500/60 bg-space-950/90 px-4 py-1.5 text-xs font-bold text-warn-500 shadow-xl backdrop-blur transition-colors hover:bg-space-900"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Tap Astronaut to Flip! 🧑‍🚀</span>
              </motion.button>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
