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

/* ─── Holographic 3D model ─── */
function HoloModel({
  url,
  explode,
  wireframe,
  themeColor,
  manifest,
}: {
  url: string;
  explode: number;
  wireframe?: boolean;
  themeColor: string;
  manifest?: HologramManifest | null;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(themeColor),
          emissive: new THREE.Color(themeColor),
          emissiveIntensity: wireframe ? 0.6 : 0.35,
          transparent: true,
          opacity: wireframe ? 0.4 : 0.85,
          wireframe: !!wireframe,
          side: THREE.DoubleSide,
        });
      }
    });
  }, [clonedScene, wireframe, themeColor]);

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
function HoloRings({ color }: { color: string }) {
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
            color={color}
            transparent
            opacity={0.25 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh>
        <circleGeometry args={[0.8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ─── Scan line sweep ─── */
function ScanLine({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 1.5;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[4, 0.02]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
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

/* ─── 3D Viewer canvas ─── */
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
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 40, near: 0.1, far: 100, position: [3, 2, 3] }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color={theme.primary} />
      <pointLight position={[0, -2, 0]} intensity={0.4} color={theme.primary} />
      <Suspense fallback={null}>
        <HoloModel
          url={modelUrl}
          explode={explode}
          wireframe={wireframe}
          themeColor={theme.primary}
          manifest={manifest}
        />
      </Suspense>
      <HoloRings color={theme.primary} />
      <ScanLine color={theme.primary} />
      <AutoCamera />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

/* ─── Category SVG icon (for objects without 3D model) ─── */
function CategoryIcon({ type, color }: { type: string; color: string }) {
  const sw = 1.5;
  const common = { fill: "none", stroke: color, strokeWidth: sw, opacity: 0.5 };

  switch (type) {
    case "spacecraft":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <polygon points="35,25 65,25 72,55 28,55" />
          <line x1="28" y1="55" x2="15" y2="82" />
          <line x1="72" y1="55" x2="85" y2="82" />
          <ellipse cx="15" cy="85" rx="8" ry="2.5" />
          <ellipse cx="85" cy="85" rx="8" ry="2.5" />
          <line x1="50" y1="25" x2="50" y2="12" />
          <circle cx="50" cy="8" r="5" />
          <rect x="38" y="36" width="24" height="12" rx="2" />
          <line x1="50" y1="55" x2="50" y2="70" />
          <polygon points="44,70 56,70 58,78 42,78" />
        </svg>
      );
    case "science":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="22" />
          <circle cx="50" cy="50" r="8" />
          <circle cx="50" cy="50" r="2" fill={color} stroke="none" />
          <line x1="50" y1="15" x2="50" y2="5" />
          <line x1="50" y1="95" x2="50" y2="85" />
          <line x1="15" y1="50" x2="5" y2="50" />
          <line x1="95" y1="50" x2="85" y2="50" />
          <line x1="26" y1="26" x2="19" y2="19" />
          <line x1="74" y1="74" x2="81" y2="81" />
          <line x1="74" y1="26" x2="81" y2="19" />
          <line x1="26" y1="74" x2="19" y2="81" />
        </svg>
      );
    case "rover":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <rect x="22" y="35" width="56" height="22" rx="4" />
          <rect x="26" y="26" width="18" height="11" rx="2" />
          <line x1="56" y1="35" x2="66" y2="22" />
          <circle cx="69" cy="19" r="5" />
          <circle cx="30" cy="70" r="10" />
          <circle cx="70" cy="70" r="10" />
          <line x1="30" y1="57" x2="30" y2="60" />
          <line x1="70" y1="57" x2="70" y2="60" />
          <rect x="30" y="40" width="6" height="4" rx="1" fill={color} stroke="none" opacity="0.3" />
          <rect x="40" y="40" width="6" height="4" rx="1" fill={color} stroke="none" opacity="0.3" />
          <rect x="50" y="40" width="6" height="4" rx="1" fill={color} stroke="none" opacity="0.3" />
        </svg>
      );
    case "memorial":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <line x1="28" y1="88" x2="28" y2="18" />
          <rect x="28" y="18" width="42" height="28" />
          <line x1="28" y1="32" x2="70" y2="32" />
          <line x1="28" y1="18" x2="70" y2="18" />
          <polygon points="48,22 49,25 52,25 50,27 51,30 48,28 45,30 46,27 44,25 47,25" fill={color} stroke="none" opacity="0.6" />
          <polygon points="58,22 59,25 62,25 60,27 61,30 58,28 55,30 56,27 54,25 57,25" fill={color} stroke="none" opacity="0.6" />
          <polygon points="48,35 49,38 52,38 50,40 51,43 48,41 45,43 46,40 44,38 47,38" fill={color} stroke="none" opacity="0.4" />
        </svg>
      );
    case "equipment":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <circle cx="50" cy="32" r="18" />
          <circle cx="50" cy="32" r="12" />
          <circle cx="50" cy="32" r="4" fill={color} stroke="none" opacity="0.3" />
          <line x1="50" y1="50" x2="50" y2="82" />
          <line x1="32" y1="82" x2="68" y2="82" />
          <line x1="50" y1="68" x2="36" y2="82" />
          <line x1="50" y1="68" x2="64" y2="82" />
          <rect x="44" y="56" width="12" height="6" rx="1" />
        </svg>
      );
    case "geological":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <path d="M10,78 Q25,55 40,62 Q55,69 70,48 Q82,34 92,38" />
          <path d="M10,68 Q25,48 40,52 Q55,56 70,38 Q82,26 92,28" />
          <path d="M10,58 Q30,42 50,44 Q65,46 80,22 Q88,16 92,18" />
          <circle cx="38" cy="52" r="3" fill={color} stroke="none" opacity="0.4" />
          <circle cx="58" cy="40" r="2.5" fill={color} stroke="none" opacity="0.3" />
          <circle cx="75" cy="32" r="2" fill={color} stroke="none" opacity="0.35" />
          <circle cx="28" cy="65" r="1.8" fill={color} stroke="none" opacity="0.25" />
          <path d="M15,85 L30,70 L50,75 L70,60 L90,65" strokeDasharray="3 2" />
        </svg>
      );
    case "helicopter":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <rect x="40" y="42" width="20" height="26" rx="5" />
          <line x1="50" y1="42" x2="50" y2="32" />
          <line x1="18" y1="32" x2="82" y2="32" />
          <ellipse cx="18" cy="32" rx="3" ry="1" />
          <ellipse cx="82" cy="32" rx="3" ry="1" />
          <line x1="50" y1="68" x2="50" y2="78" />
          <line x1="36" y1="78" x2="64" y2="78" />
          <line x1="40" y1="52" x2="28" y2="62" />
          <line x1="60" y1="52" x2="72" y2="62" />
          <circle cx="50" cy="55" r="3" fill={color} stroke="none" opacity="0.3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" {...common}>
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" />
          <circle cx="50" cy="50" r="3" fill={color} stroke="none" />
        </svg>
      );
  }
}

