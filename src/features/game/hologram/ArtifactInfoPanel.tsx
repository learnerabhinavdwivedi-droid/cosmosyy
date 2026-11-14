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
  const [activeTab, setActiveTab] = useState<"intel" | "specs">("intel");
  const [imgError, setImgError] = useState(false);
  const nssdcEntry = getNssdcCatalog(missionId, obj.id);
  const localImgUrl = `/images/heritage/${missionId}/${obj.id}.jpg`;
  const fallbackNasaUrl = obj.nasaImageId
    ? `https://images-assets.nasa.gov/image/${obj.nasaImageId}/${obj.nasaImageId}~thumb.jpg`
    : null;
  const displayImgUrl = !imgError ? localImgUrl : fallbackNasaUrl;

  const isOperational = obj.status === "operational";
  const isDormant = obj.status === "dormant";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* 1. Header: Mission Location Breadcrumb & Artifact Title */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-regolith-400">
            {missionName} · {missionSite}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
              isOperational
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : isDormant
                ? "bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                : "bg-space-850 text-regolith-400 border-space-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOperational
                  ? "bg-emerald-400 animate-pulse"
                  : isDormant
                  ? "bg-amber-400"
                  : "bg-regolith-500"
              }`}
            />
            <span>
              {isOperational
                ? "Active Telemetry"
                : isDormant
                ? "Dormant Sensor"
                : "Defunct Structure"}
            </span>
          </span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
          {obj.name}
        </h2>
      </div>

      {/* 2. Glanceable 4-Metric Telemetry Strip */}
      <div className="shrink-0 grid grid-cols-4 gap-2 mb-3 rounded-lg border border-space-800/80 bg-space-900/60 p-2 text-center backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase tracking-wider text-regolith-500">
            Deployed
          </span>
          <span className="text-xs font-mono font-bold text-regolith-200">
            {obj.yearDeployed || "—"}
          </span>
        </div>
        <div className="flex flex-col border-l border-space-800">
          <span className="text-[9px] font-mono uppercase tracking-wider text-regolith-500">
            Status
          </span>
          <span
            className="text-xs font-mono font-bold truncate px-1"
            style={{ color: theme.primary }}
          >
            {isOperational ? "Active" : isDormant ? "Dormant" : "Defunct"}
          </span>
        </div>
        <div className="flex flex-col border-l border-space-800">
          <span className="text-[9px] font-mono uppercase tracking-wider text-regolith-500">
            Catalog ID
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 truncate px-1">
            {nssdcEntry ? `#${nssdcEntry.nssdcaId}` : "NASA"}
          </span>
        </div>
        <div className="flex flex-col border-l border-space-800">
          <span className="text-[9px] font-mono uppercase tracking-wider text-regolith-500">
            Discovery
          </span>
          <span className="text-xs font-mono font-bold text-signal">
            +{obj.xp || 50} XP
          </span>
        </div>
      </div>

      {/* 3. Segmented Navigation Tabs */}
      <div className="shrink-0 flex items-center gap-1 border-b border-space-800/80 pb-2 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab("intel")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-semibold transition cursor-pointer ${
            activeTab === "intel"
              ? "border text-white shadow-sm"
              : "text-regolith-400 hover:text-regolith-200"
          }`}
          style={{
            borderColor: activeTab === "intel" ? theme.primary : "transparent",
            background: activeTab === "intel" ? theme.primaryDim : "transparent",
            color: activeTab === "intel" ? theme.primary : undefined,
          }}
        >
          <span>✦</span>
          <span>Intel Briefing</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-semibold transition cursor-pointer ${
            activeTab === "specs"
              ? "border text-white shadow-sm"
              : "text-regolith-400 hover:text-regolith-200"
          }`}
          style={{
            borderColor: activeTab === "specs" ? theme.primary : "transparent",
            background: activeTab === "specs" ? theme.primaryDim : "transparent",
            color: activeTab === "specs" ? theme.primary : undefined,
          }}
        >
          <span>⚙</span>
          <span>Technical Specs</span>
        </button>
      </div>

      {/* 4. Structured Scrollable Body */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
        {activeTab === "intel" ? (
          <>
            {/* Core Overview Summary */}
            <div className="text-xs sm:text-sm leading-relaxed text-regolith-200">
              {obj.description}
            </div>

            {/* Hero Key Science Discovery Callout */}
            {obj.scienceDiscovery && (
              <div
                className="rounded-lg border p-3 backdrop-blur-sm"
                style={{
                  borderColor: theme.border,
                  background: theme.primaryDim,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">🔬</span>
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider"
                    style={{ color: theme.primary }}
                  >
                    Key Science Discovery
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-regolith-100 font-medium">
                  {obj.scienceDiscovery}
                </p>
              </div>
            )}

            {/* Optional Authentic NASA Imagery */}
            {displayImgUrl && (
              <div
                className="relative overflow-hidden rounded-lg border shrink-0 mt-1"
                style={{ borderColor: theme.border }}
              >
                <img
                  src={displayImgUrl}
                  alt={obj.name}
                  className="h-28 w-full object-cover"
                  onError={() => {
                    if (!imgError) {
                      setImgError(true);
                    }
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2.5 py-1">
                  <p className="text-[9px] font-mono text-regolith-300">
                    NASA Photographic Archive // {obj.name}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Technical Designation Card */}
            {nssdcEntry && (
              <div className="rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-3">
                <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  NASA Master Catalog Designation
                </p>
                <p className="mt-0.5 text-xs font-bold text-cyan-100">
                  {nssdcEntry.officialDesignation}
                </p>
                <p className="mt-0.5 text-[10px] font-mono text-cyan-300/80">
                  NSSDC ID: {nssdcEntry.nssdcaId}
                </p>
              </div>
            )}

            {/* Historical Legacy / Significance */}
            {obj.legacy && (
              <div className="rounded-lg border border-space-800 bg-space-900/50 p-3">
                <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-regolith-400">
                  Mission Legacy & Fate
                </p>
                <p className="mt-1 text-xs leading-relaxed text-regolith-300">
                  {obj.legacy}
                </p>
              </div>
            )}

            {/* Mission Data Timeline */}
            <div className="rounded-lg border border-space-800 bg-space-900/50 p-3 flex flex-col gap-2">
              <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-regolith-400">
                Telemetry Log
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-regolith-500 block text-[10px]">
                    SURFACE DEPLOYMENT
                  </span>
                  <span className="text-regolith-200">
                    {obj.yearDeployed ? `${obj.yearDeployed} UTC` : "Recorded"}
                  </span>
                </div>
                <div>
                  <span className="text-regolith-500 block text-[10px]">
                    LAST ACTIVE CONTACT
                  </span>
                  <span className="text-regolith-200">
                    {obj.yearLastContact
                      ? `${obj.yearLastContact} UTC`
                      : isOperational
                      ? "Ongoing (Operational)"
                      : "Mission Close"}
                  </span>
                </div>
              </div>
            </div>

            {/* NASA External Archive Button */}
            {nssdcEntry && (
              <a
                href={`https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${nssdcEntry.nssdcaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-between rounded-lg border border-space-700 bg-space-850 px-3 py-2 text-xs font-mono font-semibold text-cyan-300 transition hover:bg-space-800 hover:text-cyan-200 cursor-pointer"
              >
                <span>View NASA Master Catalog Archive</span>
                <span>↗</span>
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
