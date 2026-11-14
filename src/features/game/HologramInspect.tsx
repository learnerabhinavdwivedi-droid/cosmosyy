import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useGameStore } from "@/store/useGameStore";
import { getMission, type HeritageObject } from "@/lib/missionData";
import { isTouchDevice } from "@/lib/useMobile";
import { Howl } from "howler";
import { gameAudio } from "@/lib/gameAudio";
import { stopNarration } from "@/lib/narration";
import {
  getHologramModel,
  getDisplayComponents,
  type HologramManifest,
} from "./hologramMapping";
import * as THREE from "three";

const HOLO_CYAN = "#00D4FF";
const HOLO_CYAN_DIM = "rgba(0,212,255,0.15)";
const HOLO_BORDER = "rgba(0,212,255,0.35)";

/* ─── Holographic 3D model with auto-rotate + explode ─── */
function HoloModel({
  url,
  explode: _explode,
  wireframe,
}: {
  url: string;
  explode: number;
  wireframe?: boolean;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(HOLO_CYAN),
          emissive: new THREE.Color(HOLO_CYAN),
          emissiveIntensity: wireframe ? 0.6 : 0.3,
          transparent: true,
          opacity: wireframe ? 0.35 : 0.7,
          wireframe: !!wireframe,
          side: THREE.DoubleSide,
        });
      }
    });
  }, [clonedScene, wireframe]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const box = useMemo(() => {
    const b = new THREE.Box3().setFromObject(clonedScene);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / (maxDim || 1);
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

/* ─── Holographic ground rings ─── */
function HoloRings() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringsRef.current) return;
    ringsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={ringsRef} position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[1.0, 1.5, 2.0, 2.5].map((r, i) => (
        <mesh key={i}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshBasicMaterial
            color={HOLO_CYAN}
            transparent
            opacity={0.25 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh>
        <circleGeometry args={[0.8, 64]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ─── Scan line sweep ─── */
function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 1.5;
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <planeGeometry args={[4, 0.02]} />
      <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Camera auto-fit ─── */
function AutoCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

/* ─── 3D Viewer canvas (used for both exploded + assembled) ─── */
function HoloCanvas({
  modelUrl,
  wireframe,
  children,
}: {
  modelUrl: string;
  wireframe?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 40, near: 0.1, far: 100, position: [3, 2, 3] }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color={HOLO_CYAN} />
      <pointLight position={[0, -2, 0]} intensity={0.4} color={HOLO_CYAN} />
      <Suspense fallback={null}>
        <HoloModel url={modelUrl} explode={0} wireframe={wireframe} />
      </Suspense>
      <HoloRings />
      <ScanLine />
      <AutoCamera />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
      {children}
    </Canvas>
  );
}

/* ─── Component label list (left panel) ─── */
function ComponentLabels({ manifest }: { manifest: HologramManifest }) {
  const parts = useMemo(() => getDisplayComponents(manifest), [manifest]);

  return (
    <div className="flex flex-col gap-2.5 py-2">
      {parts.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 group">
          {/* Icon */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border"
            style={{ borderColor: HOLO_BORDER, background: HOLO_CYAN_DIM }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HOLO_CYAN} strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          {/* Label */}
          <div>
            <p className="text-xs font-bold text-[#00D4FF] leading-tight">
              {p.displayName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status?: "operational" | "dormant" | "defunct" }) {
  if (!status) return null;
  const cfg = {
    operational: { bg: "rgba(63,176,122,0.15)", text: "#3FB07A", dot: "#3FB07A", label: "Still Operational" },
    dormant: { bg: "rgba(251,191,36,0.15)", text: "#FBBF24", dot: "#FBBF24", label: "Dormant" },
    defunct: { bg: "rgba(154,150,140,0.15)", text: "#9A968C", dot: "#9A968C", label: "Defunct" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
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

/* ─── Right info panel ─── */
function InfoPanel({
  obj,
  missionName,
  missionSite,
  missionDate,
  crew,
  isMars,
}: {
  obj: HeritageObject;
  missionName: string;
  missionSite: string;
  missionDate: string;
  crew: { commander: string; lmp: string; cmp: string };
  isMars: boolean;
}) {
  return (
    <div
      className="h-full overflow-y-auto rounded-xl border p-5 backdrop-blur-xl"
      style={{
        borderColor: HOLO_BORDER,
        background: "rgba(7,9,13,0.92)",
      }}
    >
      {/* Mission header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold" style={{ color: HOLO_CYAN }}>
            {missionName}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-regolith-400">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {missionSite}
          </div>
        </div>
        <StatusBadge status={obj.status} />
      </div>

      {/* Tagline */}
      {obj.firstPerson && (
        <p className="mt-3 text-xs italic leading-relaxed text-regolith-300/80">
          &ldquo;{obj.firstPerson.split(".")[0]}.&rdquo;
        </p>
      )}

      {/* Date + Crew */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-regolith-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={HOLO_CYAN} strokeWidth="2" className="shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {missionDate}
        </div>
        {!isMars && (
          <div className="flex items-center gap-2 text-xs text-regolith-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={HOLO_CYAN} strokeWidth="2" className="shrink-0">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {crew.commander}, {crew.lmp}, {crew.cmp}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-4 h-px" style={{ background: HOLO_BORDER }} />

      {/* Object name + description */}
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HOLO_CYAN} strokeWidth="2" className="shrink-0">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
        <h3 className="font-display text-base font-bold text-regolith-100">
          {obj.name}
        </h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-regolith-300">
        {obj.description}
      </p>

      {/* Science discovery */}
      {obj.scienceDiscovery && (
        <div className="mt-3 rounded-lg border px-3 py-2" style={{ borderColor: HOLO_BORDER, background: HOLO_CYAN_DIM }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: HOLO_CYAN }}>
            Science Discovery
          </p>
          <p className="mt-1 text-xs leading-relaxed text-regolith-200">
            {obj.scienceDiscovery}
          </p>
        </div>
      )}

      {/* Legacy */}
      {obj.legacy && (
        <div className="mt-2 rounded-lg border border-space-700/30 bg-space-800/40 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-regolith-400/60">
            Legacy
          </p>
          <p className="mt-1 text-xs leading-relaxed text-regolith-300">
            {obj.legacy}
          </p>
        </div>
      )}

      {/* Year info */}
      {(obj.yearDeployed || obj.yearLastContact) && (
        <div className="mt-2 flex gap-3 text-[10px] text-regolith-400">
          {obj.yearDeployed && <span>Deployed {obj.yearDeployed}</span>}
          {obj.yearLastContact && <span>Last contact {obj.yearLastContact}</span>}
        </div>
      )}

      {/* XP badge */}
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "rgba(255,107,44,0.15)", color: "#FF6B2C" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <polygon points="7,1 8.8,5.2 13.4,5.5 9.9,8.5 11,13 7,10.6 3,13 4.1,8.5 0.6,5.5 5.2,5.2" fill="currentColor" />
          </svg>
          +{obj.xp} XP
        </span>
      </div>

      {/* Source */}
      {obj.source && (
        <div className="mt-3 rounded-lg border border-space-700/20 bg-space-800/30 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-regolith-400/50">
            Source
          </p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-regolith-400">
            {obj.source}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── EVA status bar ─── */
function EvaBar({ found, total }: { found: number; total: number }) {
  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-lg border px-5 py-2.5"
      style={{ borderColor: HOLO_BORDER, background: "rgba(7,9,13,0.85)" }}
    >
      <span
        className="rounded px-2 py-0.5 text-xs font-black uppercase tracking-wider"
        style={{ background: HOLO_CYAN, color: "#07090D" }}
      >
        EVA
      </span>
      <span className="text-sm text-regolith-200">
        {found} of {total} objects scanned. {found < total ? "Keep searching..." : "All found!"}
      </span>
    </div>
  );
}

/* ─── Object counter (top center) ─── */
function ObjectCounter({ found, total }: { found: number; total: number }) {
  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-lg border px-4 py-1.5"
      style={{ borderColor: HOLO_BORDER, background: "rgba(7,9,13,0.85)" }}
    >
      <span className="text-sm font-bold text-regolith-200">
        Objects: <span className="font-mono">{found} / {total}</span>
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
  const howlRef = useRef<Howl | null>(null);

  const modelEntry = useMemo(
    () => (objectId ? getHologramModel(missionId, objectId) : null),
    [missionId, objectId],
  );

  // Load manifest
  useEffect(() => {
    if (!modelEntry) { setManifest(null); return; }
    fetch(modelEntry.manifestPath)
      .then((r) => r.json())
      .then((data) => setManifest(data as HologramManifest))
      .catch(() => setManifest(null));
  }, [modelEntry]);

  // ESC handler + animation
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

  // Heritage narration audio
  useEffect(() => {
    if (!objectId) return;
    stopNarration();
    const src = `/audio/heritage/${missionId}/${objectId}.mp3`;
    const howl = new Howl({ src: [src], volume: 0.85 });
    howlRef.current = howl;
    if (isMars) {
      gameAudio.playDataScan();
    } else {
      gameAudio.playQuindar();
    }
    const playTimer = setTimeout(() => howl.play(), 350);
    return () => {
      clearTimeout(playTimer);
      howl.fade(howl.volume(), 0, 400);
      setTimeout(() => howl.unload(), 500);
      howlRef.current = null;
    };
  }, [objectId, missionId, isMars]);

  if (!obj) return null;

  const has3D = !!modelEntry;

  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm" />

      {/* Object counter */}
      <ObjectCounter found={found.length} total={objects.length} />

      {/* Three-panel layout */}
      <div className="relative z-10 flex h-full items-stretch gap-3 p-4 pt-14 pb-16">
        {has3D ? (
          <>
            {/* LEFT — Exploded view + component labels */}
            <div className="flex w-[38%] flex-col gap-3">
              <div
                className="relative flex-1 overflow-hidden rounded-xl border"
                style={{ borderColor: HOLO_BORDER, background: "rgba(7,9,13,0.7)" }}
              >
                <HoloCanvas modelUrl={modelEntry!.modelPath} wireframe />
                {/* Component labels overlay */}
                {manifest && (
                  <div className="absolute left-3 top-3 bottom-3 flex items-center">
                    <ComponentLabels manifest={manifest} />
                  </div>
                )}
              </div>
            </div>

            {/* CENTER — Assembled model with holo base */}
            <div className="flex w-[28%] flex-col gap-3">
              <div
                className="relative flex-1 overflow-hidden rounded-xl border"
                style={{ borderColor: HOLO_BORDER, background: "rgba(7,9,13,0.5)" }}
              >
                <HoloCanvas modelUrl={modelEntry!.modelPath} />
              </div>
            </div>

            {/* RIGHT — Info card */}
            <div className="flex w-[34%] flex-col">
              <InfoPanel
                obj={obj}
                missionName={mission.name}
                missionSite={mission.site}
                missionDate={mission.date}
                crew={mission.crew}
                isMars={!!isMars}
              />
            </div>
          </>
        ) : (
          <>
            {/* No 3D model — wider info panel centered */}
            <div className="flex w-full max-w-lg mx-auto flex-col">
              <InfoPanel
                obj={obj}
                missionName={mission.name}
                missionSite={mission.site}
                missionDate={mission.date}
                crew={mission.crew}
                isMars={!!isMars}
              />
            </div>
          </>
        )}
      </div>

      {/* EVA status bar */}
      <EvaBar found={found.length} total={objects.length} />

      {/* Close button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => send("EXIT_INSPECT")}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold text-regolith-200 transition hover:bg-space-800"
          style={{ borderColor: HOLO_BORDER, background: "rgba(7,9,13,0.85)" }}
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
