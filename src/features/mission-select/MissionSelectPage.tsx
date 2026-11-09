import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MissionStatus } from "@/store/useAppStore";

interface MissionCardData {
  id: string;
  name: string;
  site: string;
  date: string;
  crew: string;
}

const MISSIONS: MissionCardData[] = [
  {
    id: "apollo-11",
    name: "Apollo 11",
    site: "Sea of Tranquility",
    date: "20 July 1969",
    crew: "Armstrong, Aldrin, Collins",
  },
  {
    id: "apollo-12",
    name: "Apollo 12",
    site: "Ocean of Storms",
    date: "19 November 1969",
    crew: "Conrad, Bean, Gordon",
  },
  {
    id: "apollo-14",
    name: "Apollo 14",
    site: "Fra Mauro",
    date: "5 February 1971",
    crew: "Shepard, Mitchell, Roosa",
  },
  {
    id: "apollo-15",
    name: "Apollo 15",
    site: "Hadley Rille",
    date: "30 July 1971",
    crew: "Scott, Irwin, Worden",
  },
  {
    id: "apollo-16",
    name: "Apollo 16",
    site: "Descartes Highlands",
    date: "21 April 1972",
    crew: "Young, Duke, Mattingly",
  },
  {
    id: "apollo-17",
    name: "Apollo 17",
    site: "Taurus–Littrow",
    date: "11 December 1972",
    crew: "Cernan, Schmitt, Evans",
  },
];

function StatusBadge({ status }: { status: MissionStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        status === "locked" && "bg-space-700/60 text-regolith-400",
        status === "available" && "bg-signal/20 text-signal",
        status === "in-progress" && "bg-warn/20 text-warn",
        status === "completed" && "bg-ok/20 text-ok",
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
  onLaunch,
}: {
  mission: MissionCardData;
  status: MissionStatus;
  onLaunch: () => void;
}) {
  const { t } = useTranslation();
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border p-5 transition-all duration-200",
        isLocked
          ? "border-space-700/30 bg-space-900/40 opacity-50"
          : "border-space-700/60 bg-space-800/60 hover:border-signal/40 hover:bg-space-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-display text-xl font-bold",
              isLocked ? "text-regolith-400" : "text-regolith-200",
            )}
          >
            {mission.name}
          </h3>
          <p className="mt-0.5 text-sm text-regolith-400">{mission.site}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 space-y-1 text-xs text-regolith-400">
        <p>{mission.date}</p>
        <p>{mission.crew}</p>
      </div>

      {!isLocked && (
        <Button
          onClick={onLaunch}
          className="mt-4 w-full bg-signal text-space-950 hover:bg-signal/90 font-semibold"
        >
          {t("missionSelect.launch")}
        </Button>
      )}
    </div>
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

  const [nameInput, setNameInput] = useState(playerName);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length >= 2 && trimmed.length <= 16) {
      setPlayerName(trimmed);
    }
  };

  const handleLaunch = (missionId: string) => {
    if (!playerName) return;
    startMission(missionId);
    navigate(`/flight/${missionId}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      {/* Starfield background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--space-900)_0%,_var(--space-950)_70%)]" />
        {Array.from({ length: 80 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-regolith-200"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 37.7) % 100}%`,
              left: `${(i * 61.3) % 100}%`,
              opacity: 0.15 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-regolith-200 sm:text-6xl">
            {t("app.title")}
          </h1>
          <p className="mt-2 text-lg text-regolith-400">
            {t("app.tagline")}
          </p>
        </header>

        {/* Name input */}
        {!playerName ? (
          <div className="mx-auto mt-10 w-full max-w-sm">
            <label className="mb-2 block text-sm font-medium text-regolith-400">
              {t("missionSelect.enterName")}
            </label>
            <div className="flex gap-2">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder={t("missionSelect.namePlaceholder")}
                maxLength={16}
                className="border-space-700 bg-space-800 text-regolith-200 placeholder:text-regolith-400/50 focus:border-signal"
              />
              <Button
                onClick={handleNameSubmit}
                disabled={nameInput.trim().length < 2}
                className="bg-signal text-space-950 hover:bg-signal/90 font-semibold disabled:opacity-40"
              >
                GO
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <span className="text-regolith-400">
              Welcome, <span className="font-semibold text-regolith-200">{playerName}</span>
            </span>
            <span className="text-space-700">|</span>
            <span className="text-regolith-400">
              {totalXp} XP
            </span>
            <span className="text-space-700">|</span>
            <span className={cn(
              "font-semibold",
              getRank() === "Cadet" && "text-regolith-400",
              getRank() === "Pilot" && "text-warn",
              getRank() === "Commander" && "text-signal",
            )}>
              {getRank()}
            </span>
          </div>
        )}

        {/* Mission heading */}
        <h2 className="mt-10 text-center font-display text-2xl font-semibold text-regolith-200">
          {t("missionSelect.heading")}
        </h2>

        {/* Mission grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((mission) => {
            const progress = missions[mission.id];
            const status: MissionStatus = progress?.status ?? "locked";
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                status={status}
                onLaunch={() => handleLaunch(mission.id)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 pb-4 text-center text-xs text-regolith-400/60">
          NASA Space Apps Challenge 2026
        </footer>
      </div>
    </div>
  );
}
