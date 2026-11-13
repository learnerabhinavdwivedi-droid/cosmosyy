import { type RefObject } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

interface DescendingRocketProps {
  targetRef: RefObject<HTMLElement | null>;
}

export function LandingDescendingRocket({ targetRef }: DescendingRocketProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "end 95%"],
  });

  // Smooth lagging spring physics for graceful, damped descent
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 24,
    mass: 1.2,
    restDelta: 0.001,
  });

  // Moves straight downward with gentle lagging speed (sinks behind footer mountain base)
  const driftTop = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["1%", "22%", "44%", "66%", "86%"],
  );

  // Subtle aerodynamic gimbal steering sway
  const rotateSway = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 2.5, -2, 1.8, 0],
  );

  // Scale dynamics during descent
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.05, 1]);

  return (
    <motion.div
      style={{
        top: driftTop,
      }}
      className="pointer-events-none absolute right-3 z-0 overflow-visible transition-[top] duration-700 ease-out sm:right-6 md:right-10 lg:right-16"
      aria-hidden="true"
    >
      <motion.div
        style={{
          scale,
        }}
        className="relative flex flex-col items-center"
      >
        {/* Ambient Thruster Flame Glow illuminating space backdrop */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-gradient-to-t from-orange-600/30 via-amber-500/25 to-transparent blur-3xl animate-pulse" />

        {/* Thruster Engine Rumble & Combustion Shudder */}
        <motion.div
          animate={{
            x: [0, -0.8, 0.8, -0.5, 0.5, 0],
            y: [0, 0.4, -0.4, 0.6, 0],
          }}
          transition={{
            duration: 0.16,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            rotate: rotateSway,
          }}
          className="relative origin-top"
        >
          {/* Screen reader & test accessible alt image */}
          <img
            src="/art/rocket-flame.png"
            alt="Descending Cartoon Rocket with Blazing Flame"
            className="sr-only"
            aria-hidden="false"
          />

          {/* Ultra-HD Cartoon Rocket with Mathematically Centered Animated Flame */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-28 sm:w-32 md:w-36 lg:w-40 select-none drop-shadow-[0_0_35px_rgba(255,100,0,0.65)]">
            <svg
              viewBox="0 0 120 230"
              className="h-full w-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Rocket Body Hull Gradient */}
                <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C52B1E" />
                  <stop offset="25%" stopColor="#E53E2E" />
                  <stop offset="65%" stopColor="#F25442" />
                  <stop offset="90%" stopColor="#D13324" />
                  <stop offset="100%" stopColor="#9B1C10" />
                </linearGradient>

                {/* Yellow Fins and Nose Tip Gradient */}
                <linearGradient id="finConeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="45%" stopColor="#FBBF24" />
                  <stop offset="80%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>

                {/* Dark Steel Riveted Collar Gradient */}
                <linearGradient id="steelCollarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="45%" stopColor="#4B5563" />
                  <stop offset="80%" stopColor="#6B7280" />
                  <stop offset="100%" stopColor="#1F2937" />
                </linearGradient>

                {/* Nozzle Bell Gradient */}
                <linearGradient id="nozzleBellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>

                {/* Window Porthole Glass Gradient */}
                <linearGradient id="portholeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="45%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>

                {/* Outer Exhaust Flame Gradient */}
                <linearGradient id="flameOuterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="40%" stopColor="#DC2626" />
                  <stop offset="80%" stopColor="#991B1B" />
                  <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
                </linearGradient>

                {/* Core Combustion Flame Gradient */}
                <linearGradient id="flameCoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="40%" stopColor="#FACC15" />
                  <stop offset="80%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </linearGradient>

                {/* White-Hot Plasma Jet Gradient */}
                <linearGradient id="plasmaJetGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* ======================================================== */}
              {/* 1. MATHEMATICALLY CENTERED ANIMATED EXHAUST FLAME        */}
              {/* Midpoint of nozzle opening is strictly at x=60, y=78     */}
              {/* ======================================================== */}
              <g className="origin-[60px_78px]">
                {/* Outer Fiery Exhaust Plume */}
                <motion.path
                  animate={{
                    d: [
                      "M 46 78 C 38 52 42 20 60 -10 C 78 20 82 52 74 78 Z",
                      "M 45 78 C 36 48 40 14 60 -18 C 80 14 84 48 75 78 Z",
                      "M 47 78 C 40 55 44 24 60 -6 C 76 24 80 55 73 78 Z",
                      "M 46 78 C 38 52 42 20 60 -10 C 78 20 82 52 74 78 Z",
                    ],
                    opacity: [0.88, 1, 0.92, 0.88],
                  }}
                  transition={{
                    duration: 0.18,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  fill="url(#flameOuterGrad)"
                />

                {/* Core Bright Golden Flame */}
                <motion.path
                  animate={{
                    d: [
                      "M 50 78 C 44 60 48 35 60 8 C 72 35 76 60 70 78 Z",
                      "M 49 78 C 42 56 46 28 60 2 C 74 28 78 56 71 78 Z",
                      "M 51 78 C 46 62 50 38 60 12 C 70 38 74 62 69 78 Z",
                      "M 50 78 C 44 60 48 35 60 8 C 72 35 76 60 70 78 Z",
                    ],
                  }}
                  transition={{
                    duration: 0.14,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  fill="url(#flameCoreGrad)"
                />

                {/* White-Hot Plasma Jet Spike */}
                <motion.path
                  animate={{
                    d: [
                      "M 54 78 C 52 66 54 48 60 26 C 66 48 68 66 66 78 Z",
                      "M 53 78 C 50 63 53 42 60 20 C 67 42 70 63 67 78 Z",
                      "M 55 78 C 53 68 55 52 60 30 C 65 52 67 68 65 78 Z",
                      "M 54 78 C 52 66 54 48 60 26 C 66 48 68 66 66 78 Z",
                    ],
                    opacity: [0.95, 1, 0.9, 0.95],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  fill="url(#plasmaJetGrad)"
                />

                {/* Spark Particles rising upwards along nozzle midpoint */}
                <motion.circle
                  animate={{
                    cy: [70, -15],
                    cx: [58, 54],
                    r: [2, 0.5],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "easeOut" }}
                  fill="#FEF08A"
                />
                <motion.circle
                  animate={{
                    cy: [72, -22],
                    cx: [62, 67],
                    r: [2.2, 0.5],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.46, repeat: Infinity, delay: 0.15, ease: "easeOut" }}
                  fill="#FACC15"
                />
                <motion.circle
                  animate={{
                    cy: [74, -28],
                    cx: [60, 59],
                    r: [2.5, 0.6],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.38, repeat: Infinity, delay: 0.25, ease: "easeOut" }}
                  fill="#FFFFFF"
                />
              </g>

              {/* ======================================================== */}
              {/* 2. ROCKET BODY (POINTING STRAIGHT DOWN)                  */}
              {/* Symmetrical around centerline x=60                       */}
              {/* ======================================================== */}

              {/* Left Aerodynamic Swept Fin */}
              <path
                d="M 40 98 C 26 88 10 80 6 88 C 4 96 14 116 28 124 L 40 118 Z"
                fill="url(#finConeGrad)"
                stroke="#78350F"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Right Aerodynamic Swept Fin */}
              <path
                d="M 80 98 C 94 88 110 80 114 88 C 116 96 106 116 92 124 L 80 118 Z"
                fill="url(#finConeGrad)"
                stroke="#78350F"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Rocket Fuselage Hull */}
              <path
                d="M 40 96 C 38 126 42 165 60 198 C 78 165 82 126 80 96 Z"
                fill="url(#fuselageGrad)"
                stroke="#7F1D1D"
                strokeWidth="2"
              />

              {/* Upper Engine Collar Ring */}
              <rect
                x="41"
                y="88"
                width="38"
                height="8"
                rx="2"
                fill="url(#steelCollarGrad)"
                stroke="#111827"
                strokeWidth="1.2"
              />

              {/* Engine Thruster Bell Nozzle (Centered strictly at x=60, opening at y=78) */}
              <path
                d="M 45 88 L 42 78 L 78 78 L 75 88 Z"
                fill="url(#nozzleBellGrad)"
                stroke="#78350F"
                strokeWidth="1.5"
              />

              {/* Nose Collar Band */}
              <path
                d="M 48 178 C 52 186 68 186 72 178 L 74 184 C 70 192 50 192 46 184 Z"
                fill="url(#steelCollarGrad)"
                stroke="#111827"
                strokeWidth="1"
              />

              {/* Pointed Conical Nose Tip at Bottom */}
              <path
                d="M 53 188 C 57 197 60 206 60 209 C 60 206 63 197 67 188 C 63 190 57 190 53 188 Z"
                fill="url(#finConeGrad)"
                stroke="#78350F"
                strokeWidth="1.2"
              />

              {/* Center Fin (Dorsal Keel) */}
              <rect
                x="58.5"
                y="96"
                width="3"
                height="28"
                rx="1"
                fill="#F59E0B"
                opacity="0.9"
              />

              {/* Upper Porthole Window */}
              <circle cx="60" cy="126" r="9" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="60" cy="126" r="6.8" fill="url(#steelCollarGrad)" />
              <circle cx="60" cy="126" r="5.2" fill="url(#portholeGlass)" />
              <ellipse cx="58" cy="124" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.75" />

              {/* Lower Porthole Window */}
              <circle cx="60" cy="152" r="9" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="60" cy="152" r="6.8" fill="url(#steelCollarGrad)" />
              <circle cx="60" cy="152" r="5.2" fill="url(#portholeGlass)" />
              <ellipse cx="58" cy="150" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.75" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

