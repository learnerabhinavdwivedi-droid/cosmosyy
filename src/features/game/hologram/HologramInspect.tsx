import { useState, useMemo, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { getHologramModel, type HologramManifest } from "../hologramMapping";
import { getObjectTheme } from "../objectThemes";
import { HoloCanvas } from "./HoloCanvas";
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
  const [showStory, setShowStory] = useState(false);

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

  if (!obj) return null;

  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background dark overlay */}
      <div className="absolute inset-0 bg-space-950/85 backdrop-blur-md" />

      {/* Two-panel layout */}
      <div className="relative z-10 flex h-full flex-col md:flex-row items-stretch gap-3 md:gap-4 p-3 md:p-5 pt-12 md:pt-12 pb-3 md:pb-4 overflow-y-auto md:overflow-hidden">
        {/* LEFT PANEL — 3D Studio & Audio Transmission Deck */}
        <div className="flex w-full md:w-[48%] flex-col min-h-[340px] md:min-h-0">
          <div
            className="relative flex-1 overflow-hidden rounded-xl border flex flex-col"
            style={{ borderColor: theme.border, background: "rgba(7,9,13,0.7)" }}
          >
            <div className="relative flex-1">
              <HoloCanvas
                missionId={missionId}
                objectId={obj.id}
                modelUrl={modelEntry ? modelEntry.modelPath : ""}
                explode={explode}
                wireframe={wireframe}
                theme={theme}
                manifest={manifest}
              />
            </div>

            {/* Category badge, wireframe toggle & 3D story launcher */}
            <div className="absolute left-3 top-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
              <span
                className="rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ background: theme.primaryDim, color: theme.primary }}
              >
                {theme.category}
              </span>
              <div className="flex items-center gap-1.5">
                {hasStory && storyPacket && (
                  <button
                    type="button"
                    onClick={() => setShowStory(true)}
                    className="flex items-center gap-1 rounded border border-sky-400/80 bg-sky-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300 transition hover:bg-sky-500/30 cursor-pointer shadow-sm animate-pulse min-h-[28px]"
                  >
                    <span>🎬</span>
                    <span>3D Story</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setWireframe((v) => !v)}
                  className="rounded border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition hover:bg-space-800 cursor-pointer min-h-[28px]"
                  style={{ borderColor: theme.border, color: theme.primary, background: theme.primaryDim }}
                >
                  {wireframe ? "Mode: X-Ray Wireframe" : "Mode: Blender PBR"}
                </button>
              </div>
            </div>

            {/* Exploded subsystem controls */}
            <ExplodeController
              missionId={missionId}
              objectId={obj.id}
              explode={explode}
              setExplode={setExplode}
              manifest={manifest}
              theme={theme}
            />
          </div>

          {/* Dormant Voice Log & 20-bar Audio Waveform Equalizer */}
          <AudioTransmissionDeck
            missionId={missionId}
            objectId={obj.id}
            objectName={obj.name}
            firstPersonLog={obj.firstPerson}
            theme={theme}
          />
        </div>

        {/* RIGHT PANEL — Artifact Info & Mission Compartment Drawer */}
        <div className="flex w-full md:w-[52%] flex-col min-h-0">
          <div
            className="flex-1 flex flex-col overflow-hidden rounded-xl border p-4 backdrop-blur-md"
            style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
          >
            {/* Scrollable Information Body */}
            <ArtifactInfoPanel
              obj={obj}
              missionId={missionId}
              missionName={mission.name}
              missionSite={mission.site}
              theme={theme}
            />

            {/* Compartmentalized Mission Artifact Drawer */}
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

      {/* Top right close button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-space-700 bg-space-900/80 text-regolith-300 backdrop-blur transition hover:border-space-500 hover:text-white active:scale-95 cursor-pointer"
        aria-label="Close telemetry inspection"
      >
        ✕
      </button>

      {/* 3D Object Story Card Modal */}
      {showStory && storyPacket && (
        <ObjectStoryCard packet={storyPacket} onClose={() => setShowStory(false)} />
      )}
    </div>
  );
}
