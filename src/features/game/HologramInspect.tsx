import { useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useGameStore } from "@/store/useGameStore";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { isTouchDevice } from "@/lib/useMobile";
import { Howl } from "howler";
import { gameAudio } from "@/lib/gameAudio";
import { stopNarration } from "@/lib/narration";
import { getNssdcCatalog } from "@/lib/nssdcaCatalog";
import {
  getHologramModel,
  getDisplayComponents,
  type HologramManifest,
} from "./hologramMapping";
import {
  hasDedicated3DModel,
  HeritageObject3D,
  getDedicatedComponents,
} from "./heritage3D/Heritage3DDispatcher";
import { getObjectTheme, type ObjectTheme } from "./objectThemes";
import * as THREE from "three";

/* ─── Studio 3D Model with Blender PBR Finish ─── */
function HoloModel({
  url,
  explode,
  wireframe,
  manifest,
}: {
  url: string;
  explode: number;
  wireframe?: boolean;
  themeColor?: string;
  manifest?: HologramManifest | null;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Preserve authentic Blender PBR textures, metallics, and foils
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.userData.origMaterial) {
          mesh.userData.origMaterial = mesh.material;
        }

        if (wireframe) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#44eeff"),
            emissive: new THREE.Color("#0088cc"),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.45,
            wireframe: true,
            side: THREE.DoubleSide,
          });
        } else {
          // Restore authentic original Blender PBR materials & textures!
          mesh.material = mesh.userData.origMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }, [clonedScene, wireframe]);

  // Exploded view animation / subsystem offset
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || child.type === "Group") {
        if (!child.userData.origPos) {
          child.userData.origPos = child.position.clone();
        }
        if (manifest?.components && manifest.components.length > 0) {
          const lowerName = child.name.toLowerCase();
          const comp = manifest.components.find((c) => {
            const cName = c.name.toLowerCase();
            return lowerName === cName || lowerName.includes(cName) || cName.includes(lowerName);
          });
          if (comp && comp.explode_vector) {
            const factor = explode * 1.5;
            child.position.set(
              child.userData.origPos.x + comp.explode_vector[0] * factor,
              child.userData.origPos.y + comp.explode_vector[1] * factor,
              child.userData.origPos.z + comp.explode_vector[2] * factor,
            );
            return;
          }
        }
        child.position.copy(child.userData.origPos);
      }
    });
  }, [clonedScene, manifest, explode]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  const box = useMemo(() => {
    const b = new THREE.Box3().setFromObject(clonedScene);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 1.15;
    const scale = targetSize / (maxDim || 1);
    return { center, scale };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <group
        scale={[box.scale, box.scale, box.scale]}
        position={[
          -box.center.x * box.scale,
          -box.center.y * box.scale,
          -box.center.z * box.scale,
        ]}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/* ─── Blender Studio 3-Point Lighting Setup ─── */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.8} color="#ffffff" />
      {/* Key light — warm sunlight casting specular highlights */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.6}
        color="#fffbf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill light — soft diffused sky fill from opposite side */}
      <directionalLight position={[-6, 3, -4]} intensity={1.2} color="#a0b8d8" />
      {/* Rim / Kicker backlight — crisp edge silhouette separation */}
      <directionalLight position={[0, 5, -7]} intensity={2.8} color="#d4e8ff" />
      {/* Bottom bounce light from surface */}
      <pointLight position={[0, -2.5, 0]} intensity={0.7} color="#ffffff" />
    </>
  );
}

/* ─── Studio Pedestal Contact Shadow ─── */
function ContactShadow() {
  return (
    <group position={[0, -0.68, 0]}>
      {/* Dark radial contact shadow on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} depthWrite={false} />
      </mesh>
      {/* Outer soft shadow feather */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* Studio turntable ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.35, 1.38, 64]} />
        <meshBasicMaterial color="#3a404c" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Camera auto-fit ─── */
function AutoCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2.4, 1.4, 2.4);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

