import { useMemo, useRef } from "react";
import { LandingNavbar } from "./components/LandingNavbar";
import { LandingHero } from "./components/LandingHero";
import { LandingFloatingBalloonAstronaut } from "./components/LandingFloatingBalloonAstronaut";
import { LandingDescendingRocket } from "./components/LandingDescendingRocket";
import { LandingGravityLab } from "./components/LandingGravityLab";
import { LandingMissionShowcase } from "./components/LandingMissionShowcase";
import { LandingGuide } from "./components/LandingGuide";
import { LandingControls } from "./components/LandingControls";
import { LandingFooter } from "./components/LandingFooter";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic stars for the twinkling space backdrop
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 90; i++) {
      const top = (i * 37.7) % 100;
      const left = (i * 61.3) % 100;
      const size = 1 + (i % 3);
      const delay = (i % 7) * 0.6;
      const duration = 2.5 + (i % 5) * 0.8;
      const opacity = 0.2 + (i % 6) * 0.12;
      list.push({ top, left, size, delay, duration, opacity });
    }
    return list;
  }, []);

  return (
    <div className="relative min-h-screen bg-space-950 text-regolith-200 selection:bg-signal-500 selection:text-space-950 overflow-x-clip">
      
      {/* Dynamic Starfield Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {stars.map((s, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Page Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <LandingNavbar />
        
        <main className="flex-1">
          <LandingHero />

          {/* Scroll Track Container (From below Hero down till bottom of Footer) */}
          <div ref={containerRef} className="relative">
            {/* Background Floating Balloon Cloud Astronaut (Left side) */}
            <LandingFloatingBalloonAstronaut targetRef={containerRef} />

            {/* Background Descending Rocket with Blazing Animated Flame (Right side, down till footer) */}
            <LandingDescendingRocket targetRef={containerRef} />

            {/* Foreground Content Layer (Cards, Text & Buttons on top) */}
            <div className="relative z-10">
              <LandingGravityLab />
              <LandingMissionShowcase />
              <LandingGuide />
              <LandingControls />
              <LandingFooter />
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
