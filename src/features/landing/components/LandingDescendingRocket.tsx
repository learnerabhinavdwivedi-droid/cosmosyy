import { type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface DescendingRocketProps {
  targetRef: RefObject<HTMLElement | null>;
}

export function LandingDescendingRocket({ targetRef }: DescendingRocketProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 80%", "end end"],
  });

  // Moves straight downward as user scrolls (from top of section down behind footer mountain landscape)
  const driftTop = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["1%", "23%", "45%", "68%", "87%"],
  );

  // Subtle aerodynamic gimbal steering sway around 122.5° (where 122.5° is exactly pointing straight down)
  const rotateSway = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [122.5, 124.5, 121, 123.5, 122.5],
  );

  // Scale dynamics during descent & touchdown
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 1]);

  return (
    <motion.div
      style={{
        top: driftTop,
      }}
      className="pointer-events-none absolute right-3 z-0 overflow-visible transition-[top] duration-500 ease-out sm:right-6 md:right-10 lg:right-16"
      aria-hidden="true"
    >
      <motion.div
        style={{
          scale,
        }}
        className="relative"
      >
        {/* Ambient Thruster Flame Glow illuminating the starry space backdrop */}
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-t from-orange-600/25 via-amber-500/20 to-transparent blur-3xl animate-pulse" />

        {/* Thruster Engine Rumble & Combustion Shudder */}
        <motion.div
          animate={{
            x: [0, -1, 1, -0.6, 0.6, 0],
            y: [0, 0.5, -0.5, 0.8, 0],
          }}
          transition={{
            duration: 0.14,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            rotate: rotateSway,
          }}
          className="relative origin-center"
        >
          {/* Animated Exhaust Flame Flare (placed at rocket tail, pulsing furiously) */}
          <motion.div
            animate={{
              scale: [1, 1.15, 0.94, 1.18, 1],
              opacity: [0.75, 1, 0.85, 0.98, 0.75],
            }}
            transition={{
              duration: 0.16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute left-[15%] bottom-[50%] h-28 w-28 -translate-x-1/2 rounded-full bg-radial from-amber-300 via-orange-500/60 to-transparent blur-md"
          />

          {/* Glowing Plasma Core */}
          <motion.div
            animate={{
              scaleY: [1, 1.25, 0.92, 1.28, 1],
              scaleX: [1, 0.92, 1.08, 0.95, 1],
            }}
            transition={{
              duration: 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute left-[18%] bottom-[55%] h-20 w-12 -translate-x-1/2 rounded-full bg-gradient-to-t from-yellow-100 via-amber-400 to-transparent blur-sm"
          />

          {/* Spark Particles floating out of the burning flame */}
          <div className="pointer-events-none absolute left-[10%] bottom-[60%]">
            <span className="absolute h-1.5 w-1.5 rounded-full bg-yellow-200 blur-[0.5px] animate-ping" />
            <span
              className="absolute -top-4 -left-3 h-2 w-2 rounded-full bg-orange-400 blur-[0.5px] animate-pulse"
              style={{ animationDuration: "0.25s" }}
            />
            <span
              className="absolute -top-7 left-2 h-1.5 w-1.5 rounded-full bg-amber-300 blur-[0.5px] animate-pulse"
              style={{ animationDuration: "0.19s" }}
            />
          </div>

          {/* Main Rocket with Flame Asset */}
          <img
            src="/art/rocket-flame.png"
            alt="Descending Cartoon Rocket with Blazing Flame"
            className="h-36 w-auto object-contain opacity-90 drop-shadow-[0_0_35px_rgba(255,100,0,0.7)] transition-opacity duration-300 sm:h-44 md:h-56 lg:h-64 select-none"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
