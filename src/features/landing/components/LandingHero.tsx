import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Rocket, BookOpen, Compass } from "lucide-react";
import { playQuindar, playBeep } from "../../../lib/gameAudio";

const SCROLL_QUOTES = [
  "Ready for liftoff, Little Explorer? Blast off to the Moon & Mars! 🚀",
  "Whoa, check out the Gravity Lab! 1/6th gravity on the Moon is super floaty! 🌕",
  "12 authentic NASA landing sites: Apollo 11, Lunar Rovers, and Viking 1! 🪐",
  "Master your thrusters: WASD to walk, SPACE to leap high, E to scan! 🕹️",
];

export function LandingHero() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll tracking for parallax and scroll-triggered astronaut reaction
  const { scrollY } = useScroll();
  const scrollRotate = useTransform(scrollY, [0, 600, 1200, 2000], [0, 18, -12, 8]);
  const scrollParallaxY = useTransform(scrollY, [0, 1000], [0, 80]);

  // Update speech bubble contextually as user scrolls down the page
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 450) {
        setActiveQuoteIndex(0);
      } else if (y < 1200) {
        setActiveQuoteIndex(1);
      } else if (y < 1900) {
        setActiveQuoteIndex(2);
      } else {
        setActiveQuoteIndex(3);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToGuide = () => {
    const el = document.getElementById("how-to-play");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    playBeep(650, 0.08);
  };

  const handleStartMissionClick = () => {
    playQuindar();
  };

  const handleMascotMouseEnter = () => {
    setIsHovered(true);
    playQuindar();
  };

  const handleMascotMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32">
      {/* Background Cosmic Atmosphere & Planetary Horizon */}
      
      {/* 1. Golden Spiral Galaxy in Upper Space */}
      <div
        className="pointer-events-none absolute top-4 left-1/2 h-80 w-80 -translate-x-1/2 opacity-40 blur-sm [animation:spin_90s_linear_infinite]"
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-tr from-transparent via-amber-500/20 to-orange-500/30 blur-2xl" />
        <div className="absolute inset-8 rounded-full border border-amber-400/20 border-dashed" />
        <div className="absolute inset-16 rounded-full border border-orange-400/30 border-dotted" />
      </div>

      {/* 2. Giant Glowing Mars/Planet Sphere on Upper Right */}
      <div
        className="pointer-events-none absolute -top-16 -right-24 h-[380px] w-[380px] rounded-full sm:h-[480px] sm:w-[480px] lg:-top-20 lg:-right-16 lg:h-[580px] lg:w-[580px]"
        aria-hidden="true"
      >
        {/* Planet Body with Crater Shading & Rim Light */}
        <div className="relative h-full w-full rounded-full bg-gradient-to-bl from-orange-600 via-amber-800 to-space-950 shadow-[-20px_20px_70px_rgba(255,110,0,0.45)]">
          {/* Atmosphere Crescent Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-amber-300/40 blur-md" />
          {/* Subtle Planet Ring Belt */}
          <div className="absolute -top-10 -right-10 h-[120%] w-[120%] rounded-full border border-amber-400/20 opacity-30 [transform:rotate(35deg)_scaleY(0.35)]" />
        </div>
      </div>

      {/* 3. Volcanic Mountain Terrain Ridge along the Bottom */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-36 md:h-52 overflow-hidden z-0" aria-hidden="true">
        {/* Magma Horizon Glow */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-orange-600/30 via-amber-500/15 to-transparent blur-2xl" />
        {/* Terrain Silhouette Image */}
        <img
          src="/art/martian-landscape.png"
          alt="Martian Volcanic Ridge"
          className="absolute bottom-0 inset-x-0 w-full h-full object-cover object-bottom opacity-80 select-none"
        />
      </div>

      {/* 4. Drifting Space Asteroids */}
      <div className="pointer-events-none absolute top-28 left-8 h-4 w-4 rounded-full bg-stone-700/60 blur-[0.5px] shadow-sm animate-pulse" />
      <div className="pointer-events-none absolute top-48 left-1/4 h-3 w-3 rounded-full bg-stone-800/80 blur-[0.5px]" />
      <div className="pointer-events-none absolute bottom-40 right-1/3 h-5 w-5 rounded-full bg-stone-700/70 blur-[0.5px]" />

      {/* Main Foreground Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Playful Hero Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:col-span-7 lg:text-left"
          >
            {/* Friendly Eyebrow Tag */}
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow-[0_0_10px_rgba(255,180,0,0.5)]">
                Real Moon & Mars Historical Simulator
              </span>
            </div>

            {/* Catchy Main Heading */}
            <h1 className="mt-4 font-display text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
              Ready for Liftoff,{" "}
              <span className="bg-gradient-to-r from-signal-500 via-warn-500 to-amber-300 bg-clip-text text-transparent">
                Little Explorer?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base leading-relaxed text-regolith-300 sm:text-lg md:text-xl max-w-2xl">
              Blast off on genuine Saturn V rockets, leap in lunar low gravity, and scan historical rovers and Apollo landers left behind on other worlds. Real NASA terrain, zero boring lectures!
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/missions"
                  onClick={handleStartMissionClick}
                  className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-signal-500 via-warn-500 to-amber-400 px-8 py-4 font-display text-xl font-bold text-space-950 shadow-xl shadow-signal-500/30 transition-all hover:shadow-2xl hover:shadow-signal-500/50"
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

            {/* Quick Stat Cards (Row of 4 Glassmorphic Metrics) */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-space-800/80 bg-space-900/60 p-3.5 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="font-display text-2xl font-bold text-white">6</p>
                <p className="mt-1 text-[11px] font-medium text-regolith-400">Apollo Landing Sites</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/60 p-3.5 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="font-display text-2xl font-bold text-white">6</p>
                <p className="mt-1 text-[11px] font-medium text-regolith-400">Mars Rovers & Landers</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/60 p-3.5 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="font-display text-2xl font-bold text-white">1/6th G</p>
                <p className="mt-1 text-[11px] font-medium text-regolith-400">Real Lunar Bounding</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/60 p-3.5 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                <p className="font-display text-2xl font-bold text-white">60+</p>
                <p className="mt-1 text-[11px] font-medium text-regolith-400">Historical Relics</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Cartoon Astronaut with Glowing Orbital Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:col-span-5"
          >
            <div className="relative flex flex-col items-center">
              
              {/* Outer Cosmic Nebular Glow behind transparent mascot */}
              <div
                className={`pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-signal-500/25 via-warn-500/25 to-amber-300/20 blur-3xl transition-opacity duration-500 ${
                  isHovered ? "opacity-100 scale-110" : "opacity-75 animate-pulse"
                }`}
              />

              {/* Glowing 3D Perspective Orbital Halo Ring */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-amber-400/85 shadow-[0_0_25px_rgba(255,160,0,0.85),inset_0_0_15px_rgba(255,160,0,0.5)] [transform:rotateX(68deg)_rotateY(-18deg)] sm:h-44 sm:w-96"
                aria-hidden="true"
              >
                {/* Orbiting Light Particle */}
                <div className="absolute top-0 left-1/4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200 blur-[0.5px] shadow-[0_0_12px_#fff] animate-ping" />
              </div>

              {/* Dynamic Scroll & Hover Triggered Speech Bubble */}
              <div className="relative z-20 mb-3 max-w-[290px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuoteIndex}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-2xl border px-4 py-2.5 text-center text-xs font-semibold shadow-xl backdrop-blur-md transition-colors ${
                      isHovered
                        ? "border-warn-500 bg-space-900/95 text-warn-400 shadow-warn-500/25"
                        : "border-space-700/80 bg-space-900/85 text-regolith-200 shadow-space-950/60"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 text-signal-500 shrink-0" />
                      <span>{SCROLL_QUOTES[activeQuoteIndex]}</span>
                    </div>
                    {/* Small speech bubble point */}
                    <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-space-900/90" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Zero-G Floating Mascot with Parallax Tilt & Hover Wobble */}
              <motion.div
                style={{
                  rotate: scrollRotate,
                  y: scrollParallaxY,
                }}
                animate={
                  isHovered
                    ? {
                        y: [-12, -26, -12],
                        rotate: [-6, 6, -6],
                        scale: 1.08,
                      }
                    : {
                        y: [-8, 8, -8],
                        rotate: [-2, 2, -2],
                        scale: 1,
                      }
                }
                transition={{
                  duration: isHovered ? 2.2 : 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                onMouseEnter={handleMascotMouseEnter}
                onMouseLeave={handleMascotMouseLeave}
                className="relative z-10 cursor-pointer select-none"
              >
                {/* Gentle Thruster Glow behind backpack */}
                <div
                  className={`pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-signal-500 blur-xl transition-all duration-300 ${
                    isHovered ? "h-24 w-24 opacity-80" : "h-16 w-16 opacity-40 animate-pulse"
                  }`}
                />

                <img
                  src="/art/astronaut.png"
                  alt="Cosmosyy Cartoon Astronaut Mascot"
                  className="h-64 w-auto object-contain drop-shadow-[0_20px_35px_rgba(255,140,0,0.35)] transition-transform duration-300 sm:h-76 md:h-84 lg:h-92"
                />
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
