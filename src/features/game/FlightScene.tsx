import { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

const EARTH = new THREE.Vector3(-28, 0, -20);
const MOON = new THREE.Vector3(20, 0, -20);
const MOON_R = 8;
const ORBIT_R = 11;

const ease = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

function orbitPos(angle: number): THREE.Vector3 {
  return new THREE.Vector3(
    MOON.x + ORBIT_R * Math.cos(angle),
    1,
    MOON.z + ORBIT_R * Math.sin(angle),
  );
}

const ORBIT_A0 = Math.PI;
const ORBIT_A1 = Math.PI * 1.8;

function shipPos(phase: string, p: number): THREE.Vector3 {
  const t = ease(p);
  const v = new THREE.Vector3();
  switch (phase) {
    case "flight":
      v.lerpVectors(
        new THREE.Vector3(-20, 1, -16),
        new THREE.Vector3(-4, 3, -17),
        t,
      );
      break;
    case "coast":
      v.lerpVectors(
        new THREE.Vector3(-4, 3, -17),
        new THREE.Vector3(9, 1.5, -20),
        t,
      );
      break;
    case "orbit":
      v.copy(orbitPos(ORBIT_A0 + (ORBIT_A1 - ORBIT_A0) * t));
      break;
    case "targetLocked":
      v.lerpVectors(orbitPos(ORBIT_A1), new THREE.Vector3(28, 3, -20), t);
      break;
    case "descent":
      v.lerpVectors(
        new THREE.Vector3(28, 3, -20),
        new THREE.Vector3(28, 0.2, -20),
        t,
      );
      break;
    default:
      v.set(28, 0.2, -20);
  }
  return v;
}

function camTarget(
  phase: string,
  sp: THREE.Vector3,
): { pos: THREE.Vector3; look: THREE.Vector3 } {
  switch (phase) {
    case "flight":
      return {
        pos: sp.clone().add(new THREE.Vector3(5, 3, 10)),
        look: sp.clone(),
      };
    case "coast":
      return {
        pos: sp.clone().add(new THREE.Vector3(4, 4, 9)),
        look: sp.clone(),
      };
    case "orbit":
      return {
        pos: new THREE.Vector3(42, 12, -5),
        look: MOON.clone().add(new THREE.Vector3(0, 1, 0)),
      };
    case "targetLocked":
      return {
        pos: sp.clone().add(new THREE.Vector3(3, 6, 8)),
        look: sp.clone(),
      };
    case "descent":
      return {
        pos: sp.clone().add(new THREE.Vector3(7, 8, 6)),
        look: sp.clone(),
      };
    default:
      return {
        pos: sp.clone().add(new THREE.Vector3(8, 4, 10)),
        look: sp.clone(),
      };
  }
}

const DUR: Record<string, number> = {
  flight: 7,
  coast: 7,
  orbit: 6,
  targetLocked: 4,
  descent: 8,
  touchdown: 4,
  stepOut: 3,
};

const BEAT_EVENTS = [
  { from: "flight" as GamePhase, event: "START_COAST" as const, delay: 7000 },
  { from: "coast" as GamePhase, event: "REACH_ORBIT" as const, delay: 7000 },
  { from: "orbit" as GamePhase, event: "LOCK_TARGET" as const, delay: 6000 },
  {
    from: "targetLocked" as GamePhase,
    event: "BEGIN_DESCENT" as const,
    delay: 4000,
  },
  {
    from: "descent" as GamePhase,
    event: "TOUCH_DOWN" as const,
    delay: 8000,
  },
  {
    from: "touchdown" as GamePhase,
    event: "OPEN_HATCH" as const,
    delay: 4000,
  },
  { from: "stepOut" as GamePhase, event: "STEP_OUT" as const, delay: 3000 },
];

function getNarration(phase: GamePhase, name: string): string {
  const n = name || "Commander";
  switch (phase) {
    case "flight":
      return `Welcome aboard, ${n}. Apollo 11 is bound for the Moon. Your job: land at the Sea of Tranquility, then find what was left behind.`;
    case "coast":
      return `Michael Collins stays in orbit aboard Columbia. You ride Eagle down with Armstrong and Aldrin. 240,000 miles to go.`;
    case "orbit":
      return `Lunar Orbit Insertion complete. The far side was silent and dark. Now the surface fills your window.`;
    case "targetLocked":
      return `Target locked: 0.67° North, 23.47° East. Sea of Tranquility. Undocking Eagle for powered descent.`;
    case "descent":
      return `Eagle’s descent engine firing. Altitude dropping. Program alarms — ignore them. Almost there.`;
    case "touchdown":
      return `Contact light. Engine stop. “The Eagle has landed.” July 20, 1969.`;
    case "stepOut":
      return `Cabin depressurised. Opening the hatch. One small step, ${n}.`;
    default:
      return "";
  }
}

const PHASE_LABEL: Record<string, string> = {
  flight: "Trans-Lunar Injection",
  coast: "Translunar Coast",
  orbit: "Lunar Orbit Insertion",
  targetLocked: "Target Locked",
  descent: "Powered Descent",
  touchdown: "The Eagle Has Landed",
  stepOut: "Opening Hatch",
};

/* ---- 3D ---- */

function EarthSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <mesh ref={ref} position={EARTH.toArray()}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

function MoonSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const color = useLoader(
    THREE.TextureLoader,
    "/textures/moon-color-4k.webp",
  );
  const disp = useLoader(
    THREE.TextureLoader,
    "/textures/moon-elevation-2k.png",
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });
  return (
    <mesh ref={ref} position={MOON.toArray()}>
      <sphereGeometry args={[MOON_R, 128, 128]} />
      <meshStandardMaterial
        map={color}
        displacementMap={disp}
        displacementScale={0.2}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

function LandingMarker() {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useGameStore((s) => s.phase);
  const show = ["orbit", "targetLocked", "descent"].includes(phase);
  useFrame(() => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(Date.now() * 0.005) * 0.35;
    }
  });
  if (!show) return null;
  return (
    <mesh
      ref={ref}
      position={[28, 0.5, -20]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.5, 0.8, 32]} />
      <meshBasicMaterial
        color="#ffd36e"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitPath() {
  const phase = useGameStore((s) => s.phase);
  const show = phase === "orbit" || phase === "targetLocked";
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      pts.push(orbitPos((i / 96) * Math.PI * 2));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, []);
  if (!show) return null;
  return (
    <line geometry={geo}>
      <lineBasicMaterial color="#6ee7ff" transparent opacity={0.3} />
    </line>
  );
}

