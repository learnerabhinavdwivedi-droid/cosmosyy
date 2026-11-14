import { useState } from "react";
import { getNssdcCatalog } from "@/lib/nssdcaCatalog";
import type { HeritageObject, ObjectTheme } from "./types";

interface ArtifactInfoPanelProps {
  obj: HeritageObject;
  missionId: string;
  missionName: string;
  missionSite: string;
  theme: ObjectTheme;
}

export function ArtifactInfoPanel({
  obj,
  missionId,
  missionName,
  missionSite,
  theme,
}: ArtifactInfoPanelProps) {
  const [imgError, setImgError] = useState(false);
  const nssdcEntry = getNssdcCatalog(missionId, obj.id);
  const nasaUrl = obj.nasaImageId
    ? `https://images-assets.nasa.gov/image/${obj.nasaImageId}/${obj.nasaImageId}~thumb.jpg`
    : null;

  return (
    <div className="flex-1 overflow-y-auto pr-1">
      {/* Object Title & Status */}
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-regolith-100">{obj.name}</h2>
            {obj.status && (
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                  obj.status === "operational"
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : obj.status === "dormant"
                    ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                    : "bg-space-800 text-regolith-400 border border-space-700"
                }`}
              >
                {obj.status === "operational"
                  ? "● Active Telemetry"
                  : obj.status === "dormant"
                  ? "○ Dormant Sensor"
                  : "✕ Defunct Structure"}
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-regolith-400">
            {missionName} · {missionSite}
          </p>
        </div>
      </div>

      {/* Official NASA NSSDCA Designation Banner */}
      {nssdcEntry && (
        <div className="mb-2.5 rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-2.5 shrink-0">
          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">
            NASA Master Catalog Designation
          </p>
          <p className="mt-0.5 text-xs font-bold text-cyan-100">
            {nssdcEntry.officialDesignation}
          </p>
          <p className="mt-0.5 text-[10px] text-regolith-400">
            NSSDC ID: <span className="font-mono text-cyan-300">{nssdcEntry.nssdcaId}</span>
          </p>
        </div>
      )}

      {/* NASA Image */}
      {nasaUrl && !imgError && (
        <div
          className="relative mb-2.5 overflow-hidden rounded-lg border shrink-0"
          style={{ borderColor: theme.border }}
        >
          <img
            src={nasaUrl}
            alt={obj.name}
            className="h-36 w-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 py-1">
            <p className="text-[9px] font-mono text-regolith-300">
              NASA Image Archive // ID: {obj.nasaImageId}
            </p>
          </div>
        </div>
      )}

      {/* Technical Overview Description */}
      <div className="mb-2.5">
        <p className="text-[9px] font-bold uppercase tracking-wider text-regolith-400">
          Technical Overview
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-regolith-200">{obj.description}</p>
      </div>

      {/* Science discovery */}
      {obj.scienceDiscovery && (
        <div
          className="mb-2.5 rounded-lg border px-2.5 py-1.5"
          style={{ borderColor: theme.border, background: theme.primaryDim }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
            Science Discovery & Data Yield
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-regolith-200">
            {obj.scienceDiscovery}
          </p>
        </div>
      )}

      {/* Historical Legacy */}
      {obj.legacy && (
        <div className="mb-2.5 rounded-lg border border-space-700/30 bg-space-800/40 px-2.5 py-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-regolith-400/80">
            Historical Significance
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-regolith-300">{obj.legacy}</p>
        </div>
      )}

      {/* Mission Deployment Timestamps */}
      {(obj.yearDeployed || obj.yearLastContact) && (
        <div className="mb-2 flex flex-wrap gap-4 rounded-lg bg-space-900/60 p-2 text-xs text-regolith-300 border border-space-800">
          {obj.yearDeployed && (
            <div>
              <span className="text-[9px] block text-regolith-500 uppercase font-mono">Deployed</span>
              <span className="font-bold text-regolith-200 font-mono">{obj.yearDeployed}</span>
            </div>
          )}
          {obj.yearLastContact && (
            <div>
              <span className="text-[9px] block text-regolith-500 uppercase font-mono">Last Contact</span>
              <span className="font-bold text-regolith-200 font-mono">{obj.yearLastContact}</span>
            </div>
          )}
        </div>
      )}

      {/* XP badge + NSSDCA Link */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-space-800/80 pt-2 shrink-0">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: "rgba(255,107,44,0.15)", color: "#FF6B2C" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L8.8 5.2L13.3 5.6L9.9 8.6L10.9 13L7 10.7L3.1 13L4.1 8.6L0.7 5.6L5.2 5.2L7 1Z"
              fill="#FF6B2C"
            />
          </svg>
          +{obj.xp ?? 50} XP DISCOVERED
        </span>

        {nssdcEntry ? (
          <a
            href={nssdcEntry.catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
          >
            <span>NSSDCA #{nssdcEntry.nssdcaId}</span>
            <span>↗</span>
          </a>
        ) : (
          <span className="text-[10px] font-mono text-regolith-500">Source: NASA History Office</span>
        )}
      </div>
    </div>
  );
}
