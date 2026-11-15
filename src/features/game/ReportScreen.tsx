import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/store/useGameStore";
import {
  useAppStore,
  getNextMissionId,
  ACHIEVEMENT_DEFS,
  type RankDef,
} from "@/store/useAppStore";
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

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function StarRating({ stars, delay = 0 }: { stars: number; delay?: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3].map((i) => (
        <motion.svg
          key={i}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{
            opacity: 1,
            scale: i <= stars ? 1 : 0.6,
            rotate: 0,
          }}
          transition={{
            delay: delay + i * 0.25,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className={i <= stars ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-space-700/60"}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
          />
        </motion.svg>
      ))}
    </div>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
}

let particleId = 0;

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ["#ff6b2c", "#ffd36e", "#3fb07a", "#ff4444", "#38bdf8", "#f2b33d", "#a855f7"];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        id: ++particleId,
        x: 50 + (i % 2 === 0 ? -1 : 1) * (5 + (i * 7.3) % 40),
        y: -5 - (i * 3.7) % 15,
        color: colors[i % colors.length]!,
        size: 4 + (i % 5) * 2,
        vx: ((i * 13.7) % 7 - 3.5) * 0.4,
        vy: 1 + (i * 2.3) % 3,
        rotation: (i * 47) % 360,
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            rotation: p.rotation + p.vx * 8,
            vy: p.vy + 0.05,
          }))
          .filter((p) => p.y < 120),
      );
    }, 30);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: "1px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: Math.max(0, 1 - p.y / 100),
          }}
        />
      ))}
    </div>
  );
}

