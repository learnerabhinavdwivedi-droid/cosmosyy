import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { DebugPanel } from "@/components/DebugPanel";
import { FlightScene } from "./FlightScene";
import { SurfaceScene } from "./SurfaceScene";
import { ReportScreen } from "./ReportScreen";

export default function GameShell() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);
  const setMission = useGameStore((s) => s.setMission);
  const gameMission = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);
  const prevPhase = useRef(phase);

  useEffect(() => {
    if (!playerName) {
      navigate("/");
      return;
    }
    if (missionId && gameMission !== missionId) {
      setMission(missionId);
      send("LAUNCH_MISSION");
    }
  }, [missionId, gameMission, playerName, navigate, setMission, send]);

  useEffect(() => {
    if (phase === "select" && prevPhase.current !== "select") {
      navigate("/");
    }
    prevPhase.current = phase;
  }, [phase, navigate]);

  const isFlightPhase = [
    "flight",
    "coast",
    "orbit",
    "targetLocked",
    "descent",
    "touchdown",
    "stepOut",
  ].includes(phase);

  const isSurfacePhase = [
    "explore",
    "inspect",
    "flagReady",
    "flagPlanted",
  ].includes(phase);

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      {isFlightPhase && <FlightScene />}
      {isSurfacePhase && <SurfaceScene />}
      {phase === "launch" && <LaunchScene />}
      {phase === "report" && <ReportScreen />}
      <DebugPanel />
    </div>
  );
}

function LaunchScene() {
  const send = useGameStore((s) => s.send);

  useEffect(() => {
    const timer = setTimeout(() => send("SHOW_REPORT"), 3000);
    return () => clearTimeout(timer);
  }, [send]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl">🚀</div>
      <h1 className="font-display text-3xl font-bold text-regolith-200">
        Launching home...
      </h1>
      <p className="text-regolith-400">Ascent stage separating</p>
    </div>
  );
}