function FlightAnimator() {
  const { camera } = useThree();
  const shipRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const phase = useGameStore((s) => s.phase);
  const prevPhase = useRef(phase);
  const elapsed = useRef(0);
  const lookRef = useRef(new THREE.Vector3(0, 0, -10));

  useEffect(() => {
    if (phase !== prevPhase.current) {
      prevPhase.current = phase;
      elapsed.current = 0;
    }
  }, [phase]);

  useFrame((_, dt) => {
    elapsed.current += dt;
    const dur = DUR[phase] || 5;
    const progress = Math.min(elapsed.current / dur, 1);

    const sp = shipPos(phase, progress);

    if (shipRef.current) {
      shipRef.current.position.copy(sp);
      const ahead = shipPos(phase, Math.min(progress + 0.03, 1));
      const dir = ahead.clone().sub(sp);
      if (dir.length() > 0.001) shipRef.current.lookAt(ahead);
    }

    const ct = camTarget(phase, sp);
    camera.position.lerp(ct.pos, dt * 1.5);
    lookRef.current.lerp(ct.look, dt * 2);
    camera.lookAt(lookRef.current);

    const powered = ["flight", "targetLocked", "descent"].includes(phase);
    if (flameRef.current) {
      flameRef.current.visible = powered;
      if (powered)
        flameRef.current.scale.z = 0.8 + Math.sin(Date.now() * 0.05) * 0.2;
    }
  });

  return (
    <group ref={shipRef} scale={0.7}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <coneGeometry args={[0.45, 1.6, 12]} />
          <meshStandardMaterial
            color="#d0d5dd"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 1.4, 12]} />
          <meshStandardMaterial
            color="#a0a4aa"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0, -2.5, 0]}>
          <cylinderGeometry args={[0.65, 0.55, 0.9, 8]} />
          <meshStandardMaterial color="#888" metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
      <mesh
        ref={flameRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 2.5]}
      >
        <coneGeometry args={[0.35, 3, 12]} />
        <meshBasicMaterial
          color="#ffb36b"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FlightContent() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[30, 20, -40]} intensity={1.8} />
      <Stars
        radius={300}
        depth={60}
        count={6000}
        factor={4}
        fade
        speed={0}
      />
      <Suspense fallback={null}>
        <EarthSphere />
      </Suspense>
      <Suspense fallback={null}>
        <MoonSphere />
      </Suspense>
      <LandingMarker />
      <OrbitPath />
      <FlightAnimator />
    </>
  );
}

