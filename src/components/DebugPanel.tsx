import { useState, useEffect } from "react";
import { useGameStore, type GameEvent } from "@/store/useGameStore";

const ALL_EVENTS: GameEvent[] = [
  "LAUNCH_MISSION",
  "START_COAST",
  "REACH_ORBIT",
  "LOCK_TARGET",
  "BEGIN_DESCENT",
  "TOUCH_DOWN",
  "OPEN_HATCH",
  "STEP_OUT",
  "START_INSPECT",
  "EXIT_INSPECT",
  "ALL_FOUND",
  "PLANT_FLAG",
  "LAUNCH_HOME",
  "SHOW_REPORT",
  "BACK_TO_SELECT",
];

export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const phase = useGameStore((s) => s.phase);
  const missionId = useGameStore((s) => s.missionId);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const beat = useGameStore((s) => s.flightBeatIndex);
  const send = useGameStore((s) => s.send);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`") setOpen((o) => !o);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[9999] m-2 max-h-[50vh] w-80 overflow-y-auto rounded-lg border border-space-700 bg-space-950/95 p-3 text-xs text-regolith-200 backdrop-blur font-mono">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-signal font-bold">DEBUG</span>
        <button onClick={() => setOpen(false)} className="text-regolith-400 hover:text-regolith-200">
          [x]
        </button>
      </div>
      <div className="mb-2 space-y-1">
        <div>Phase: <span className="text-ok font-bold">{phase}</span></div>
        <div>Mission: {missionId ?? "none"}</div>
        <div>Beat: {beat}</div>
        <div>Found: {found.length > 0 ? found.join(", ") : "none"}</div>
      </div>
      <div className="border-t border-space-700 pt-2">
        <div className="mb-1 text-regolith-400">Send event:</div>
        <div className="flex flex-wrap gap-1">
          {ALL_EVENTS.map((event) => (
            <button
              key={event}
              onClick={() => send(event)}
              className="rounded bg-space-800 px-1.5 py-0.5 text-[10px] hover:bg-space-700 hover:text-signal transition-colors"
            >
              {event}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
