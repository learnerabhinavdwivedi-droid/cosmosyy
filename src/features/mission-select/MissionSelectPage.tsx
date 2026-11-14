import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/store/useAppStore";
import { gameAudio } from "@/lib/gameAudio";
import { unlockAudio, preloadNarration } from "@/lib/narration";
import { preloadGameAssets } from "@/lib/assetPreload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isTouchDevice } from "@/lib/useMobile";
import { requestFullscreen } from "@/lib/fullscreen";
import type { MissionStatus } from "@/store/useAppStore";

type PlanetTab = "moon" | "mars" | "deep-space";

interface MissionCardData {
  id: string;
  name: string;
  site: string;
  date: string;
  crew: string;
  hook: string;
  objectCount: number;
}

const MOON_MISSIONS: MissionCardData[] = [
  {
    id: "apollo-11",
    name: "Apollo 11",
    site: "Sea of Tranquility",
    date: "20 July 1969",
    crew: "Armstrong, Aldrin, Collins",
    hook: "One small step — the first humans on the Moon.",
    objectCount: 7,
  },
  {
    id: "apollo-12",
    name: "Apollo 12",
    site: "Ocean of Storms",
    date: "19 November 1969",
    crew: "Conrad, Bean, Gordon",
    hook: "Precision landing beside Surveyor 3.",
    objectCount: 6,
  },
  {
    id: "apollo-14",
    name: "Apollo 14",
    site: "Fra Mauro",
    date: "5 February 1971",
    crew: "Shepard, Mitchell, Roosa",
    hook: "Shepard's lunar golf shot and the longest EVA walk.",
    objectCount: 6,
  },
  {
    id: "apollo-15",
    name: "Apollo 15",
    site: "Hadley Rille",
    date: "30 July 1971",
    crew: "Scott, Irwin, Worden",
    hook: "First lunar rover — exploring the edge of a canyon.",
    objectCount: 6,
  },
  {
    id: "apollo-16",
    name: "Apollo 16",
    site: "Descartes Highlands",
    date: "21 April 1972",
    crew: "Young, Duke, Mattingly",
    hook: "Into the lunar highlands for the first time.",
    objectCount: 6,
  },
  {
    id: "apollo-17",
    name: "Apollo 17",
    site: "Taurus–Littrow",
    date: "11 December 1972",
    crew: "Cernan, Schmitt, Evans",
    hook: "The final Apollo mission — a geologist on the Moon.",
    objectCount: 6,
  },
];

const MARS_MISSIONS: MissionCardData[] = [
  {
    id: "mars-viking1",
    name: "Viking 1",
    site: "Chryse Planitia",
    date: "20 July 1976",
    crew: "NASA / JPL",
    hook: "The first successful landing on Mars — a new world in colour.",
    objectCount: 6,
  },
  {
    id: "mars-pathfinder",
    name: "Mars Pathfinder",
    site: "Ares Vallis",
    date: "4 July 1997",
    crew: "NASA / JPL",
    hook: "Airbag landing and the first Mars rover: tiny Sojourner.",
    objectCount: 6,
  },
  {
    id: "mars-spirit",
    name: "Spirit (MER-A)",
    site: "Gusev Crater",
    date: "4 January 2004",
    crew: "NASA / JPL",
    hook: "90 sols planned, 2,208 delivered. Stuck but never stopped.",
    objectCount: 6,
  },
  {
    id: "mars-opportunity",
    name: "Opportunity (MER-B)",
    site: "Meridiani Planum",
    date: "25 January 2004",
    crew: "NASA / JPL",
    hook: "A marathon on Mars — 45 km in nearly 15 years.",
    objectCount: 6,
  },
  {
    id: "mars-curiosity",
    name: "Curiosity (MSL)",
    site: "Gale Crater",
    date: "6 August 2012",
    crew: "NASA / JPL",
    hook: "Sky crane landing. Nuclear-powered. Climbing Mount Sharp.",
    objectCount: 6,
  },
  {
    id: "mars-perseverance",
    name: "Perseverance",
    site: "Jezero Crater",
    date: "18 February 2021",
    crew: "NASA / JPL",
    hook: "Searching for ancient life. First Mars helicopter. Sample return.",
    objectCount: 6,
  },
];

