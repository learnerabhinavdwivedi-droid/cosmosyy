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
  const isRobotic = mission.missionType === "robotic";
  const TOTAL_OBJECTS = mission.objects.length;

  useEffect(() => {
    if (missionId) {
      completeMission(missionId);
      addXp(missionId, XP_LAND);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const foundObjects = useMemo(
    () => mission.objects.filter((o) => found.includes(o.id)),
    [mission.objects, found],
  );
  const operationalCount = useMemo(
    () => foundObjects.filter((o) => o.status === "operational").length,
    [foundObjects],
  );
  const objectXp = found.length * 50;
  const flagXp = isRobotic ? 50 : 100;
  const missionXp = XP_LAND + objectXp + flagXp + XP_COMPLETE;

  const nextMissionId = useMemo(
    () => (missionId ? getNextMissionId(missionId) : null),
    [missionId],
  );
  const nextMissionLabel = useMemo(() => {
    if (!nextMissionId) return "";
    try {
      return getMission(nextMissionId).name;
    } catch {
      return nextMissionId;
    }
  }, [nextMissionId]);

  const missionName = mission.name;

  const handleNextMission = () => {
    if (!nextMissionId) return;
    startMission(nextMissionId);
    useGameStore.getState().reset();
    useGameStore.getState().setMission(nextMissionId);
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
          <h1 className="mt-2 font-display text-4xl font-bold text-regolith-200">{missionName}</h1>
          <p className="mt-2 text-sm text-regolith-400">{t("report.subheading")}</p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-space-700 bg-space-900/90 p-8 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* XP Stats */}
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
              <span className="text-regolith-400">
                {t(isRobotic ? "report.surveyCompleted" : "report.flagPlanted")}
              </span>
              <span className="font-mono text-ok">+{flagXp}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700 pb-2">
              <span className="text-regolith-400">{t("report.missionComplete")}</span>
              <span className="font-mono text-ok">+{XP_COMPLETE}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-regolith-200">{t("report.totalEarned")}</span>
              <span className="font-mono text-xl font-bold text-signal">
                +<AnimatedNumber target={missionXp} /> XP
              </span>
            </div>
          </div>

          {/* What stayed behind */}
          {foundObjects.length > 0 && (
            <motion.div
              className="mt-6 rounded-lg bg-space-800/60 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-regolith-400/70">
                {t("report.whatStayedBehind")}
              </p>
              <div className="space-y-1.5">
                {foundObjects.map((obj, i) => (
                  <motion.div
                    key={obj.id}
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                  >
                    <span className="text-ok">✓</span>
                    <span className="text-regolith-300">{obj.name}</span>
                    {obj.status && (
                      <span
                        className={`ml-auto text-xs ${
                          obj.status === "operational"
                            ? "text-ok"
                            : obj.status === "dormant"
                              ? "text-amber-400"
                              : "text-regolith-500"
                        }`}
                      >
                        {obj.status === "operational"
                          ? "● Active"
                          : obj.status === "dormant"
                            ? "○ Silent"
                            : "✕ Defunct"}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              {operationalCount > 0 && (
                <p className="mt-3 text-xs text-ok/80">
                  {t("report.stillOperational", { count: operationalCount })}
                </p>
              )}
            </motion.div>
          )}

          {/* Mission Debrief */}
          {(mission.keyDiscovery || mission.missionLegacy || mission.funFact) && (
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-regolith-400/70">
                {t("report.missionDebrief")}
              </p>

              {mission.keyDiscovery && (
                <div className="rounded-lg bg-signal/5 border border-signal/20 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-signal/70 mb-1">
                    {t("report.keyDiscovery")}
                  </p>
                  <p className="text-sm leading-relaxed text-regolith-200">
                    {mission.keyDiscovery}
                  </p>
                </div>
              )}

              {mission.missionLegacy && (
                <div className="rounded-lg bg-space-800/60 border border-space-600/30 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-regolith-400/60 mb-1">
                    {t("report.missionLegacy")}
                  </p>
                  <p className="text-sm leading-relaxed text-regolith-300">
                    {mission.missionLegacy}
                  </p>
                </div>
              )}

              {mission.funFact && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400/70 mb-1">
                    {t("report.funFact")}
                  </p>
                  <p className="text-sm leading-relaxed text-regolith-200">{mission.funFact}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Mission Timeline */}
          {mission.timeline && (
            <motion.div
              className="mt-6 rounded-lg bg-space-800/40 border border-space-700/30 px-4 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-regolith-400/60 mb-2">
                {t("report.missionTimeline")}
              </p>
              <div className="space-y-1.5">
                {mission.timeline.launch && (
                  <div className="flex justify-between text-xs">
                    <span className="text-regolith-400">{t("report.timelineLaunch")}</span>
                    <span className="text-regolith-300 font-mono">{mission.timeline.launch}</span>
                  </div>
                )}
                {mission.timeline.landing && (
                  <div className="flex justify-between text-xs">
                    <span className="text-regolith-400">{t("report.timelineLanding")}</span>
                    <span className="text-regolith-300 font-mono">{mission.timeline.landing}</span>
                  </div>
                )}
                {mission.timeline.lastContact && (
                  <div className="flex justify-between text-xs">
                    <span className="text-regolith-400">{t("report.timelineLastContact")}</span>
                    <span className="text-regolith-300 font-mono">
                      {mission.timeline.lastContact}
                    </span>
                  </div>
                )}
                {mission.timeline.endOfMission && (
                  <div className="flex justify-between text-xs">
                    <span className="text-regolith-400">{t("report.timelineEndOfMission")}</span>
                    <span className="text-regolith-300 font-mono">
                      {mission.timeline.endOfMission}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Heritage Preservation Note */}
          {mission.heritageNote && (
            <motion.div
              className="mt-4 rounded-lg bg-space-800/30 px-4 py-3 border border-space-700/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-regolith-400/50 mb-1">
                {t("report.heritageNote")}
              </p>
              <p className="text-xs leading-relaxed text-regolith-400/80 italic">
                {mission.heritageNote}
              </p>
            </motion.div>
          )}

          {/* Rank */}
          <div className="mt-6 rounded-lg bg-space-800 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-regolith-400">
              {t("report.currentRank")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-signal">{getRank()}</p>
            <p className="mt-1 text-sm text-regolith-400">
              <AnimatedNumber target={totalXp} duration={1500} /> {t("report.xpTotalSuffix")}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {nextMissionId && (
              <Button
                onClick={handleNextMission}
                aria-label={`Start next mission: ${nextMissionLabel}`}
                className="w-full bg-signal text-space-950 hover:bg-signal/90 font-semibold text-base py-3 focus-visible:ring-2 focus-visible:ring-signal"
              >
                {t("report.nextMission", { mission: nextMissionLabel })}
              </Button>
            )}
            <Button
              onClick={() => send("BACK_TO_SELECT")}
              aria-label="Return to mission select"
              className="w-full bg-space-700 text-regolith-200 hover:bg-space-600 focus-visible:ring-2 focus-visible:ring-signal"
            >
              {t("report.backToMissions")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
