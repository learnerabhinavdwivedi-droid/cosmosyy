import { type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface FloatingAstronautProps {
  targetRef: RefObject<HTMLElement | null>;
}

export function LandingFloatingBalloonAstronaut({ targetRef }: FloatingAstronautProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 90%", "end 10%"],
  });

  // Non-linear horizontal inclined path (drifts gently across from left to right)
  const driftX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0vw", "8vw", "18vw", "28vw", "40vw"],
  );

  // Upward inclined vertical path (floats upward like a real buoyant balloon as user scrolls)
  const driftY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0px", "-70px", "-160px", "-260px", "-380px"],
  );

  // Subtle aerodynamic balloon tilt matching the inclined path
  const rotateSway = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-3, 4, -2, 5, 1],
  );

  // Gentle scale-up as it rises higher into deep space
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 1]);

  return (
    <div className="pointer-events-none absolute top-4 left-3 z-0 overflow-visible sm:left-6 md:left-10 lg:left-16" aria-hidden="true">
      <motion.div
        style={{
          x: driftX,
          y: driftY,
          rotate: rotateSway,
          scale: scaleProgress,
        }}
        className="relative transition-[transform] duration-700 ease-out"
      >
        {/* Soft Cosmic Balloon Nebula Glow */}
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-signal-500/15 via-scan-blue/20 to-purple-500/15 blur-3xl animate-pulse" />

        {/* Ambient Balloon Floating Loop (Slow, gentle, non-linear heave) */}
        <motion.div
          animate={{
            y: [0, -20, 6, -14, 0],
            x: [0, 10, -6, 12, 0],
            rotate: [-2, 3, -1, 2, -2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <img
            src="/art/cloud-astronaut.png"
            alt="Floating Balloon Cloud Astronaut"
            className="h-40 w-auto object-contain opacity-85 drop-shadow-[0_20px_45px_rgba(0,212,255,0.4)] transition-opacity duration-300 sm:h-52 md:h-68 lg:h-76 select-none"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
