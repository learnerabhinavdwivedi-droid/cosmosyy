import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";

const XP_LAND = 50;
const XP_COMPLETE = 100;

export function ReportScreen() {
  const send = useGameStore((s) => s.send);
  const missionId = useGameStore((s) => s.missionId);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const getRank = useAppStore((s) => s.getRank);
  const completeMission = useAppStore((s) => s.completeMission);
  const addXp = useAppStore((s) => s.addXp);

  useEffect(() => {
    if (missionId) {
      completeMission(missionId);
      addXp(missionId, XP_LAND + XP_COMPLETE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const objectXp = found.length * 50;
  const flagXp = 100;
  const missionXp = XP_LAND + objectXp + flagXp + XP_COMPLETE;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-space-700 bg-space-900/90 p-8 backdrop-blur">
        <h1 className="text-center font-display text-3xl font-bold text-regolith-200">
          Mission Complete
        </h1>
        <p className="mt-1 text-center text-regolith-400">
          {missionId?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>

        {/* Stats */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between border-b border-space-700 pb-2">
            <span className="text-regolith-400">Objects found</span>
            <span className="font-mono text-regolith-200">
              {found.length} / 5
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-space-700 pb-2">
            <span className="text-regolith-400">Landing XP</span>
            <span className="font-mono text-ok">+{XP_LAND}</span>
          </div>
          <div className="flex items-center justify-between border-b border-space-700 pb-2">
            <span className="text-regolith-400">Objects XP</span>
            <span className="font-mono text-ok">+{objectXp}</span>
          </div>
          <div className="flex items-center justify-between border-b border-space-700 pb-2">
            <span className="text-regolith-400">Flag planted</span>
            <span className="font-mono text-ok">+{flagXp}</span>
          </div>
          <div className="flex items-center justify-between border-b border-space-700 pb-2">
            <span className="text-regolith-400">Mission complete</span>
            <span className="font-mono text-ok">+{XP_COMPLETE}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-regolith-200">
              Total earned
            </span>
            <span className="font-mono text-lg font-bold text-signal">
              +{missionXp} XP
            </span>
          </div>
        </div>

        {/* Rank */}
        <div className="mt-6 rounded-lg bg-space-800 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-regolith-400">
            Current rank
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-signal">
            {getRank()}
          </p>
          <p className="mt-1 text-sm text-regolith-400">{totalXp} XP total</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => send("BACK_TO_SELECT")}
            className="flex-1 bg-space-700 text-regolith-200 hover:bg-space-600"
          >
            Back to missions
          </Button>
        </div>
      </div>
    </div>
  );
}
