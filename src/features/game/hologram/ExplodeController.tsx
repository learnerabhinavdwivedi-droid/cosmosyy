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
      className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1 rounded-lg border p-2 backdrop-blur-md pointer-events-auto"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="font-bold tracking-wider uppercase" style={{ color: theme.primary }}>
          Subsystem Explode
        </span>
        <span className="text-regolith-300">{Math.round(explode * 100)}%</span>
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
      />
      {parts.length > 0 && (
        <div className="mt-1 max-h-16 overflow-y-auto">
          <div className="flex flex-col gap-1 py-1">
            {parts.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[9px] font-mono font-bold"
                  style={{ borderColor: theme.border, background: theme.primaryDim, color: theme.primary }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-regolith-200">{p.displayName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
