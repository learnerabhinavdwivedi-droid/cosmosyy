import { useEffect, useRef, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { DebugPanel } from "@/components/DebugPanel";
import { gameAudio } from "@/lib/gameAudio";
import { preloadNarration, playNarration, stopNarration, unlockAudio } from "@/lib/narration";
import { FlightScene } from "./FlightScene";
import { SurfaceScene } from "./SurfaceScene";
import { ReportScreen } from "./ReportScreen";
import { LMDescent, LMAscent } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import { getApollo11SunPosition } from "./sunPosition";
import * as THREE from "three";

const FLIGHT_PHASES = new Set<string>(["flight", "coast", "orbit", "targetLocked", "descent", "touchdown", "stepOut"]);
const SURFACE_PHASES = new Set<string>(["explore", "inspect", "flagReady", "flagPlanted"]);
const ENGINE_PHASES = new Set<string>(["flight", "targetLocked", "descent", "launch"]);

function GameAudioController() {
  const prevPhase = useRef<GamePhase>("select");

  useEffect(() => {
    preloadNarration();
  }, []);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      const phase = s.phase;
      const prev = prevPhase.current;
      if (phase === prev) return;
      prevPhase.current = phase;

      if (phase === "flight" && prev === "select") {
        gameAudio.unlock();
        unlockAudio();
        gameAudio.playCountdown();
        setTimeout(() => {
          gameAudio.startEngine();
          playNarration(phase);
        }, 1600);
        return;
      }

      playNarration(phase);

      if (ENGINE_PHASES.has(phase) && !ENGINE_PHASES.has(prev)) {
        gameAudio.startEngine();
      }
      if (!ENGINE_PHASES.has(phase) && ENGINE_PHASES.has(prev)) {
        gameAudio.stopEngine();
      }

      if (phase === "orbit" || phase === "coast") {
        gameAudio.playRadioBeep();
      }

      if (phase === "touchdown") {
        gameAudio.stopEngine();
        gameAudio.playThud();
      }

      if (phase === "explore") {
        gameAudio.playRadioBeep();
      }

      if (phase === "launch") {
        gameAudio.playCountdown();
        setTimeout(() => gameAudio.startEngine(), 1600);
      }

      if (phase === "report") {
        gameAudio.stopEngine();
        stopNarration();
        gameAudio.playSuccess();
      }
    });
    return unsub;
  }, []);

  return null;
}

function SceneFade({ phase }: { phase: string }) {
  const prevPhase = useRef(phase);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;

    const wasFlightScene = FLIGHT_PHASES.has(prev);
    const isSurfaceScene = SURFACE_PHASES.has(phase);
    const wasLaunch = prev === "launch";
    const isReport = phase === "report";
    const wasSurface = SURFACE_PHASES.has(prev);
    const isLaunch = phase === "launch";

    if ((wasFlightScene && isSurfaceScene) || (wasLaunch && isReport) || (wasSurface && isLaunch)) {
      setOpacity(1);
      const timer = setTimeout(() => setOpacity(0), 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (opacity === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-700"
      style={{ opacity }}
    />
  );
}

export default function GameShell() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);
  const setMission = useGameStore((s) => s.setMission);
  const gameMission = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);
  const prevPhase = useRef(phase);

  useEffect(() => {
    if (!playerName) {
      navigate("/");
      return;
    }
    if (missionId && gameMission !== missionId) {
      setMission(missionId);
      send("LAUNCH_MISSION");
    }
  }, [missionId, gameMission, playerName, navigate, setMission, send]);

  useEffect(() => {
    if (phase === "select" && prevPhase.current !== "select") {
      navigate("/");
    }
    prevPhase.current = phase;
  }, [phase, navigate]);

  const isFlightPhase = FLIGHT_PHASES.has(phase);
  const isSurfacePhase = SURFACE_PHASES.has(phase);

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      {isFlightPhase && <FlightScene />}
      {isSurfacePhase && <SurfaceScene />}
      {phase === "launch" && <LaunchScene />}
      {phase === "report" && <ReportScreen />}
      <SceneFade phase={phase} />
      <GameAudioController />
      <DebugPanel />
    </div>
  );
}

function AscentAnimator() {
  const ref = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);

  useFrame((state, dt) => {
    elapsed.current += dt;
    if (ref.current) {
      ref.current.position.y = elapsed.current * 2.5;
      ref.current.rotation.z = Math.sin(elapsed.current * 3) * 0.02;
    }
    if (flameRef.current) {
      flameRef.current.scale.y = 0.8 + Math.sin(elapsed.current * 15) * 0.3;
    }
    state.camera.position.y = 3 + elapsed.current * 0.3;
    state.camera.lookAt(0, elapsed.current * 1.2, 0);
  });

  return (
    <group ref={ref}>
      <Suspense fallback={null}>
        <LMAscent scale={1} />
      </Suspense>
      <mesh ref={flameRef} position={[0, -1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.3, 2, 8]} />
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

function LaunchSceneContent() {
  const sunData = getApollo11SunPosition();

  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} fade speed={0} />
      <ambientLight intensity={0.02} color="#333344" />
      <directionalLight
        position={sunData.direction}
        intensity={3.0}
        color="#fff5e0"
      />
      <Suspense fallback={null}>
        <Terrain />
      </Suspense>
      <GroundPlane />
      <Suspense fallback={null}>
        <LMDescent position={[0, 0, 0]} scale={1} />
      </Suspense>
      <AscentAnimator />
    </>
  );
}

function LaunchScene() {
  const { t } = useTranslation();
  const send = useGameStore((s) => s.send);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 4000);
    const reportTimer = setTimeout(() => send("SHOW_REPORT"), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(reportTimer);
    };
  }, [send]);

  return (
    <div className="relative h-screen w-full">
      <Canvas
        camera={{ position: [15, 3, 15], fov: 55, near: 0.1, far: 2000 }}
        gl={{ antialias: true, toneMapping: THREE.AgXToneMapping }}
      >
        <color attach="background" args={["#000000"]} />
        <LaunchSceneContent />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-12">
        <div className="rounded-lg bg-space-950/85 px-6 py-3 backdrop-blur">
          <p className="font-display text-lg text-regolith-200">
            {t("flight.ascentNarration")}
          </p>
        </div>
      </div>
      {fade && (
        <div className="absolute inset-0 z-20 bg-space-950 transition-opacity duration-1000" />
      )}
    </div>
  );
}
