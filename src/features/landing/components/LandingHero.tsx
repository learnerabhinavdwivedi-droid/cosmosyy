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
  const scrollParallaxY = useTransform(scrollY, [0, 1000], [0, 70]);

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
    <section className="relative overflow-hidden pt-10 pb-36 sm:pt-14 sm:pb-44 md:pt-16 md:pb-52 lg:pt-20 lg:pb-60 min-h-[760px] sm:min-h-[820px] md:min-h-[880px] lg:min-h-[940px] flex flex-col justify-center">
      
      {/* 1. Primary Full-Width Mars Landscape Cinematic Background */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
        {/* Base Layer: Mars Landscape Wallpaper Anchored to Bottom */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/art/mars-landscape-wallpaper.jpg')",
          }}
        />

        {/* Depth Layer 1: Cosmic Purple Nebula Cloud (Top Right & Center Sky) */}
        <div className="absolute -top-16 right-8 sm:right-1/4 h-[380px] w-[520px] rounded-full bg-gradient-to-br from-purple-900/25 via-indigo-950/20 to-transparent blur-3xl opacity-75" />

        {/* Depth Layer 2: Deep Violet Dust Veil (Top Left) */}
        <div className="absolute top-10 left-8 sm:left-1/6 h-[320px] w-[420px] rounded-full bg-gradient-to-tr from-violet-950/30 via-purple-950/15 to-transparent blur-3xl opacity-60" />

        {/* Depth Layer 3: Subtle Mars Ambient Orange Lighting along the Mountain Horizon */}
        <div className="absolute bottom-16 inset-x-0 h-44 bg-gradient-to-t from-orange-600/20 via-amber-500/10 to-transparent blur-2xl" />

        {/* Top Vignette Gradient to blend smoothly under the navbar */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-space-950/85 via-space-950/40 to-transparent" />

        {/* Subtle dark overlay in the upper sky region to guarantee crisp text readability */}
        <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-space-950/40 via-space-950/15 to-transparent" />

        {/* Bottom Vignette Gradient to transition seamlessly into the Gravity Lab below */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent" />
      </div>

      {/* 2. Main Foreground Hero Content (Mobile & Desktop Responsive) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
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
            <h1 className="mt-4 font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
              Ready for Liftoff,{" "}
              <span className="bg-gradient-to-r from-signal-500 via-warn-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,107,44,0.4)]">
                Little Explorer?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm leading-relaxed text-regolith-200 sm:text-base md:text-lg max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Blast off on genuine Saturn V rockets, leap in lunar low gravity, and scan historical rovers and Apollo landers left behind on other worlds. Real NASA terrain, zero boring lectures!
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  to="/missions"
                  onClick={handleStartMissionClick}
                  className="group flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-signal-500 via-warn-500 to-amber-400 px-8 py-3.5 font-display text-lg sm:text-xl font-bold text-space-950 shadow-xl shadow-signal-500/35 transition-all hover:shadow-2xl hover:shadow-signal-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 shrink-0" />
                  <span>START MISSION</span>
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToGuide}
                className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2.5 rounded-2xl border border-space-700/80 bg-space-900/80 px-6 py-3.5 font-display text-base sm:text-lg font-semibold text-regolith-200 backdrop-blur-md transition-colors hover:border-space-500 hover:bg-space-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <BookOpen className="h-5 w-5 text-signal-500 shrink-0" />
                <span>How to Play</span>
              </motion.button>
            </div>

            {/* Quick Stat Cards (Row of 4 Glassmorphic Metrics) */}
            <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-space-800/80 bg-space-900/75 p-3 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 sm:p-3.5">
                <p className="font-display text-xl sm:text-2xl font-bold text-white">6</p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-regolith-300">Apollo Landing Sites</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/75 p-3 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 sm:p-3.5">
                <p className="font-display text-xl sm:text-2xl font-bold text-white">6</p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-regolith-300">Mars Rovers & Landers</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/75 p-3 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 sm:p-3.5">
                <p className="font-display text-xl sm:text-2xl font-bold text-white">1/6th G</p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-regolith-300">Real Lunar Bounding</p>
              </div>
              <div className="rounded-xl border border-space-800/80 bg-space-900/75 p-3 text-center backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 sm:p-3.5">
                <p className="font-display text-xl sm:text-2xl font-bold text-white">60+</p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-regolith-300">Historical Relics</p>
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
                  className="h-60 w-auto object-contain drop-shadow-[0_20px_35px_rgba(255,140,0,0.35)] transition-transform duration-300 sm:h-72 md:h-80 lg:h-88"
                />
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
