import { useMemo } from "react";
import type { HeritageObject, ObjectTheme } from "./types";

interface MissionCompartmentDrawerProps {
  missionId: string;
  missionName: string;
  objects: HeritageObject[];
  activeIdx: number;
  onSelectIndex: (idx: number) => void;
  foundObjectIds: string[];
  theme: ObjectTheme;
}

export function MissionCompartmentDrawer({
  missionName,
  objects,
  activeIdx,
  onSelectIndex,
  foundObjectIds,
  theme,
}: MissionCompartmentDrawerProps) {
  const scannedCount = useMemo(() => {
    return objects.filter((o) => foundObjectIds.includes(o.id)).length;
  }, [objects, foundObjectIds]);

  return (
    <div
      className="mt-2.5 rounded-xl border p-2.5 backdrop-blur-md shrink-0 flex flex-col gap-2"
      style={{
        borderColor: theme.border,
        background: "rgba(8,11,18,0.85)",
      }}
    >
      {/* Header with mission compartment title & archived count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📂</span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-regolith-300">
            {missionName} Artifacts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold border"
            style={{
              borderColor: theme.border,
              background: theme.primaryDim,
              color: theme.primary,
            }}
          >
            {scannedCount} / {objects.length} Archived
          </span>
          <span className="font-mono text-[10px] text-regolith-400">
            {activeIdx + 1} of {objects.length}
          </span>
        </div>
      </div>

      {/* Unified Carousel Bar with Prev / Next Navigation */}
      <div className="flex items-center gap-1.5">
        {objects.length > 1 && (
          <button
            type="button"
            onClick={() =>
              onSelectIndex(activeIdx > 0 ? activeIdx - 1 : objects.length - 1)
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-space-700/60 bg-space-800/60 text-xs font-bold text-regolith-300 transition hover:bg-space-700 hover:text-white active:scale-95 cursor-pointer"
            aria-label="Previous artifact"
          >
            ‹
          </button>
        )}

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {objects.map((obj, idx) => {
            const isScanned = foundObjectIds.includes(obj.id);
            const isActive = idx === activeIdx;

            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-mono font-semibold transition active:scale-95 cursor-pointer ${
                  isActive ? "shadow-md" : "hover:bg-space-800/60"
                }`}
                style={{
                  borderColor: isActive
                    ? theme.primary
                    : isScanned
                    ? "rgba(74,222,128,0.3)"
                    : "rgba(100,116,139,0.25)",
                  background: isActive
                    ? theme.primaryDim
                    : isScanned
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(15,23,42,0.4)",
                  color: isActive
                    ? theme.primary
                    : isScanned
                    ? "#86efac"
                    : "#64748b",
                  boxShadow: isActive ? `0 0 8px ${theme.glow}` : "none",
                }}
              >
                <span>{isScanned ? "✓" : "🔒"}</span>
                <span className="truncate max-w-[130px]">{obj.name}</span>
              </button>
            );
          })}
        </div>

        {objects.length > 1 && (
          <button
            type="button"
            onClick={() =>
              onSelectIndex(activeIdx < objects.length - 1 ? activeIdx + 1 : 0)
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-space-700/60 bg-space-800/60 text-xs font-bold text-regolith-300 transition hover:bg-space-700 hover:text-white active:scale-95 cursor-pointer"
            aria-label="Next artifact"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
