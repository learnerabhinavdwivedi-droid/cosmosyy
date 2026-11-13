import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Coffee, Sparkles, MessageCircle } from "lucide-react";
import { playQuindar } from "../../../lib/gameAudio";

export function LandingFooter() {
  const [isAstronautHovered, setIsAstronautHovered] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState(
    "Whew! What a cosmic journey. Thanks for exploring with us, Commander! 🪐",
  );

  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleAstronautClick = () => {
    playQuindar();
    const quotes = [
      "Whew! What a cosmic journey. Thanks for exploring with us, Commander! 🪐",
      "Did you know? Apollo footprints will last 100 million years on the Moon! 🐾",
      "Mars has the tallest volcano in the solar system: Olympus Mons! 🌋",
      "Ready for another mission? Click 'Missions' or 'START MISSION' above! 🚀",
      "Special thanks to Abhinav Dwivedi for engineering this simulation! ❤️",
    ];
    const nextIndex = (quoteIndex + 1) % quotes.length;
    setQuoteIndex(nextIndex);
    const fallback = "Whew! What a cosmic journey. Thanks for exploring with us, Commander! 🪐";
    setSpeechBubbleText(quotes[nextIndex] ?? fallback);
  };

  return (
    <footer className="relative overflow-visible border-t border-space-800 bg-space-950/85 pt-24 pb-16 min-h-[500px] text-regolith-300 md:pt-32 md:pb-24">
      
      {/* 1. Left Side: Sitting Cartoon Astronaut Sitting on the Top Border Line */}
      <div className="absolute -top-[70px] left-6 sm:left-12 md:left-20 lg:left-28 z-30 select-none">
        
        {/* Cute Contextual Speech Bubble above sitting astronaut */}
        <div className="relative mb-2 max-w-[260px] sm:max-w-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={speechBubbleText}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border px-3.5 py-2 text-center text-xs font-semibold shadow-xl backdrop-blur-md transition-colors ${
                isAstronautHovered
                  ? "border-amber-400/80 bg-space-900/95 text-amber-300 shadow-amber-500/20"
                  : "border-space-700/80 bg-space-900/90 text-regolith-200 shadow-space-950/80"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-warn-500 shrink-0" />
                <span>{speechBubbleText}</span>
              </div>
              {/* Speech bubble pointer pointing down to helmet */}
              <div className="absolute -bottom-2 left-10 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-space-900/90" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sitting Mascot sitting directly on the border line */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onMouseEnter={() => {
            setIsAstronautHovered(true);
            playQuindar();
          }}
          onMouseLeave={() => setIsAstronautHovered(false)}
          onClick={handleAstronautClick}
          className="relative cursor-pointer"
          title="Click the resting astronaut for fun space facts!"
        >
          {/* Warm Ambient Helmet & Suit Glow */}
          <div
            className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-orange-600/30 via-amber-400/20 to-transparent blur-xl transition-opacity duration-300 ${
              isAstronautHovered ? "opacity-100 scale-110" : "opacity-60"
            }`}
          />

          {/* Sitting Cartoon Astronaut Asset */}
          <img
            src="/art/sitting-astronaut.png"
            alt="Resting Cartoon Astronaut Sitting on Border Line"
            className="h-28 sm:h-32 md:h-36 w-auto object-contain drop-shadow-[0_15px_25px_rgba(255,120,0,0.4)]"
          />

          {/* Interactive Hint Pill on Hover */}
          {isAstronautHovered && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-space-900/90 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 shadow">
              Click to chat! 🧑‍🚀
            </span>
          )}
        </motion.div>
      </div>

      {/* 2. Bottom Martian Volcanic Landscape Background (User 3rd attached image) */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-44 sm:h-60 md:h-72 overflow-hidden z-0" aria-hidden="true">
        {/* Radiant Magma Horizon Glow */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-orange-600/30 via-amber-500/15 to-transparent blur-2xl" />
        
        {/* Transparent Martian Rocky Mountain Terrain */}
        <img
          src="/art/martian-landscape.png"
          alt="Martian Rocky Terrain Footer Base"
          className="absolute bottom-0 inset-x-0 w-full h-full object-cover object-bottom opacity-85 select-none"
        />
      </div>

      {/* 3. Main Footer Content Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand & Made By Column */}
          <div className="flex flex-col lg:col-span-4">
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-signal-500 to-warn-500 shadow-lg shadow-signal-500/25">
                <Rocket className="h-5 w-5 text-space-950 transition-transform group-hover:rotate-12" />
              </div>
              <span className="font-display text-2xl font-black text-white drop-shadow-[0_0_12px_rgba(255,140,0,0.3)]">
                Cosmosyy
              </span>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-regolith-300 max-w-sm">
              An interactive 3D space flight & lunar exploration game. Walk in real 1/6th lunar gravity, discover genuine Apollo relics, and touch down on the Martian surface with authentic NASA terrain models.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-signal-500 animate-pulse" />
              <p className="text-xs text-regolith-200">
                Crafted with ❤️ by{" "}
                <a
                  href="https://devabhinav.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-400 underline decoration-amber-500/60 underline-offset-4 transition-colors hover:text-amber-300 hover:decoration-amber-400"
                >
                  Abhinav Dwivedi
                </a>
              </p>
            </div>

            {/* Passport Storage Indicator */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-space-800 bg-space-900/60 px-3 py-1.5 text-[11px] text-regolith-400 backdrop-blur w-fit">
              <Sparkles className="h-3.5 w-3.5 text-warn-500" />
              <span>Offline Ready · Explorer Passport Local Vault</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-col lg:col-span-2">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-regolith-100">
              Navigation
            </p>
            <ul className="mt-3 space-y-2 text-xs font-medium text-regolith-300">
              <li>
                <Link to="/missions" className="hover:text-amber-400 transition-colors">
                  Missions Directory
                </Link>
              </li>
              <li>
                <a href="#how-to-play" className="hover:text-amber-400 transition-colors">
                  How to Play
                </a>
              </li>
              <li>
                <a href="#gravity-lab" className="hover:text-amber-400 transition-colors">
                  Gravity Lab
                </a>
              </li>
              <li>
                <a href="#controls" className="hover:text-amber-400 transition-colors">
                  Flight Controls
                </a>
              </li>
              <li>
                <Link to="/credits" className="hover:text-amber-400 transition-colors">
                  Credits & Licences
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-amber-400 transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Apollo & Mars Destinations */}
          <div className="flex flex-col lg:col-span-3">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-regolith-100">
              Landing Sites
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-regolith-400">
              <span className="hover:text-regolith-200 transition-colors">Apollo 11</span>
              <span className="hover:text-regolith-200 transition-colors">Viking 1</span>
              <span className="hover:text-regolith-200 transition-colors">Apollo 12</span>
              <span className="hover:text-regolith-200 transition-colors">Pathfinder</span>
              <span className="hover:text-regolith-200 transition-colors">Apollo 14</span>
              <span className="hover:text-regolith-200 transition-colors">Opportunity</span>
              <span className="hover:text-regolith-200 transition-colors">Apollo 15</span>
              <span className="hover:text-regolith-200 transition-colors">Curiosity</span>
              <span className="hover:text-regolith-200 transition-colors">Apollo 16</span>
              <span className="hover:text-regolith-200 transition-colors">Perseverance</span>
              <span className="hover:text-regolith-200 transition-colors">Apollo 17</span>
              <span className="hover:text-regolith-200 transition-colors">Ingenuity</span>
            </div>
          </div>

          {/* Connect & Support Column */}
          <div className="flex flex-col lg:col-span-3">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-regolith-100">
              Connect & Support
            </p>
            <p className="mt-2 text-xs text-regolith-400">
              Cosmosyy is an educational open-data space exploration project by Abhinav Dwivedi.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {/* Buy Me a Coffee Button */}
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://buymeacoffee.com/learnerabhinav"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-warn-500/25 to-yellow-500/20 px-4 py-2.5 text-xs font-bold text-amber-300 shadow-sm transition-all hover:border-amber-400 hover:bg-amber-400/30"
              >
                <Coffee className="h-4 w-4 text-amber-300" />
                <span>Buy Me a Coffee</span>
              </motion.a>

              {/* LinkedIn Button */}
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://www.linkedin.com/in/abhinav-dwivedi-b074a136a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-sky-600/30 px-4 py-2.5 text-xs font-bold text-sky-200 shadow-sm transition-all hover:border-sky-400 hover:bg-sky-500/40"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Connect on LinkedIn</span>
              </motion.a>

              {/* Portfolio Link */}
              <a
                href="https://devabhinav.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-center text-xs font-semibold text-amber-400 hover:underline transition-colors"
              >
                🌐 devabhinav.xyz
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & NASA Open Data Disclaimer */}
        <div className="mt-16 border-t border-space-800/80 pt-8 text-center text-xs text-regolith-400">
          <p>
            Historical landing site data, coordinates, and telemetry derived from NASA Open Data, Apollo Lunar Surface Journal (ALSJ), and LROC imagery.
          </p>
          <p className="mt-2 text-regolith-500">
            © 2026 Cosmosyy · Built for space exploration enthusiasts & curious young minds.
          </p>
        </div>
      </div>

    </footer>
  );
}
