import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore, getNextMissionId } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { getMission } from "@/lib/missionData";

const XP_LAND = 50;
const XP_COMPLETE = 100;

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{display}</>;
}

export function ReportScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const send = useGameStore((s) => s.send);
  const missionId = useGameStore((s) => s.missionId);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const getRank = useAppStore((s) => s.getRank);
  const completeMission = useAppStore((s) => s.completeMission);
  const addXp = useAppStore((s) => s.addXp);
  const startMission = useAppStore((s) => s.startMission);

  const mission = useMemo(() => getMission(missionId ?? "apollo-11"), [missionId]);
  const TOTAL_OBJECTS = mission.objects.length;

  useEffect(() => {
    if (missionId) {
      completeMission(missionId);
      addXp(missionId, XP_LAND);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const objectXp = found.length * 50;
  const flagXp = 100;
  const missionXp = XP_LAND + objectXp + flagXp + XP_COMPLETE;

  const nextMissionId = useMemo(() => missionId ? getNextMissionId(missionId) : null, [missionId]);

  const missionName = mission.name;

  const handleNextMission = () => {
    if (!nextMissionId) return;
    startMission(nextMissionId);
    send("BACK_TO_SELECT");
    navigate(`/play/${nextMissionId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background stars */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--space-900)_0%,_var(--space-950)_70%)]" />
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-regolith-200"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 37.7) % 100}%`,
              left: `${(i * 61.3) % 100}%`,
              opacity: 0.1 + (i % 5) * 0.08,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Mission success banner */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ok">
            {t("report.missionSuccess")}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-regolith-200">
            {missionName}
          </h1>
          <p className="mt-2 text-sm text-regolith-400">
            {t("report.subheading")}
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-space-700 bg-space-900/90 p-8 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Stats with staggered reveal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.objectsFound")}</span>
              <span className="font-mono text-regolith-200">
                {found.length} / {TOTAL_OBJECTS}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.landingXp")}</span>
              <span className="font-mono text-ok">+{XP_LAND}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.objectsXp")}</span>
              <span className="font-mono text-ok">+{objectXp}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.flagPlanted")}</span>
              <span className="font-mono text-ok">+{flagXp}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.missionComplete")}</span>
              <span className="font-mono text-ok">+{XP_COMPLETE}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-regolith-200">
                {t("report.totalEarned")}
              </span>
              <span className="font-mono text-xl font-bold text-signal">
                +<AnimatedNumber target={missionXp} /> XP
              </span>
            </div>
          </div>

          {/* Rank */}
          <div className="mt-6 rounded-lg bg-space-800 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-regolith-400">
              {t("report.currentRank")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-signal">
              {getRank()}
            </p>
            <p className="mt-1 text-sm text-regolith-400">
              <AnimatedNumber target={totalXp} duration={1500} /> {t("report.xpTotalSuffix")}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {nextMissionId && (
              <Button
                onClick={handleNextMission}
                className="w-full bg-signal text-space-950 hover:bg-signal/90 font-semibold text-base py-3"
              >
                {t("report.nextMission", { mission: nextMissionId.replace("apollo-", "Apollo ") })}
              </Button>
            )}
            <Button
              onClick={() => send("BACK_TO_SELECT")}
              className="w-full bg-space-700 text-regolith-200 hover:bg-space-600"
            >
              {t("report.backToMissions")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