/* ─── Blueprint view (left panel for non-GLB objects) ─── */
function BlueprintView({ obj, theme }: { obj: HeritageObject; theme: ObjectTheme }) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-xl border"
      style={{ borderColor: theme.border, background: "rgba(7,9,13,0.85)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Corner brackets */}
      <div className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2" style={{ borderColor: theme.primary }} />
      <div className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2" style={{ borderColor: theme.primary }} />
      <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2" style={{ borderColor: theme.primary }} />
      <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2" style={{ borderColor: theme.primary }} />
      {/* Category icon */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <CategoryIcon type={theme.iconType} color={theme.primary} />
      </div>
      {/* Scan line animation */}
      <div
        className="absolute left-0 right-0 h-px animate-pulse"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          top: "50%",
        }}
      />
      {/* Bottom label */}
      <div className="mt-auto relative z-10 p-4">
        <span
          className="inline-block rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
          style={{ background: theme.primaryDim, color: theme.primary }}
        >
          {theme.category}
        </span>
        <p className="mt-1.5 text-sm font-bold text-regolith-100">{obj.name}</p>
        {obj.yearDeployed && (
          <p className="mt-0.5 text-[10px] text-regolith-400">Deployed {obj.yearDeployed}</p>
        )}
      </div>
    </div>
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
  const [wireframe, setWireframe] = useState(true);
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
              <div className="absolute left-3 top-3 right-3 z-10 flex items-center justify-between">
                <span
                  className="rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
                  style={{ background: theme.primaryDim, color: theme.primary }}
                >
                  {theme.category}
                </span>
                <button
                  type="button"
                  onClick={() => setWireframe((v) => !v)}
                  className="rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition hover:bg-space-800"
                  style={{ borderColor: theme.border, color: theme.primary, background: theme.primaryDim }}
                >
                  {wireframe ? "Wireframe" : "Solid Holo"}
                </button>
              </div>

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
            <BlueprintView obj={obj} theme={theme} />
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