/* ─── Dedicated Procedural 3D Model with Blender Finish ─── */
function DedicatedHoloModel({
  missionId,
  objectId,
  explode,
  wireframe,
}: {
  missionId: string;
  objectId: string;
  explode: number;
  wireframe?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const centeredRef = useRef(false);

  useEffect(() => {
    centeredRef.current = false;
  }, [missionId, objectId]);

  useLayoutEffect(() => {
    if (!contentRef.current || !pivotRef.current) return;
    contentRef.current.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(contentRef.current);
    if (!box.isEmpty()) {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0.05) {
        const targetSize = 1.15;
        const s = targetSize / maxDim;
        pivotRef.current.scale.set(s, s, s);
        pivotRef.current.position.set(-center.x * s, -center.y * s, -center.z * s);
        centeredRef.current = true;
      }
    }
  }, [missionId, objectId]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
    if (!centeredRef.current && contentRef.current && pivotRef.current) {
      contentRef.current.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(contentRef.current);
      if (!box.isEmpty()) {
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0.05) {
          const targetSize = 1.15;
          const s = targetSize / maxDim;
          pivotRef.current.scale.set(s, s, s);
          pivotRef.current.position.set(-center.x * s, -center.y * s, -center.z * s);
          centeredRef.current = true;
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={pivotRef}>
        <group ref={contentRef}>
          <HeritageObject3D
            missionId={missionId}
            objectId={objectId}
            wireframe={wireframe}
            explode={explode}
            scale={1.0}
          />
        </group>
      </group>
    </group>
  );
}

/* ─── 3D Viewer canvas with Blender Finish ─── */
function HoloCanvas({
  missionId,
  objectId,
  modelUrl,
  explode,
  wireframe,
  theme,
  manifest,
}: {
  missionId: string;
  objectId: string;
  modelUrl: string;
  explode: number;
  wireframe?: boolean;
  theme: ObjectTheme;
  manifest?: HologramManifest | null;
}) {
  const isDedicated = hasDedicated3DModel(missionId, objectId);

  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 36, near: 0.1, far: 100, position: [2.4, 1.4, 2.4] }}
      style={{ background: "transparent" }}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        {isDedicated ? (
          <DedicatedHoloModel
            missionId={missionId}
            objectId={objectId}
            explode={explode}
            wireframe={wireframe}
          />
        ) : (
          <HoloModel
            url={modelUrl}
            explode={explode}
            wireframe={wireframe}
            themeColor={theme.primary}
            manifest={manifest}
          />
        )}
      </Suspense>
      <ContactShadow />
      <AutoCamera />
      <OrbitControls
        enableZoom={true}
        minDistance={1.4}
        maxDistance={5.5}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.95}
      />
    </Canvas>
  );
}

