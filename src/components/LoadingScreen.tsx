import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";
import { useFullscreen } from "@/lib/fullscreen";
import { isTouchDevice } from "@/lib/useMobile";
import { Maximize2 } from "lucide-react";

const FACTS = [
  "The lunar module had less computing power than a modern calculator.",
  "Astronaut footprints on the Moon may last millions of years — there is no wind or rain.",
  "The Apollo 11 flag was knocked over by the ascent engine exhaust.",
  "Moon dust smells like spent gunpowder, according to the astronauts.",
  "Apollo 15 was the first mission to use the Lunar Roving Vehicle.",
  "The Apollo 17 crew spent over 22 hours exploring the lunar surface on EVAs.",
  "Gene Cernan scratched his daughter's initials in the lunar dust — they're still there.",
  "Apollo 12 landed within 200 meters of the Surveyor 3 probe, which had been on the Moon for 2.5 years.",
  "The total weight of Moon rocks brought back by all Apollo missions is 382 kilograms.",
  "Alan Shepard hit two golf balls on the Moon during Apollo 14.",
  "The Saturn V rocket remains the most powerful rocket ever successfully flown.",
  "It took about 3 days to travel from Earth to the Moon.",
];

interface LoadingScreenProps {
  progress?: number;
}

export function LoadingScreen({ progress: explicitProgress }: LoadingScreenProps) {
  const { t } = useTranslation();
  const [factIdx, setFactIdx] = useState(0);
  const [factFade, setFactFade] = useState(true);
  const { isFullscreen: inFullscreen, enter } = useFullscreen();
  const touch = isTouchDevice();

  const { active, progress: dreiProgress } = useProgress();
  const [smoothSimProgress, setSmoothSimProgress] = useState(18);
  const [showBypass, setShowBypass] = useState(false);

  useEffect(() => {
    if (explicitProgress !== undefined) return;
    const interval = setInterval(() => {
      setSmoothSimProgress((p) => {
        if (p < 94) {
          return p + Math.max(0.4, (94 - p) * 0.08);
        }
        return p;
      });
    }, 120);

    const bypassTimer = setTimeout(() => {
      setShowBypass(true);
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(bypassTimer);
    };
  }, [explicitProgress]);

  const progress =
    explicitProgress !== undefined
      ? explicitProgress
      : Math.min(
          99,
          Math.max(
            smoothSimProgress,
            active ? Math.max(dreiProgress, 18) : smoothSimProgress,
          ),
        );

  useEffect(() => {
    const interval = setInterval(() => {
      setFactFade(false);
      setTimeout(() => {
        setFactIdx((i) => (i + 1) % FACTS.length);
        setFactFade(true);
      }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleContainerTap = () => {
    if (touch && !inFullscreen) {
      enter().catch(() => {});
    }
  };

  return (
    <div
      onClick={handleContainerTap}
      className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center gap-3 sm:gap-6 bg-space-950 px-4 py-4 select-none touch-manipulation cursor-pointer"
    >
      <h1 className="font-display text-2xl sm:text-3xl tracking-widest text-regolith-200">
        {t("app.title")}
      </h1>

      <div className="w-full max-w-xs">
        <Progress
          value={progress}
          className="h-1.5 bg-space-800"
        />
        <p className="mt-1.5 text-center text-xs font-mono text-regolith-400">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="h-14 sm:h-20 max-w-md text-center px-2">
        <p className="mb-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-signal">
          {t("loading.didYouKnow")}
        </p>
        <p
          className="text-xs sm:text-sm leading-snug sm:leading-relaxed text-regolith-300 transition-opacity duration-300 line-clamp-2"
          style={{ opacity: factFade ? 1 : 0 }}
        >
          {FACTS[factIdx]}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        {touch && !inFullscreen ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              enter().catch(() => {});
            }}
            className="flex items-center gap-2 rounded-full border border-signal/70 bg-signal/20 px-5 py-2 text-xs font-bold uppercase tracking-wider text-signal shadow-lg shadow-signal/25 backdrop-blur transition hover:bg-signal/30 active:scale-95 animate-pulse cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{t("fullscreen.tapToFocus", "Tap to hide browser bar & focus")}</span>
          </button>
        ) : touch && inFullscreen ? (
          <span className="text-[11px] font-mono text-signal/80 tracking-wider">
            ✓ Fullscreen Focus Active
          </span>
        ) : null}

        {showBypass && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.location.reload();
            }}
            className="mt-1 text-[11px] underline text-regolith-400 hover:text-signal transition"
          >
            Taking too long? Tap to reload
          </button>
        )}
      </div>
    </div>
  );
}
