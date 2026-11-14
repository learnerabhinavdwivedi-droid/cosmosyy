import { useMemo } from "react";
import { getDisplayComponents, type HologramManifest } from "../hologramMapping";
import { hasDedicated3DModel, getDedicatedComponents } from "../heritage3D/Heritage3DDispatcher";
import type { ObjectTheme } from "./types";

interface ExplodeControllerProps {
  missionId: string;
  objectId: string;
  explode: number;
  setExplode: (v: number) => void;
  manifest?: HologramManifest | null;
  theme: ObjectTheme;
}

export function ExplodeController({
  missionId,
  objectId,
  explode,
  setExplode,
  manifest,
  theme,
}: ExplodeControllerProps) {
  const parts = useMemo(() => {
    if (hasDedicated3DModel(missionId, objectId)) {
      return getDedicatedComponents(missionId, objectId);
    }
    return manifest ? getDisplayComponents(manifest) : [];
  }, [missionId, objectId, manifest]);

  return (
    <div
      className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1.5 rounded-lg border px-3 py-2 backdrop-blur-md pointer-events-auto transition-all shadow-lg"
      style={{
        borderColor: theme.border,
        background: "rgba(7,9,13,0.85)",
      }}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span
          className="font-bold tracking-wider uppercase flex items-center gap-1.5"
          style={{ color: theme.primary }}
        >
          <span>⛶</span>
          <span>Subsystem Explode</span>
        </span>
        <span className="font-bold text-regolith-200">
          {Math.round(explode * 100)}%
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={explode}
        onChange={(e) => setExplode(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-space-800"
        style={{ accentColor: theme.primary }}
        aria-label="Explode subsystem parts"
      />

      {/* Clean horizontal chips when exploded */}
      {explode > 0.05 && parts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar">
          {parts.map((p) => (
            <span
              key={p.name}
              className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono border"
              style={{
                borderColor: theme.border,
                background: theme.primaryDim,
                color: theme.primary,
              }}
            >
              {p.displayName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
