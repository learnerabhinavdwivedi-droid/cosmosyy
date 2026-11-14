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
    const scale = 2.4 / (maxDim || 1);
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
    <group position={[0, -1.25, 0]}>
      {/* Dark radial contact shadow on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} depthWrite={false} />
      </mesh>
      {/* Outer soft shadow feather */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* Studio turntable ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.98, 2.02, 64]} />
        <meshBasicMaterial color="#3a404c" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Camera auto-fit ─── */
function AutoCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(3.2, 2.0, 3.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

/* ─── 3D Viewer canvas with Blender Finish ─── */
function HoloCanvas({
  modelUrl,
  explode,
  wireframe,
  theme,
  manifest,
}: {
  modelUrl: string;
  explode: number;
  wireframe?: boolean;
  theme: ObjectTheme;
  manifest?: HologramManifest | null;
}) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 38, near: 0.1, far: 100, position: [3.2, 2.0, 3.2] }}
      style={{ background: "transparent" }}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        <HoloModel
          url={modelUrl}
          explode={explode}
          wireframe={wireframe}
          themeColor={theme.primary}
          manifest={manifest}
        />
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

/* ─── Component label list (left panel with GLB) ─── */
function ComponentLabels({ manifest, theme }: { manifest: HologramManifest; theme: ObjectTheme }) {
  const parts = useMemo(() => getDisplayComponents(manifest), [manifest]);

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

/* ─── Right info panel ─── */
function InfoPanel({
  obj,
  missionName,
  missionSite,
  missionDate,
  crew,
  isMars,
  theme,
}: {
  obj: HeritageObject;
  missionName: string;
  missionSite: string;
  missionDate: string;
  crew: { commander: string; lmp: string; cmp: string };
  isMars: boolean;
  theme: ObjectTheme;
}) {
  const [imgError, setImgError] = useState(false);
  const nasaUrl = obj.nasaImageId
    ? `https://images-assets.nasa.gov/image/${obj.nasaImageId}/${obj.nasaImageId}~medium.jpg`
    : null;

  return (
    <div
      className="flex h-full flex-col overflow-y-auto rounded-xl border p-5 backdrop-blur-xl"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.92)" }}
    >
      {/* Category + status */}
      <div className="flex items-center justify-between">
        <span
          className="rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
          style={{ background: theme.primaryDim, color: theme.primary }}
        >
          {theme.category}
        </span>
        <StatusBadge status={obj.status} />
      </div>

      {/* Object name */}
      <h2 className="mt-3 font-display text-xl font-bold" style={{ color: theme.primary }}>
        {obj.name}
      </h2>

      {/* Mission + Site */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-regolith-400">
        <span className="flex items-center gap-1">
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

      {/* Crew (Moon only) */}
      {!isMars && (
        <p className="mt-1 text-[10px] text-regolith-500">
          {crew.commander} · {crew.lmp} · {crew.cmp}
        </p>
      )}

      {/* Divider */}
      <div className="my-3 h-px" style={{ background: theme.border }} />

      {/* NASA Image */}
      {nasaUrl && !imgError && (
        <div className="relative mb-3 overflow-hidden rounded-lg border" style={{ borderColor: theme.border }}>
          <img
            src={nasaUrl}
            alt={obj.name}
            className="h-36 w-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
            <p className="text-[8px] text-regolith-400">NASA / {obj.nasaImageId}</p>
          </div>
        </div>
      )}

      {/* First person narration */}
      {obj.firstPerson && (
        <div
          className="mb-3 rounded-lg border px-3 py-2"
          style={{ borderColor: theme.border, background: theme.primaryDim }}
        >
          <p className="text-[10px] italic leading-relaxed text-regolith-200">
            &ldquo;{obj.firstPerson.split(".").slice(0, 2).join(".")}.&rdquo;
          </p>
        </div>
      )}

      {/* Description */}
      <p className="text-xs leading-relaxed text-regolith-300">{obj.description}</p>

      {/* Science discovery */}
      {obj.scienceDiscovery && (
        <div className="mt-3 rounded-lg border px-3 py-2" style={{ borderColor: theme.border, background: theme.primaryDim }}>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
            Science Discovery
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-regolith-200">
            {obj.scienceDiscovery}
          </p>
        </div>
      )}

      {/* Legacy */}
      {obj.legacy && (
        <div className="mt-2 rounded-lg border border-space-700/30 bg-space-800/40 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-regolith-400/60">Legacy</p>
          <p className="mt-1 text-[11px] leading-relaxed text-regolith-300">{obj.legacy}</p>
        </div>
      )}

      {/* Year info */}
      {(obj.yearDeployed || obj.yearLastContact) && (
        <div className="mt-2 flex gap-3 text-[10px] text-regolith-400">
          {obj.yearDeployed && <span>Deployed {obj.yearDeployed}</span>}
          {obj.yearLastContact && <span>Last contact {obj.yearLastContact}</span>}
        </div>
      )}

      {/* Bottom spacer to push XP down */}
      <div className="mt-auto" />

      {/* XP badge + Source */}
      <div className="mt-3 flex items-center justify-between">
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
          <span className="max-w-[50%] truncate text-[9px] text-regolith-500" title={obj.source}>
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
                  modelUrl={modelEntry!.modelPath}
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
              {(!manifest?.components || manifest.components.length === 0) && (
                <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-space-950/70 px-2.5 py-1 text-[9px] font-mono text-regolith-300 backdrop-blur-sm border border-space-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Orbit 360° · Scroll to Zoom</span>
                </div>
              )}

              {/* Exploded view slider if components available */}
              {manifest?.components && manifest.components.length > 0 && (
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
                    <ComponentLabels manifest={manifest} theme={theme} />
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
            missionName={mission.name}
            missionSite={mission.site}
            missionDate={mission.date}
            crew={mission.crew}
            isMars={!!isMars}
            theme={theme}
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
