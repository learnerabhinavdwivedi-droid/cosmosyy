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
      className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-2xl border px-4 py-2 backdrop-blur-xl pointer-events-auto transition-all shadow-2xl"
      style={{
        borderColor: theme.border,
        background: "rgba(8,12,20,0.88)",
      }}
    >
      <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
        <span style={{ color: theme.primary }}>⛶</span>
        <span className="font-bold tracking-wider uppercase text-regolith-300">
          Subsystem Explode
        </span>
        <span
          className="rounded px-1.5 py-0.2 font-mono font-bold text-[9px] border"
          style={{
            borderColor: theme.border,
            background: theme.primaryDim,
            color: theme.primary,
          }}
        >
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
        className="h-1.5 w-36 sm:w-56 cursor-pointer appearance-none rounded-lg bg-space-800"
        style={{ accentColor: theme.primary }}
        aria-label="Explode subsystem parts"
      />

      {/* Clean horizontal chips when exploded */}
      {explode > 0.05 && parts.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-xs no-scrollbar">
          {parts.slice(0, 3).map((p) => (
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
          {parts.length > 3 && (
            <span className="text-[9px] font-mono text-regolith-400">+{parts.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