/* ---- HUD ---- */

function FlightHUD() {
  const phase = useGameStore((s) => s.phase);
  const playerName = useAppStore((s) => s.player.name);
  const label = PHASE_LABEL[phase] ?? "";
  const narration = getNarration(phase, playerName);

  const phases = [
    "flight",
    "coast",
    "orbit",
    "targetLocked",
    "descent",
    "touchdown",
    "stepOut",
  ];
  const idx = phases.indexOf(phase);
  const pct = Math.max(0, (idx / (phases.length - 1)) * 100);

  const [alt, setAlt] = useState(15000);
  useEffect(() => {
    if (phase !== "descent") {
      setAlt(15000);
      return;
    }
    const t0 = Date.now();
    const interval = setInterval(() => {
      const prog = Math.min((Date.now() - t0) / 8000, 1);
      setAlt(Math.max(0, Math.round(15000 * (1 - prog))));
    }, 80);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top bar */}
      <div className="flex items-start justify-between px-4 pt-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-regolith-400">
            APOLLO 11
          </p>
          <p className="font-display text-lg font-semibold text-signal">
            {label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-regolith-400">
            Commander {playerName}
          </p>
          {phase === "descent" && (
            <p className="font-mono text-lg font-bold text-signal">
              ALT {alt.toLocaleString()} m
            </p>
          )}
          {phase === "touchdown" && (
            <p className="font-mono text-lg font-bold text-signal">
              ALT 0 m — CONTACT
            </p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mx-4 mt-3">
        <div className="h-1 rounded-full bg-space-800">
          <div
            className="h-1 rounded-full bg-signal transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between px-1">
          {phases.map((p, i) => (
            <div
              key={p}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= idx ? "bg-signal" : "bg-space-700"}`}
            />
          ))}
        </div>
      </div>

      {/* Narration subtitle */}
      <div className="mt-auto px-4 pb-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-space-950/85 px-6 py-4 backdrop-blur">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 text-xs font-bold tracking-widest text-signal">
              {PHASE_LABEL[phase]?.toUpperCase() ?? "FLIGHT"}
            </span>
            <p className="text-base leading-relaxed text-regolith-200">
              {narration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */

export function FlightScene() {
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);

  useEffect(() => {
    const beat = BEAT_EVENTS.find((b) => b.from === phase);
    if (!beat) return;
    const timer = setTimeout(() => send(beat.event), beat.delay);
    return () => clearTimeout(timer);
  }, [phase, send]);

  return (
    <div className="relative h-screen w-full">
      <Canvas
        camera={{ position: [-15, 3, -8], fov: 55, near: 0.1, far: 2000 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#020408"]} />
        <FlightContent />
      </Canvas>
      <FlightHUD />
    </div>
  );
}
