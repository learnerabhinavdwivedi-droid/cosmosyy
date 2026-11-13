import { type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface FloatingAstronautProps {
  targetRef: RefObject<HTMLElement | null>;
}

export function LandingFloatingBalloonAstronaut({ targetRef }: FloatingAstronautProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  // Smooth vertical drift from top-left (below hero) to bottom (above footer)
  const topPosition = useTransform(scrollYProgress, [0, 1], ["1%", "88%"]);

  // Gentle horizontal sway mimicking a floating balloon
  const swayX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0px", "35px", "-10px", "30px", "5px"],
  );

  // Subtle rotation sway during flight
  const rotateSway = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85, 1],
    [-5, 4, -4, 5, -2],
  );

  return (
    <motion.div
      style={{
        top: topPosition,
        x: swayX,
        rotate: rotateSway,
      }}
      className="pointer-events-none absolute left-2 z-0 sm:left-6 md:left-10 lg:left-14"
      aria-hidden="true"
    >
      {/* Balloon Glow Ambience */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-tr from-signal-500/15 via-scan-blue/15 to-purple-500/15 blur-2xl" />

      {/* Floating Balloon Bobbing Animation */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <img
          src="/art/cloud-astronaut.png"
          alt="Floating Balloon Cloud Astronaut"
          className="h-44 w-auto object-contain opacity-80 drop-shadow-[0_20px_40px_rgba(0,212,255,0.35)] transition-opacity duration-300 sm:h-56 md:h-72 lg:h-80"
        />
      </motion.div>
    </motion.div>
  );
}