const DEEP_SPACE_MISSIONS: MissionCardData[] = [
  {
    id: "deep-dawn",
    name: "Dawn at Ceres",
    site: "Occator Crater (Cerealia Facula)",
    date: "6 March 2015",
    crew: "NASA / JPL",
    hook: "Brilliant salt domes and a briny ocean inside dwarf planet Ceres.",
    objectCount: 4,
  },
  {
    id: "deep-near",
    name: "NEAR Shoemaker",
    site: "Asteroid 433 Eros",
    date: "12 February 2001",
    crew: "NASA / JHU APL",
    hook: "Humanity's first soft touchdown on an asteroid.",
    objectCount: 4,
  },
  {
    id: "deep-voyager",
    name: "Voyager Interstellar",
    site: "Beyond Heliopause (~163 AU)",
    date: "5 September 1977",
    crew: "NASA / JPL",
    hook: "Farthest human artifact — cruising interstellar space with the Golden Record.",
    objectCount: 4,
  },
  {
    id: "deep-kepler",
    name: "Kepler Space Telescope",
    site: "Earth-Trailing Solar Orbit",
    date: "7 March 2009",
    crew: "NASA Ames",
    hook: "The planet hunter that discovered 2,662+ alien worlds.",
    objectCount: 4,
  },
];

function StatusBadge({ status }: { status: MissionStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        status === "locked" && "bg-space-700/60 text-regolith-400",
        status === "available" && "bg-signal/20 text-signal border border-signal/30",
        status === "in-progress" && "bg-warn/20 text-warn border border-warn/30",
        status === "completed" && "bg-ok/20 text-ok border border-ok/30",
      )}
    >
      {status === "locked" && t("missionSelect.locked")}
      {status === "available" && t("missionSelect.available")}
      {status === "in-progress" && "In Progress"}
      {status === "completed" && t("missionSelect.completed")}
    </span>
  );
}

function MissionCard({
  mission,
  status,
  objectsFound,
  onLaunch,
  planetTab,
}: {
  mission: MissionCardData;
  status: MissionStatus;
  objectsFound: number;
  onLaunch: () => void;
  planetTab: PlanetTab;
}) {
  const { t } = useTranslation();
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isMars = planetTab === "mars";
  const isDeepSpace = planetTab === "deep-space";

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        isLocked
          ? "border-space-700/20 bg-space-900/30 opacity-40"
          : cn(
              "border-space-700/50 bg-gradient-to-b from-space-800/80 to-space-900/90 backdrop-blur-sm",
              isMars
                ? "hover:border-warn/40 hover:shadow-lg hover:shadow-warn/5"
                : isDeepSpace
                ? "hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
                : "hover:border-signal/40 hover:shadow-lg hover:shadow-signal/5",
            ),
      )}
      whileHover={isLocked ? undefined : { scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {!isLocked && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            isMars
              ? "bg-gradient-to-r from-transparent via-warn to-transparent"
              : isDeepSpace
              ? "bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              : "bg-gradient-to-r from-transparent via-signal to-transparent",
          )}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-display text-xl font-bold transition-colors",
              isLocked ? "text-regolith-400" : cn(
                "text-regolith-200",
                isMars ? "group-hover:text-warn" : "group-hover:text-signal",
              ),
            )}
          >
            {mission.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-regolith-400">
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {mission.site}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-regolith-400/90">{mission.hook}</p>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-regolith-400/70">
        <span className="font-mono">{mission.date}</span>
        <span className={cn("h-3 w-px", isMars ? "bg-warn/20" : isDeepSpace ? "bg-purple-500/20" : "bg-signal/20")} />
        <span className="truncate">{mission.crew}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] text-regolith-400/70">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {mission.objectCount} relics
        </span>
        {isCompleted && (
          <span className="rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">
            {objectsFound}/{mission.objectCount} found
          </span>
        )}
      </div>

      {!isLocked && (
        <Button
          onClick={onLaunch}
          aria-label={`Launch ${mission.name} mission to ${mission.site}`}
          className={cn(
            "mt-4 w-full font-bold tracking-wide focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-space-900 transition-all",
            isMars
              ? "bg-gradient-to-r from-warn to-[#c1440e] text-space-950 hover:shadow-md hover:shadow-warn/20 focus-visible:ring-warn"
              : isDeepSpace
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 focus-visible:ring-purple-400"
              : "bg-gradient-to-r from-signal to-[#e85d20] text-space-950 hover:shadow-md hover:shadow-signal/20 focus-visible:ring-signal",
          )}
        >
          {t("missionSelect.launch")}
        </Button>
      )}
    </motion.div>
  );
}

