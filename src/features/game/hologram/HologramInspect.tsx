import { useState, useMemo, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { getHologramModel, type HologramManifest } from "../hologramMapping";
import { getObjectTheme } from "../objectThemes";
import { HoloCanvas, type LightingMode } from "./HoloCanvas";
import { AudioTransmissionDeck } from "./AudioTransmissionDeck";
import { ArtifactInfoPanel } from "./ArtifactInfoPanel";
import { ExplodeController } from "./ExplodeController";
import { MissionCompartmentDrawer } from "./MissionCompartmentDrawer";
import { hasStoryPacket, getStoryPacket, ObjectStoryCard } from "@/features/story";

interface HologramInspectProps {
  objects: HeritageObject[];
  missionId: string;
  isMars?: boolean;
}

export function HologramInspect({ objects, missionId }: HologramInspectProps) {
  const send = useGameStore((s) => s.send);
  const found = useGameStore((s) => s.objectsFoundThisRun);

  const [visible, setVisible] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [explode, setExplode] = useState(0);
  const [manifest, setManifest] = useState<HologramManifest | null>(null);
  const [showStory, setShowStory] = useState(true);
  const [showIntel, setShowIntel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState<LightingMode>("studio");
  const [resetTrigger, setResetTrigger] = useState(0);

  const mission = useMemo(() => getMission(missionId), [missionId]);

  // Initial index matches the inspected object if available
  const [activeIdx, setActiveIdx] = useState(() => {
    const inspectId = useGameStore.getState().inspecting.objectId;
    const idx = objects.findIndex((o) => o.id === inspectId);
    return idx >= 0 ? idx : 0;
  });

  const obj = objects[activeIdx] || objects[0];
  const modelEntry = useMemo(
    () => (obj ? getHologramModel(missionId, obj.id) : null),
    [missionId, obj],
  );

  const hasStory = useMemo(() => (obj ? hasStoryPacket(missionId, obj.id) : false), [missionId, obj]);
  const storyPacket = useMemo(() => (hasStory && obj ? getStoryPacket(missionId, obj.id) : null), [hasStory, missionId, obj]);

  useEffect(() => {
    if (!modelEntry) {
      setManifest(null);
      return;
    }
    fetch(modelEntry.manifestPath)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setManifest(data))
      .catch(() => setManifest(null));
  }, [modelEntry]);

  const theme = useMemo(
    () => (obj ? getObjectTheme(obj.id) : getObjectTheme("default")),
    [obj],
  );

  // Smooth entrance fade
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Global key listener for 'T' (3D Story) and 'Esc'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.code === "KeyT" || e.key === "t" || e.key === "T") && !e.repeat) {
        if (hasStory && storyPacket) {
          setShowStory((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStory, storyPacket]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      send("EXIT_INSPECT");
    }, 400);
  };

  const handleSelectIndex = (idx: number) => {
    setActiveIdx(idx);
    setExplode(0);
  };

  const cycleLighting = () => {
    setLightingMode((prev) => {
      if (prev === "studio") return "solar";
      if (prev === "solar") return "deep-space";
      return "studio";
    });
  };

  if (!obj) return null;

  // Primary Experience: 3D Animated Cinematic Story Movie
  if (showStory && storyPacket) {
    return (
      <ObjectStoryCard
        packet={storyPacket}
        onClose={handleClose}
        onSwitchToInspect={() => setShowStory(false)}
        autoPlay={true}
      />
    );
  }

  const isOperational = obj.status === "operational";
  const isDormant = obj.status === "dormant";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 select-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background dark radial vignette overlay */}
      <div className="absolute inset-0 bg-space-950/90 backdrop-blur-md" />

      {/* FULLSCREEN 3D SHOWCASE VIEWPORT */}
      <div className="absolute inset-0 z-0">
        <HoloCanvas
          missionId={missionId}
          objectId={obj.id}
          modelUrl={modelEntry ? modelEntry.modelPath : ""}
          explode={explode}
          wireframe={wireframe}
          theme={theme}
          autoRotate={autoRotate}
          lightingMode={lightingMode}
          resetTrigger={resetTrigger}
          manifest={manifest}
        />
      </div>

      {/* FLOATING AEROSPACE HUD OVERLAYS */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5">
        {/* TOP FLOATING HEADER HUD */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pointer-events-auto">
          {/* Left: Mission Location Breadcrumb & Artifact Title */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-regolith-400">
                {mission.name} · {mission.site}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                  isOperational
                    ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                    : isDormant
                    ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
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
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                {obj.name}
              </h1>
              <span className="rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 text-[9px] font-mono font-bold text-signal">
                +{obj.xp || 50} XP
              </span>
            </div>
          </div>

          {/* Right: Floating Visual & Mode Controls */}
          <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
            {/* 3D Cinematic Story Button */}
            {hasStory && storyPacket && (
              <button
                type="button"
                onClick={() => setShowStory(true)}
                className="flex items-center gap-1.5 rounded-full border border-sky-400 bg-gradient-to-r from-sky-500/30 to-blue-600/30 px-3.5 py-1 text-[11px] font-mono font-black uppercase tracking-wider text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.5)] transition hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md animate-pulse min-h-[30px]"
                title="Watch Cinematic 3D Story [Key T]"
              >
                <span>🎬</span>
                <span>Watch 3D Story</span>
                <span className="rounded bg-sky-400/30 px-1 py-0.5 text-[9px] text-sky-100 font-mono">[T]</span>
              </button>
            )}

            {/* PBR Realistic vs X-Ray Wireframe Mode Toggle */}
            <button
              type="button"
              onClick={() => setWireframe((v) => !v)}
              className="rounded-lg border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition hover:bg-space-800/80 cursor-pointer shadow-md min-h-[30px] backdrop-blur-md"
              style={{
                borderColor: theme.border,
                color: theme.primary,
                background: theme.primaryDim,
              }}
            >
              {wireframe ? "Mode: X-Ray Wireframe" : "Mode: Blender PBR"}
            </button>

            {/* 360° Auto-Orbit Toggle Button */}
            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-md min-h-[30px] backdrop-blur-md ${
                autoRotate
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                  : "border-space-700 bg-space-900/60 text-regolith-400 hover:text-white"
              }`}
            >
              <span>{autoRotate ? "Orbit: ON" : "Orbit: PAUSED"}</span>
            </button>

            {/* Studio / Solar / Deep-Space Lighting Switcher */}
            <button
              type="button"
              onClick={cycleLighting}
              className="rounded-lg border border-space-700 bg-space-900/70 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-regolith-300 transition hover:bg-space-800 hover:text-white cursor-pointer shadow-md min-h-[30px] backdrop-blur-md"
            >
              <span>
                💡 Light:{" "}
                {lightingMode === "studio"
                  ? "Studio"
                  : lightingMode === "solar"
                  ? "Solar"
                  : "Deep Space"}
              </span>
            </button>

            {/* Reset Camera to Hero View */}
            <button
              type="button"
              onClick={() => setResetTrigger((n) => n + 1)}
              className="rounded-lg border border-space-700 bg-space-900/70 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-regolith-300 transition hover:bg-space-800 hover:text-white cursor-pointer shadow-md min-h-[30px] backdrop-blur-md"
              title="Reset camera framing"
            >
              <span>⌖ Reset</span>
            </button>

            {/* On-Demand Intel & Technical Specs Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowIntel((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-md min-h-[30px] backdrop-blur-md ${
                showIntel
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40"
              }`}
            >
              <span>✦</span>
              <span>{showIntel ? "Close Intel" : "Intel & Specs"}</span>
            </button>

            {/* Primary Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-space-700 bg-space-900/80 text-regolith-300 backdrop-blur transition hover:border-space-500 hover:text-white active:scale-95 cursor-pointer shadow-md"
              aria-label="Close telemetry inspection"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BOTTOM FLOATING DOCK (Audio Transmission, Explode & Artifact Switcher) */}
        <div className="flex flex-col gap-2 pointer-events-auto max-w-5xl w-full mx-auto pb-1 sm:pb-3">
          {/* Subsystem Explode Controller (Centered Glass Pill) */}
          <div className="self-center">
            <ExplodeController
              missionId={missionId}
              objectId={obj.id}
              explode={explode}
              setExplode={setExplode}
              manifest={manifest}
              theme={theme}
            />
          </div>

          {/* Lower Bar: In-Helmet Audio Transmission & Mission Artifact Drawer */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-2.5">
            {/* Audio Transmission Deck */}
            <AudioTransmissionDeck
              missionId={missionId}
              objectId={obj.id}
              objectName={obj.name}
              firstPersonLog={obj.firstPerson}
              theme={theme}
              hasStory={hasStory}
              onOpenStory={() => setShowStory(true)}
            />

            {/* Mission Artifact Compartment Drawer */}
            <MissionCompartmentDrawer
              missionId={missionId}
              missionName={mission.name}
              objects={objects}
              activeIdx={activeIdx}
              onSelectIndex={handleSelectIndex}
              foundObjectIds={found}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* SLIDE-OVER INTEL & SPECIFICATIONS DRAWER (Only opens on-demand when requested!) */}
      {showIntel && (
        <div className="fixed inset-y-0 right-0 z-30 w-full sm:w-[420px] md:w-[460px] bg-space-950/95 backdrop-blur-2xl border-l border-space-700/80 shadow-2xl p-4 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Drawer Header with Title and Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-space-800/80 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">✦</span>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-regolith-200">
                Artifact Telemetry & Specs
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowIntel(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-space-700 bg-space-900/80 text-regolith-400 hover:text-white transition cursor-pointer"
              aria-label="Close intel drawer"
            >
              ✕
            </button>
          </div>

          {/* Structured Information Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ArtifactInfoPanel
              obj={obj}
              missionId={missionId}
              missionName={mission.name}
              missionSite={mission.site}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
}
