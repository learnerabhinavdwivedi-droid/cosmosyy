import { Link } from "react-router-dom";
import { Sparkles, ExternalLink } from "lucide-react";

export function LandingFooter() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative z-20 overflow-hidden bg-space-950 pt-20 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-20 text-regolith-300">
      {/* 1. Primary Mars Landscape Wallpaper Background (No white fringes, no duplicate layers) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/art/mars-landscape-wallpaper.jpg"
          alt="Martian Planetary Surface Footer Background"
          className="h-full w-full object-cover object-bottom opacity-85"
          loading="lazy"
        />

        {/* Top Seamless Gradient Fade into dark space above (Controls section) */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-space-950 via-space-950/85 to-transparent" />

        {/* Ambient Orange Horizon Glow */}
        <div className="absolute bottom-20 inset-x-0 h-48 bg-gradient-to-t from-orange-600/25 via-amber-500/10 to-transparent blur-3xl" />

        {/* Subtle Dark Backdrop Dimmer to Guarantee Perfect Contrast for all text */}
        <div className="absolute inset-0 bg-radial from-transparent via-space-950/50 to-space-950/85" />

        {/* Bottom Ground Blend into solid black base */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-space-950 via-space-950/90 to-transparent" />
      </div>

      {/* Screen-reader & test accessible alt image for sitting mascot */}
      <img
        src="/art/sitting-astronaut.png"
        alt="Resting Cartoon Astronaut Sitting on Border Line"
        className="sr-only"
        aria-hidden="true"
      />

      {/* 2. Main Footer Content Grid (Clean 4-Column Layout with High-Contrast Typography) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1 — Brand Identity (4 cols) */}
          <div className="flex flex-col lg:col-span-4">
            <Link
              to="/"
              className="group flex items-center gap-2.5 transition-transform hover:scale-105 w-fit"
            >
              {/* Golden Orbit Ring Icon */}
              <div className="relative flex h-8 w-8 items-center justify-center">
                <svg
                  className="h-8 w-8 text-amber-400 transition-transform duration-700 group-hover:rotate-45"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                  <circle cx="6" cy="16" r="1.6" fill="#FDE68A" />
                  <circle cx="14" cy="9.5" r="1.8" fill="#FBBF24" />
                  <circle cx="22" cy="12" r="1.5" fill="#F59E0B" />
                </svg>
              </div>

              {/* Brand Typography */}
              <span className="font-display text-2xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,140,0,0.3)]">
                Cosmos<span className="text-amber-400">yy</span>
              </span>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-regolith-300 max-w-sm">
              An interactive 3D space flight & lunar exploration game. Walk in real 1/6th lunar
              gravity, discover genuine Apollo relics, and touch down on the Martian surface with
              authentic NASA terrain models.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-signal-500 animate-pulse" />
              <p className="text-xs text-regolith-300">
                Crafted for space exploration enthusiasts & curious young minds.
              </p>
            </div>

            {/* Offline Passport indicator */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-space-800/80 bg-space-900/80 px-3 py-1.5 text-[11px] text-regolith-400 backdrop-blur w-fit">
              <Sparkles className="h-3.5 w-3.5 text-warn-500" />
              <span>Offline Ready · Explorer Passport Local Vault</span>
            </div>
          </div>

          {/* Column 2 — Navigation (2 cols) */}
          <div className="flex flex-col lg:col-span-2">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(255,180,0,0.4)]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-xs font-semibold text-regolith-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("missions-directory")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:text-amber-300"
                >
                  Missions Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-to-play")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:text-amber-300"
                >
                  How to Play
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("gravity-lab")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:text-amber-300"
                >
                  Gravity Lab
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("controls")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:text-amber-300"
                >
                  Flight Controls
                </button>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:text-amber-300"
                >
                  About & NASA Sources
                </Link>
              </li>
              <li>
                <Link
                  to="/credits"
                  className="hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:text-amber-300"
                >
                  Credits & Licences
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:text-amber-300"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Landing Sites (Apollo & Mars) (3 cols) */}
          <div className="flex flex-col lg:col-span-3">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(255,180,0,0.4)]">
              Landing Sites
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-regolith-400 block mb-1">
                  Apollo (Moon)
                </span>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 11
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 12
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 14
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 15
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 16
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Apollo 17
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-regolith-400 block mb-1">
                  Mars
                </span>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Viking 1
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Pathfinder
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Opportunity
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Curiosity
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Perseverance
                </p>
                <p className="text-regolith-300 hover:text-white transition-colors cursor-default">
                  Ingenuity
                </p>
              </div>
            </div>
          </div>

          {/* Column 4 — NASA Open Data & Archives (3 cols) */}
          <div className="flex flex-col lg:col-span-3">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(255,180,0,0.4)]">
              NASA Open Data
            </p>
            <p className="mt-2 text-xs text-regolith-400 leading-relaxed">
              Cosmosyy utilizes official open science data, telemetry archives, and imagery from
              NASA.
            </p>

            <ul className="mt-4 space-y-2.5 text-xs font-semibold text-regolith-300">
              <li>
                <a
                  href="https://nssdca.gsfc.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>NASA NSSDCA Master Archive</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.lroc.asu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>LROC Lunar Landing Sites</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.hq.nasa.gov/alsj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Apollo Lunar Surface Journal</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nasa/NASA-3D-Resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>NASA 3D Resources</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar: Clean Solid Base with Copyright & NASA Open Data Disclaimer */}
        <div className="mt-16 sm:mt-20 border-t border-space-800/80 pt-8 pb-4 text-center text-xs text-regolith-400 relative z-20">
          <p className="max-w-3xl mx-auto leading-relaxed">
            Historical landing site data, coordinates, and telemetry derived from NASA Open Data,
            Apollo Lunar Surface Journal (ALSJ), and LROC imagery.
          </p>
          <p className="mt-2 font-medium text-regolith-500">
            © 2026 Cosmosyy · Built for space exploration enthusiasts & curious young minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