export default function MissionSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const playerName = useAppStore((s) => s.player.name);
  const setPlayerName = useAppStore((s) => s.setPlayerName);
  const missions = useAppStore((s) => s.progress.missions);
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const getRank = useAppStore((s) => s.getRank);
  const startMission = useAppStore((s) => s.startMission);

  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const [nameInput, setNameInput] = useState(playerName);
  const [planetTab, setPlanetTab] = useState<PlanetTab>("moon");
  const activeMissions =
    planetTab === "mars"
      ? MARS_MISSIONS
      : planetTab === "deep-space"
      ? DEEP_SPACE_MISSIONS
      : MOON_MISSIONS;

  useEffect(() => {
    preloadGameAssets();
    if (isDemo) {
      if (!playerName) setPlayerName("Commander");
      startMission("apollo-11");
      navigate("/play/apollo-11?demo=1");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length >= 2 && trimmed.length <= 16) {
      setPlayerName(trimmed);
    }
  };

  const handleLaunch = (missionId: string) => {
    if (!playerName) {
      setPlayerName(nameInput.trim() || "Astronaut");
    }
    if (isTouchDevice()) {
      requestFullscreen().catch(() => {});
    }
    gameAudio.unlock();
    unlockAudio();
    preloadNarration(missionId);
    startMission(missionId);
    navigate(`/play/${missionId}`);
  };

  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 120; i++) {
      list.push({
        top: (i * 37.7) % 100,
        left: (i * 61.3 + i * 7.1) % 100,
        size: 1 + (i % 3),
        delay: (i % 11) * 0.5,
        duration: 2 + (i % 7) * 0.6,
        opacity: 0.15 + (i % 6) * 0.12,
      });
    }
    return list;
  }, []);

  const isMars = planetTab === "mars";

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      {/* Animated starfield background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 transition-all duration-1000",
            isMars
              ? "bg-[radial-gradient(ellipse_at_top,_#1a0800_0%,_var(--space-950)_60%)]"
              : "bg-[radial-gradient(ellipse_at_top,_#0a0d18_0%,_var(--space-950)_60%)]",
          )}
        />
        {stars.map((s, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Atmospheric planet glow */}
      <div
        className={cn(
          "pointer-events-none fixed top-0 right-0 h-[500px] w-[500px] rounded-full blur-[120px] transition-all duration-1000",
          isMars ? "bg-[#c1440e]/8 translate-x-1/3 -translate-y-1/3" : "bg-signal/5 translate-x-1/3 -translate-y-1/3",
        )}
      />
      <div
        className={cn(
          "pointer-events-none fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[100px] transition-all duration-1000",
          isMars ? "bg-warn/5 -translate-x-1/3 translate-y-1/3" : "bg-[#38BDF8]/4 -translate-x-1/3 translate-y-1/3",
        )}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar navigation */}
        <nav className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-space-700/60 bg-space-900/60 px-3.5 py-1.5 text-xs font-semibold text-regolith-300 backdrop-blur-md transition hover:border-signal/50 hover:text-signal hover:bg-space-800/80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="rounded-xl border border-space-700/60 bg-space-900/60 px-3 py-1.5 text-xs text-regolith-400 backdrop-blur-md transition hover:text-regolith-200 hover:border-space-600"
            >
              Settings
            </Link>
            <Link
              to="/credits"
              className="rounded-xl border border-space-700/60 bg-space-900/60 px-3 py-1.5 text-xs text-regolith-400 backdrop-blur-md transition hover:text-regolith-200 hover:border-space-600"
            >
              Credits
            </Link>
          </div>
        </nav>

        {/* Header */}
        <motion.header
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-regolith-200">{t("app.title")}</span>
          </h1>
          <p className="mt-3 text-base text-regolith-400 sm:text-lg">
            {t("app.tagline")}
          </p>
        </motion.header>

        {/* Name input or Welcome bar */}
        {!playerName ? (
          <motion.div
            className="mx-auto mt-10 w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-space-700/60 bg-space-800/50 p-6 backdrop-blur-md">
              <label className="mb-3 block text-center text-sm font-semibold text-regolith-300">
                {t("missionSelect.enterName")}
              </label>
              <div className="flex gap-2">
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  placeholder={t("missionSelect.namePlaceholder")}
                  maxLength={16}
                  aria-label="Commander name"
                  className="border-space-700/60 bg-space-900/80 text-regolith-200 placeholder:text-regolith-400/40 focus:border-signal focus-visible:ring-2 focus-visible:ring-signal text-center text-lg"
                />
                <Button
                  onClick={handleNameSubmit}
                  disabled={nameInput.trim().length < 2}
                  aria-label="Confirm name"
                  className="bg-gradient-to-r from-signal to-warn text-space-950 hover:shadow-lg hover:shadow-signal/20 font-bold px-6 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-signal"
                >
                  GO
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="mx-auto mt-6 flex items-center gap-3 rounded-xl border border-space-700/40 bg-space-800/40 px-5 py-2.5 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span className="text-sm text-regolith-400">
              Welcome, <span className="font-bold text-regolith-200">{playerName}</span>
            </span>
            <span className="h-4 w-px bg-space-700" />
            <span className="font-mono text-sm text-signal">{totalXp} XP</span>
            <span className="h-4 w-px bg-space-700" />
            <span className={cn(
              "font-bold text-sm",
              getRank() === "Cadet" && "text-regolith-400",
              getRank() === "Pilot" && "text-warn",
              getRank() === "Commander" && "text-signal",
            )}>
              {getRank()}
            </span>
          </motion.div>
        )}

        {/* Planet tabs */}
        <motion.div
          className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-space-700/40 bg-space-900/60 p-1.5 backdrop-blur-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <button
            onClick={() => setPlanetTab("moon")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer",
              planetTab === "moon"
                ? "bg-gradient-to-r from-signal to-[#e85d20] text-space-950 shadow-md shadow-signal/20"
                : "text-regolith-400 hover:text-regolith-200 hover:bg-space-800/50",
            )}
          >
            <span className="text-base">🌔</span>
            {t("missionSelect.moonTab")} ({MOON_MISSIONS.length})
          </button>
          <button
            onClick={() => setPlanetTab("mars")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer",
              planetTab === "mars"
                ? "bg-gradient-to-r from-warn to-[#c1440e] text-space-950 shadow-md shadow-warn/20"
                : "text-regolith-400 hover:text-regolith-200 hover:bg-space-800/50",
            )}
          >
            <span className="text-base">🔴</span>
            {t("missionSelect.marsTab")} ({MARS_MISSIONS.length})
          </button>
          <button
            onClick={() => setPlanetTab("deep-space")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer",
              planetTab === "deep-space"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
                : "text-regolith-400 hover:text-regolith-200 hover:bg-space-800/50",
            )}
          >
            <span className="text-base">🌌</span>
            Deep Space & Asteroids ({DEEP_SPACE_MISSIONS.length})
          </button>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          className="mt-8 text-center font-display text-2xl font-bold text-regolith-200 sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {planetTab === "mars"
            ? t("missionSelect.marsHeading")
            : planetTab === "deep-space"
            ? "Deep Space Probes & Asteroids"
            : t("missionSelect.heading")}
        </motion.h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-regolith-400/80">
          {planetTab === "mars"
            ? "Deploy robotic explorers to the red planet. Scan landers, rovers and instruments left on Martian soil."
            : planetTab === "deep-space"
            ? "Track silent voyagers and asteroid touchdowns. Discover probes still traveling away from Earth and telescopes in solar orbit."
            : "Fly Saturn V rockets to the Moon. Walk the landing sites and scan what the astronauts left behind."}
        </p>

        {/* Mission grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={planetTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeMissions.map((mission, i) => {
              const progress = missions[mission.id];
              const status: MissionStatus = progress?.status ?? "available";
              const objectsFound = progress?.objectsFound?.length ?? 0;
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.04, ease: "easeOut" }}
                >
                  <MissionCard
                    mission={mission}
                    status={status}
                    objectsFound={objectsFound}
                    onLaunch={() => handleLaunch(mission.id)}
                    planetTab={planetTab}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-6 text-center">
          <p className="text-xs text-regolith-400/50">
            NASA Space Apps Challenge 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
