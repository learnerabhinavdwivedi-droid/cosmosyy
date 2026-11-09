import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import * as THREE from "three";

const BEAT_LABELS: Partial<Record<GamePhase, string>> = {
  flight: "Trans-Lunar Injection — Leaving Earth orbit",
  coast: "Coasting to the Moon — 240,000 miles to go",
  orbit: "Lunar Orbit Insertion — Going around the Moon",
  targetLocked: "Target locked — Sea of Tranquility",
  descent: "Powered descent — Eagle has undocked",
  touchdown: "Contact light — The Eagle has landed",
  stepOut: "Depressurising cabin — Ready to step out",
};

const BEAT_EVENTS = [
  { from: "flight" as GamePhase, event: "START_COAST" as const, delay: 5000 },
  { from: "coast" as GamePhase, event: "REACH_ORBIT" as const, delay: 5000 },
  { from: "orbit" as GamePhase, event: "LOCK_TARGET" as const, delay: 4000 },
  {
    from: "targetLocked" as GamePhase,
    event: "BEGIN_DESCENT" as const,
    delay: 4000,
  },
  { from: "descent" as GamePhase, event: "TOUCH_DOWN" as const, delay: 6000 },
  {
    from: "touchdown" as GamePhase,
    event: "OPEN_HATCH" as const,
    delay: 3000,
  },
  { from: "stepOut" as GamePhase, event: "STEP_OUT" as const, delay: 3000 },
];

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={ref} position={[-8, -2, -15]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useGameStore((s) => s.phase);

  const targetScale = useMemo(() => {
    if (phase === "flight" || phase === "coast") return 0.5;
    if (phase === "orbit" || phase === "targetLocked") return 3;
    return 8;
  }, [phase]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    const s = ref.current.scale.x;
    const next = THREE.MathUtils.lerp(s, targetScale, delta * 0.5);
    ref.current.scale.setScalar(next);
  });

  return (
    <mesh ref={ref} position={[5, 1, -20]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#a0a0a0"
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

function Spacecraft() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3;
    ref.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
  });
  return (
    <group ref={ref} position={[0, -0.5, -3]}>
      {/* TEMPORARY: simple cone+cylinder until LM model is used in flight */}
      <mesh>
        <coneGeometry args={[0.3, 1.2, 6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.5, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function BeatLabel() {
  const phase = useGameStore((s) => s.phase);
  const label = BEAT_LABELS[phase] ?? "";
  return (
    <Text
      position={[0, -2, -5]}
      fontSize={0.2}
      color="#e0e0e0"
      anchorX="center"
      anchorY="middle"
      maxWidth={6}
    >
      {label}
    </Text>
  );
}

function FlightSceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Stars radius={200} depth={50} count={5000} factor={4} fade speed={1} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <Moon />
      <Spacecraft />
      <BeatLabel />
    </>
  );
}

function FlightHUD() {
  const phase = useGameStore((s) => s.phase);
  const label = BEAT_LABELS[phase] ?? phase;
  const progress = [
    "flight",
    "coast",
    "orbit",
    "targetLocked",
    "descent",
    "touchdown",
    "stepOut",
  ];
  const idx = progress.indexOf(phase);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top narration bar */}
      <div className="mx-auto mt-6 max-w-xl rounded-lg bg-space-950/80 px-6 py-3 text-center backdrop-blur">
        <p className="font-display text-lg text-regolith-200">{label}</p>
      </div>

      {/* Progress dots */}
      <div className="mx-auto mt-4 flex gap-2">
        {progress.map((p, i) => (
          <div
            key={p}
            className={`h-2 w-2 rounded-full transition-colors ${
              i <= idx ? "bg-signal" : "bg-space-700"
            }`}
          />
        ))}
      </div>

      {/* Altitude during descent */}
      {(phase === "descent" || phase === "touchdown") && (
        <div className="mt-auto mb-8 text-center">
          <p className="font-mono text-2xl text-signal">
            {phase === "descent" ? "ALT: 500ft" : "ALT: 0ft — CONTACT LIGHT"}
          </p>
        </div>
      )}
    </div>
  );
}

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
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <FlightSceneContent />
      </Canvas>
      <FlightHUD />
    </div>
  );
}
