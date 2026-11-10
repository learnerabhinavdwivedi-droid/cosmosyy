import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";

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

export function LoadingScreen({ progress = 0 }: LoadingScreenProps) {
  const { t } = useTranslation();
  const [factIdx, setFactIdx] = useState(0);
  const [factFade, setFactFade] = useState(true);

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-space-950 px-4">
      <h1 className="font-display text-3xl tracking-widest text-regolith-200">
        {t("app.title")}
      </h1>

      <div className="w-full max-w-xs">
        <Progress
          value={progress}
          className="h-1.5 bg-space-800"
        />
        <p className="mt-2 text-center text-xs text-regolith-400">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="h-20 max-w-md text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-signal">
          {t("loading.didYouKnow")}
        </p>
        <p
          className="text-sm leading-relaxed text-regolith-300 transition-opacity duration-300"
          style={{ opacity: factFade ? 1 : 0 }}
        >
          {FACTS[factIdx]}
        </p>
      </div>
    </div>
  );
}