export function ReportScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const send = useGameStore((s) => s.send);
  const missionId = useGameStore((s) => s.missionId);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const getRank = useAppStore((s) => s.getRank);
  const getRankProgress = useAppStore((s) => s.getRankProgress);
  const completeMission = useAppStore((s) => s.completeMission);
  const addXp = useAppStore((s) => s.addXp);
  const startMission = useAppStore((s) => s.startMission);
  const missionStartTime = useAppStore((s) => s.session.missionStartTime);
  const achievements = useAppStore((s) => s.progress.achievements);

  const mission = useMemo(() => getMission(missionId ?? "apollo-11"), [missionId]);
  const isRobotic = mission.missionType === "robotic";
  const TOTAL_OBJECTS = mission.objects.length;

  const [showConfetti, setShowConfetti] = useState(false);
  const [rankUpName, setRankUpName] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const prevAchievementsRef = useMemo(() => [...achievements], []);

  const missionTimeMs = useMemo(
    () => (missionStartTime ? Date.now() - missionStartTime : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (missionId) {
      const prevRank = getRank().name;
      completeMission(missionId);
      addXp(missionId, XP_LAND);
      const newRank = getRank().name;
      if (newRank !== prevRank) {
        setRankUpName(newRank);
      }
    }
    setTimeout(() => setShowConfetti(true), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newOnes = achievements.filter((a) => !prevAchievementsRef.includes(a));
    if (newOnes.length > 0) setNewAchievements(newOnes);
  }, [achievements, prevAchievementsRef]);

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

  const stars = useMemo(() => {
    let s = 1;
    if (found.length >= TOTAL_OBJECTS) s = 2;
    if (s === 2) s = 3;
    return s;
  }, [found.length, TOTAL_OBJECTS]);

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

  const rankProgress = getRankProgress();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <Confetti active={showConfetti} />

      {/* Background */}
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
          className="mb-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ok">
            {t("report.missionSuccess")}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-regolith-200">{missionName}</h1>

          {/* Star Rating */}
          <div className="mt-3 flex justify-center">
            <StarRating stars={stars} delay={0.5} />
          </div>

          {/* Mission Time */}
          {missionTimeMs && (
            <motion.p
              className="mt-2 font-mono text-xs text-regolith-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Mission Time: {formatTime(missionTimeMs)}
            </motion.p>
          )}
        </motion.div>

        {/* Rank Up Banner */}
        <AnimatePresence>
          {rankUpName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.0 }}
              className="mb-4 rounded-xl border border-signal/40 bg-gradient-to-r from-signal/15 to-amber-500/10 px-5 py-3 text-center backdrop-blur"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-signal">
                Rank Up!
              </p>
              <p className="mt-1 font-display text-xl font-bold text-white">
                {getRank().icon} {rankUpName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="rounded-xl border border-space-700 bg-space-900/90 p-6 sm:p-8 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* XP Stats */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-space-700/60 pb-2">
              <span className="text-sm text-regolith-400">{t("report.objectsFound")}</span>
              <span className="font-mono text-sm text-regolith-200">
                {found.length} / {TOTAL_OBJECTS}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700/60 pb-2">
              <span className="text-sm text-regolith-400">{t("report.landingXp")}</span>
              <span className="font-mono text-sm text-ok">+{XP_LAND}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700/60 pb-2">
              <span className="text-sm text-regolith-400">{t("report.objectsXp")}</span>
              <span className="font-mono text-sm text-ok">+{objectXp}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700/60 pb-2">
              <span className="text-sm text-regolith-400">
                {t(isRobotic ? "report.surveyCompleted" : "report.flagPlanted")}
              </span>
              <span className="font-mono text-sm text-ok">+{flagXp}</span>
            </div>
            <div className="flex items-center justify-between border-b border-space-700/60 pb-2">
              <span className="text-sm text-regolith-400">{t("report.missionComplete")}</span>
              <span className="font-mono text-sm text-ok">+{XP_COMPLETE}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-regolith-200">{t("report.totalEarned")}</span>
              <span className="font-mono text-xl font-bold text-signal">
                +<AnimatedNumber target={missionXp} /> XP
              </span>
            </div>
          </div>

          {/* Achievements Earned This Mission */}
          {newAchievements.length > 0 && (
            <motion.div
              className="mt-5 rounded-lg border border-amber-500/30 bg-amber-950/30 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Achievements Earned
              </p>
              <div className="flex flex-wrap gap-2">
                {newAchievements.map((achId, i) => {
                  const def = ACHIEVEMENT_DEFS.find((a) => a.id === achId);
                  if (!def) return null;
                  return (
                    <motion.div
                      key={achId}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.7 + i * 0.15, type: "spring" }}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-900/40 border border-amber-500/20 px-2.5 py-1.5"
                    >
                      <span className="text-lg">{def.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-amber-200">{def.title}</p>
                        <p className="text-[10px] text-amber-400/70">{def.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* What stayed behind */}
          {foundObjects.length > 0 && (
            <motion.div
              className="mt-5 rounded-lg bg-space-800/60 p-4"
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
                            : obj.status === "preserved" || obj.status === "intact"
                              ? "text-purple-400"
                              : obj.status === "dormant"
                                ? "text-amber-400"
                                : "text-regolith-500"
                        }`}
                      >
                        {obj.status === "operational"
                          ? "● Active"
                          : obj.status === "preserved" || obj.status === "intact"
                            ? "✦ Preserved"
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
              className="mt-5 space-y-3"
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

          {/* Rank + Progress */}
          <motion.div
            className="mt-5 rounded-lg bg-space-800 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-regolith-400">
                  {t("report.currentRank")}
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-signal">
                  {getRank().icon} {getRank().name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-regolith-400">Total XP</p>
                <p className="mt-0.5 font-mono text-xl font-bold text-regolith-200">
                  <AnimatedNumber target={totalXp} duration={1500} />
                </p>
              </div>
            </div>
            {rankProgress.next && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-space-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-signal via-warn to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(4, rankProgress.progressPct * 100)}%` }}
                    transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-regolith-400/60 text-right">
                  Next: {rankProgress.next.icon} {rankProgress.next.name} ({rankProgress.next.minXp} XP)
                </p>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {nextMissionId && (
              <Button
                onClick={handleNextMission}
                aria-label={`Start next mission: ${nextMissionLabel}`}
                className="w-full bg-signal text-space-950 hover:bg-signal/90 font-semibold text-base py-3 focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
              >
                {t("report.nextMission", { mission: nextMissionLabel })}
              </Button>
            )}
            <Button
              onClick={() => send("BACK_TO_SELECT")}
              aria-label="Return to mission select"
              className="w-full bg-space-700 text-regolith-200 hover:bg-space-600 focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
            >
              {t("report.backToMissions")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