/* ─── Component label list (left panel with GLB or Dedicated 3D) ─── */
function ComponentLabels({
  missionId,
  objectId,
  manifest,
  theme,
}: {
  missionId: string;
  objectId: string;
  manifest: HologramManifest | null;
  theme: ObjectTheme;
}) {
  const parts = useMemo(() => {
    if (hasDedicated3DModel(missionId, objectId)) {
      return getDedicatedComponents(missionId, objectId);
    }
    return manifest ? getDisplayComponents(manifest) : [];
  }, [missionId, objectId, manifest]);

  return (
    <div className="flex flex-col gap-2 py-2">
      {parts.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
            style={{ borderColor: theme.border, background: theme.primaryDim }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <p className="text-[11px] font-bold leading-tight" style={{ color: theme.primary }}>
            {p.displayName}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status?: "operational" | "dormant" | "defunct" }) {
  if (!status) return null;
  const cfg = {
    operational: { bg: "rgba(63,176,122,0.15)", text: "#3FB07A", dot: "#3FB07A", label: "Operational" },
    dormant: { bg: "rgba(251,191,36,0.15)", text: "#FBBF24", dot: "#FBBF24", label: "Dormant" },
    defunct: { bg: "rgba(154,150,140,0.15)", text: "#9A968C", dot: "#9A968C", label: "Defunct" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${status === "operational" ? "animate-pulse" : ""}`}
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}


function formatSeconds(sec: number): string {
  if (!sec || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ─── Audio Transmission Visualizer & Controller ─── */
function AudioTransmissionDeck({
  isPlaying,
  currentTime,
  duration,
  progress,
  onTogglePlay,
  onRestart,
  onSeek,
  theme,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSeek: (pct: number) => void;
  theme: ObjectTheme;
}) {
  const barHeights = [28, 65, 42, 88, 55, 96, 72, 38, 82, 58, 92, 48, 70, 34, 84, 46];

  return (
    <div
      className="mb-4 rounded-xl border p-3 backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: isPlaying ? theme.primary : theme.border,
        background: "rgba(10, 14, 22, 0.88)",
        boxShadow: isPlaying ? `0 0 24px ${theme.primaryDim}` : "none",
      }}
    >
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{ background: isPlaying ? theme.primary : "#71717a" }}
          />
          <span className="font-bold tracking-wider uppercase" style={{ color: theme.primary }}>
            {isPlaying ? "Transmitting Machine Voice" : "Deep Space Voice Log Ready"}
          </span>
        </div>
        <span className="text-regolith-400 font-mono">
          {formatSeconds(currentTime)} / {formatSeconds(duration)}
        </span>
      </div>

      {/* Waveform Equalizer Display */}
      <div className="my-2.5 flex h-7 items-end justify-between gap-1 px-1">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-full rounded-t-sm transition-all duration-150 ${
              isPlaying ? "animate-wave-bar" : ""
            }`}
            style={{
              height: isPlaying ? `${h}%` : "16%",
              background: isPlaying ? theme.primary : "rgba(255,255,255,0.18)",
              animationDelay: `${(i % 6) * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Scrubber track */}
      <div
        className="relative mb-2.5 h-1.5 w-full cursor-pointer rounded-full bg-space-800 overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, clickX / rect.width));
          onSeek(pct);
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${progress * 100}%`, background: theme.primary }}
        />
      </div>

      {/* Play/Pause & Restart controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition hover:brightness-125 active:scale-95"
            style={{
              borderColor: theme.primary,
              background: theme.primaryDim,
              color: theme.primary,
            }}
          >
            {isPlaying ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Play Machine Voice</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1 rounded-lg border border-space-700 bg-space-800/80 px-2.5 py-1.5 text-xs text-regolith-300 transition hover:bg-space-700 active:scale-95"
            title="Restart transmission from beginning"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Restart</span>
          </button>
        </div>

        <span className="text-[9px] font-mono tracking-wider text-regolith-400 uppercase">
          128 KBPS DSN LINK
        </span>
      </div>
    </div>
  );
}

/* ─── Right info panel with Living Fable Mode & NASA Telemetry ─── */
function InfoPanel({
  obj,
  missionId,
  missionName,
  missionSite,
  missionDate,
  crew,
  isMars,
  theme,
  isPlaying,
  duration,
  currentTime,
  progress,
  onTogglePlay,
  onRestartAudio,
  onSeekAudio,
}: {
  obj: HeritageObject;
  missionId: string;
  missionName: string;
  missionSite: string;
  missionDate: string;
  crew: { commander: string; lmp: string; cmp: string };
  isMars: boolean;
  theme: ObjectTheme;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number;
  onTogglePlay: () => void;
  onRestartAudio: () => void;
  onSeekAudio: (pct: number) => void;
}) {
  const [tab, setTab] = useState<"fable" | "telemetry">("fable");
  const [imgError, setImgError] = useState(false);
  const nssdcEntry = useMemo(() => getNssdcCatalog(missionId, obj.id), [missionId, obj.id]);

  useEffect(() => {
    setTab("fable");
    setImgError(false);
  }, [obj.id]);

  const nasaUrl = obj.nasaImageId
    ? `https://images-assets.nasa.gov/image/${obj.nasaImageId}/${obj.nasaImageId}~medium.jpg`
    : null;

  return (
    <div
      className="flex h-full flex-col overflow-y-auto rounded-xl border p-5 backdrop-blur-xl"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.94)" }}
    >
      {/* Category + status + NSSDCA quick pill */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ background: theme.primaryDim, color: theme.primary }}
          >
            {theme.category}
          </span>
          <StatusBadge status={obj.status} />
        </div>

        <a
          href={nssdcEntry.catalogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 transition hover:bg-cyan-950/60"
          style={{ borderColor: "rgba(6,182,212,0.4)", background: "rgba(6,182,212,0.12)" }}
          title="Open official record in NASA Space Science Data Coordinated Archive"
        >
          <span>NASA NSSDCA: {nssdcEntry.nssdcaId}</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Object name */}
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight" style={{ color: theme.primary }}>
        {obj.name}
      </h2>

      {/* Mission + Site + Date */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-regolith-400">
        <span className="flex items-center gap-1 font-medium">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {missionName}
        </span>
        <span className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {missionSite}
        </span>
        <span>{missionDate}</span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mt-4 grid grid-cols-2 gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setTab("fable")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold transition ${
            tab === "fable"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.25)]"
              : "bg-space-900/60 text-regolith-400 border border-space-800 hover:text-regolith-200 hover:bg-space-800/80"
          }`}
        >
          <span className="text-sm">📡</span>
          <span>Dormant Voice Log</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("telemetry")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold transition ${
            tab === "telemetry"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_16px_rgba(6,182,212,0.25)]"
              : "bg-space-900/60 text-regolith-400 border border-space-800 hover:text-regolith-200 hover:bg-space-800/80"
          }`}
        >
          <span className="text-sm">🔬</span>
          <span>NASA Technical Specs</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-3.5 h-px" style={{ background: theme.border }} />

      {/* TAB 1: THE DORMANT VOICE LOG (THE FABLE) */}
      {tab === "fable" && (
        <div className="flex flex-col">
          {/* Deep Space Audio Transmission Deck */}
          <AudioTransmissionDeck
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            onTogglePlay={onTogglePlay}
            onRestart={onRestartAudio}
            onSeek={onSeekAudio}
            theme={theme}
          />

          {/* The Machine's Personal Monologue */}
          {obj.firstPerson ? (
            <div
              className="relative mb-4 overflow-hidden rounded-xl border p-4 backdrop-blur-md"
              style={{
                borderColor: theme.border,
                background: "linear-gradient(145deg, rgba(16,22,34,0.95), rgba(7,9,13,0.98))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="mb-2 flex items-center justify-between border-b border-space-800/80 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📻</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-regolith-300">
                    Decoded Transmission // The Explorer's Words
                  </span>
                </div>
                <span
                  className="rounded px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider"
                  style={{ background: theme.primaryDim, color: theme.primary }}
                >
                  Authentic Log
                </span>
              </div>

              <blockquote className="relative mt-2.5 pl-3 border-l-2" style={{ borderColor: theme.primary }}>
                <p className="font-sans text-[13px] md:text-sm italic leading-relaxed text-regolith-100 font-medium">
                  &ldquo;{obj.firstPerson}&rdquo;
                </p>
              </blockquote>
            </div>
          ) : null}

          {/* Explorer's Story in 3 Chapters */}
          <div className="mb-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-regolith-300">
              <span>🧭</span>
              <span>The Journey in 3 Chapters</span>
            </div>

            {/* Chapter 1: Why Earth Built Me */}
            <div className="rounded-lg border border-space-800/80 bg-space-900/50 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <span>🚀</span>
                <span>Chapter 1: Why Earth Built Me</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-regolith-300">
                {obj.description}
              </p>
            </div>

            {/* Chapter 2: The Groundbreaking Discovery */}
            {obj.scienceDiscovery && (
              <div className="rounded-lg border border-space-800/80 bg-space-900/50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <span>💡</span>
                  <span>Chapter 2: The Breakthrough Discovery</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-regolith-200 font-medium">
                  {obj.scienceDiscovery}
                </p>
              </div>
            )}

            {/* Chapter 3: My Eternal Vigil */}
            {obj.legacy && (
              <div className="rounded-lg border border-space-800/80 bg-space-900/50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <span>🪐</span>
                  <span>Chapter 3: My Eternal Monument</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-regolith-300">
                  {obj.legacy}
                </p>
              </div>
            )}
          </div>

          {/* Did You Know? Field Note */}
          <div
            className="mb-4 rounded-xl border p-3.5 backdrop-blur-sm"
            style={{
              borderColor: "rgba(251, 191, 36, 0.35)",
              background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(15,20,30,0.9))",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">✨</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Did You Know? // Explorer Field Note
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-100/95 font-medium">
              {nssdcEntry.funFactKid}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL TELEMETRY & NASA ARCHIVE */}
      {tab === "telemetry" && (
        <div className="flex flex-col">
          {/* Official Designation Banner */}
          <div className="mb-3 rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-3">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              NASA Master Catalog Designation
            </p>
            <p className="mt-1 text-xs font-bold text-cyan-100">
              {nssdcEntry.officialDesignation}
            </p>
            <p className="mt-0.5 text-[10px] text-regolith-400">
              Archetype: {nssdcEntry.archetype} · Catalog ID: {nssdcEntry.nssdcaId}
            </p>
          </div>

          {/* NASA Image */}
          {nasaUrl && !imgError && (
            <div className="relative mb-3 overflow-hidden rounded-lg border" style={{ borderColor: theme.border }}>
              <img
                src={nasaUrl}
                alt={obj.name}
                className="h-44 w-full object-cover"
                onError={() => setImgError(true)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 py-1.5">
                <p className="text-[9px] font-mono text-regolith-300">NASA Image Archive // ID: {obj.nasaImageId}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-regolith-400">Technical Overview</p>
            <p className="mt-1 text-xs leading-relaxed text-regolith-200">{obj.description}</p>
          </div>

          {/* Science discovery */}
          {obj.scienceDiscovery && (
            <div className="mb-3 rounded-lg border px-3 py-2" style={{ borderColor: theme.border, background: theme.primaryDim }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Science Discovery & Data Yield
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-regolith-200">
                {obj.scienceDiscovery}
              </p>
            </div>
          )}

          {/* Legacy */}
          {obj.legacy && (
            <div className="mb-3 rounded-lg border border-space-700/30 bg-space-800/40 px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-regolith-400/80">Historical Significance</p>
              <p className="mt-1 text-[11px] leading-relaxed text-regolith-300">{obj.legacy}</p>
            </div>
          )}

          {/* Mission Deployment Timestamps */}
          {(obj.yearDeployed || obj.yearLastContact) && (
            <div className="mb-3 flex flex-wrap gap-4 rounded-lg bg-space-900/60 p-2.5 text-xs text-regolith-300 border border-space-800">
              {obj.yearDeployed && (
                <div>
                  <span className="text-[9px] block text-regolith-500 uppercase font-mono">Deployed</span>
                  <span className="font-bold text-regolith-200">{obj.yearDeployed}</span>
                </div>
              )}
              {obj.yearLastContact && (
                <div>
                  <span className="text-[9px] block text-regolith-500 uppercase font-mono">Last Contact</span>
                  <span className="font-bold text-amber-300">{obj.yearLastContact}</span>
                </div>
              )}
              {!isMars && crew && (
                <div>
                  <span className="text-[9px] block text-regolith-500 uppercase font-mono">Apollo Crew</span>
                  <span className="text-[11px] text-regolith-300">{crew.commander} · {crew.lmp}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom spacer to push XP down */}
      <div className="mt-auto" />

      {/* XP badge + Source + NSSDCA Link */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-space-800/80 pt-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "rgba(255,107,44,0.15)", color: "#FF6B2C" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <polygon points="7,1 8.8,5.2 13.4,5.5 9.9,8.5 11,13 7,10.6 3,13 4.1,8.5 0.6,5.5 5.2,5.2" fill="currentColor" />
          </svg>
          +{obj.xp} XP
        </span>

        {obj.source && (
          <span className="max-w-[60%] truncate text-[9px] text-regolith-500" title={obj.source}>
            {obj.source}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── EVA status bar ─── */
function EvaBar({ found, total, theme }: { found: number; total: number; theme: ObjectTheme }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  return (
    <div
      className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-lg border px-5 py-2"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
    >
      <span
        className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
        style={{ background: theme.primary, color: "#07090D" }}
      >
        EVA
      </span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-space-800">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: theme.primary }}
          />
        </div>
        <span className="text-xs text-regolith-200">
          {found}/{total}
        </span>
      </div>
    </div>
  );
}

/* ─── Object counter (top) ─── */
function ObjectCounter({ found, total, theme }: { found: number; total: number; theme: ObjectTheme }) {
  return (
    <div
      className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-lg border px-4 py-1.5"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
    >
      <span className="text-sm font-bold text-regolith-200">
        Objects: <span className="font-mono" style={{ color: theme.primary }}>{found}</span>
        <span className="text-regolith-500"> / {total}</span>
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT — HologramInspect
   ═══════════════════════════════════════════════════════ */
export function HologramInspect({
  objects,
  missionId,
  isMars,
}: {
  objects: HeritageObject[];
  missionId: string;
  isMars?: boolean;
}) {
  const objectId = useGameStore((s) => s.inspecting.objectId);
  const send = useGameStore((s) => s.send);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const obj = objects.find((o) => o.id === objectId);
  const mission = useMemo(() => getMission(missionId), [missionId]);
  const [visible, setVisible] = useState(false);
  const [manifest, setManifest] = useState<HologramManifest | null>(null);
  const [explode, setExplode] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const theme = useMemo(
    () => (objectId ? getObjectTheme(objectId) : getObjectTheme("")),
    [objectId],
  );

  const modelEntry = useMemo(
    () => (objectId ? getHologramModel(missionId, objectId) : null),
    [missionId, objectId],
  );

  useEffect(() => {
    setExplode(0);
    if (!modelEntry) { setManifest(null); return; }
    fetch(modelEntry.manifestPath)
      .then((r) => r.json())
      .then((data) => setManifest(data as HologramManifest))
      .catch(() => setManifest(null));
  }, [modelEntry]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") send("EXIT_INSPECT");
    };
    window.addEventListener("keydown", handler);
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => {
      window.removeEventListener("keydown", handler);
      cancelAnimationFrame(timer);
      setVisible(false);
    };
  }, [send]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!objectId) return;
    stopNarration();
    const src = `/audio/heritage/${missionId}/${objectId}.mp3`;
    const howl = new Howl({
      src: [src],
      volume: 0.9,
      onload: () => {
        setDuration(howl.duration() || 0);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(howl.duration() || 0);
        setProgress(1);
      },
      onloaderror: () => {
        setIsPlaying(false);
      },
    });
    howlRef.current = howl;
    if (isMars) {
      gameAudio.playDataScan();
    } else {
      gameAudio.playQuindar();
    }
    const playTimer = setTimeout(() => {
      howl.play();
    }, 350);

    const interval = setInterval(() => {
      if (howl && howl.playing()) {
        const cur = (howl.seek() as number) || 0;
        const dur = howl.duration() || 0;
        setCurrentTime(cur);
        if (dur > 0) {
          setProgress(cur / dur);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(playTimer);
      howl.fade(howl.volume(), 0, 300);
      setTimeout(() => howl.unload(), 400);
      howlRef.current = null;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [objectId, missionId, isMars]);

  const togglePlay = useCallback(() => {
    if (!howlRef.current) return;
    if (howlRef.current.playing()) {
      howlRef.current.pause();
    } else {
      if (progress >= 0.99) {
        howlRef.current.seek(0);
      }
      howlRef.current.play();
    }
  }, [progress]);

  const restartAudio = useCallback(() => {
    if (!howlRef.current) return;
    howlRef.current.seek(0);
    setCurrentTime(0);
    setProgress(0);
    howlRef.current.play();
  }, []);

  const seekAudio = useCallback((pct: number) => {
    if (!howlRef.current) return;
    const dur = howlRef.current.duration();
    if (dur > 0) {
      const target = pct * dur;
      howlRef.current.seek(target);
      setCurrentTime(target);
      setProgress(pct);
    }
  }, []);

  if (!obj) return null;

  const isDedicated = hasDedicated3DModel(missionId, obj.id);
  const has3D = isDedicated || !!modelEntry;
  const hasComponents = isDedicated || (!!manifest?.components && manifest.components.length > 0);

  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm" />

      {/* Object counter */}
      <ObjectCounter found={found.length} total={objects.length} theme={theme} />

      {/* Two-panel layout */}
      <div className="relative z-10 flex h-full flex-col md:flex-row items-stretch gap-4 p-4 pt-14 pb-16 overflow-y-auto md:overflow-hidden">
        {/* LEFT — 3D wireframe OR category blueprint */}
        <div className="flex w-full md:w-[45%] flex-col min-h-[340px] md:min-h-0">
          {has3D ? (
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

              {/* Category + wireframe toggle overlay */}
              <div className="absolute left-3 top-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
                <span
                  className="rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
                  style={{ background: theme.primaryDim, color: theme.primary }}
                >
                  {theme.category}
                </span>
                <button
                  type="button"
                  onClick={() => setWireframe((v) => !v)}
                  className="rounded border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition hover:bg-space-800"
                  style={{ borderColor: theme.border, color: theme.primary, background: theme.primaryDim }}
                >
                  {wireframe ? "Mode: X-Ray Wireframe" : "Mode: Blender PBR"}
                </button>
              </div>

              {/* Orbit controls hint */}
              {!hasComponents && (
                <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-space-950/70 px-2.5 py-1 text-[9px] font-mono text-regolith-300 backdrop-blur-sm border border-space-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Orbit 360° · Scroll to Zoom</span>
                </div>
              )}

              {/* Exploded view slider if components available */}
              {hasComponents && (
                <div
                  className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1 rounded-lg border p-2 backdrop-blur-md"
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
                  <div className="mt-1 max-h-16 overflow-y-auto">
                    <ComponentLabels
                      missionId={missionId}
                      objectId={obj.id}
                      manifest={manifest}
                      theme={theme}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative flex-1 overflow-hidden rounded-xl border flex flex-col items-center justify-center p-6 text-center"
              style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
            >
              <span
                className="inline-block rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ background: theme.primaryDim, color: theme.primary }}
              >
                {theme.category}
              </span>
              <p className="mt-3 text-base font-bold text-regolith-100">{obj.name}</p>
              {obj.yearDeployed && (
                <p className="mt-1 text-xs text-regolith-400">Deployed {obj.yearDeployed}</p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Info card */}
        <div className="flex w-full md:w-[55%] flex-col min-h-0">
          <InfoPanel
            obj={obj}
            missionId={missionId}
            missionName={mission.name}
            missionSite={mission.site}
            missionDate={mission.date}
            crew={mission.crew}
            isMars={!!isMars}
            theme={theme}
            isPlaying={isPlaying}
            duration={duration}
            currentTime={currentTime}
            progress={progress}
            onTogglePlay={togglePlay}
            onRestartAudio={restartAudio}
            onSeekAudio={seekAudio}
          />
        </div>
      </div>

      {/* EVA status bar */}
      <EvaBar found={found.length} total={objects.length} theme={theme} />

      {/* Close button */}
      <div className="absolute right-4 top-4 z-30">
        <button
          onClick={() => send("EXIT_INSPECT")}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold text-regolith-200 transition hover:bg-space-800"
          style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
        >
          {isTouchDevice() ? "CLOSE" : "[ESC]"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
