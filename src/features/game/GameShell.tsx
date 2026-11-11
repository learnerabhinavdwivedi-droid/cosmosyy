import { useEffect, useRef, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
import { getSunPosition } from "./sunPosition";
import { getMission, getMissionOrNull } from "@/lib/missionData";
import { Effects } from "./Effects";
import * as THREE from "three";

const FLIGHT_PHASES = new Set<string>(["flight", "coast", "orbit", "targetLocked", "descent", "touchdown", "stepOut"]);
const SURFACE_PHASES = new Set<string>(["explore", "inspect", "flagReady", "flagPlanted"]);
const ENGINE_PHASES = new Set<string>(["flight", "targetLocked", "descent", "launch"]);

function GameAudioController() {
  const prevPhase = useRef<GamePhase>("select");
  const missionIdRef = useRef(useGameStore.getState().missionId);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      missionIdRef.current = s.missionId;
    });
    preloadNarration(missionIdRef.current ?? undefined);
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      const phase = s.phase;
      const prev = prevPhase.current;
      if (phase === prev) return;
      prevPhase.current = phase;
      const mid = s.missionId ?? undefined;
      const missionSpec = mid ? getMissionOrNull(mid) : null;
      const isRobotic = missionSpec?.missionType === "robotic";

      if (phase === "flight" && prev === "select") {
        preloadNarration(mid);
        gameAudio.unlock();
        unlockAudio();
        gameAudio.playCountdown();
        setTimeout(() => {
          gameAudio.startEngine();
          gameAudio.startSpaceDrone();
          playNarration(phase, mid);
        }, 1600);
        return;
      }

      playNarration(phase, mid);

      if (ENGINE_PHASES.has(phase) && !ENGINE_PHASES.has(prev)) {
        gameAudio.startEngine();
      }
      if (!ENGINE_PHASES.has(phase) && ENGINE_PHASES.has(prev)) {
        gameAudio.stopEngine();
      }

      if (phase === "orbit" || phase === "coast") {
        gameAudio.playQuindar();
      }

      if (phase === "touchdown") {
        gameAudio.stopEngine();
        gameAudio.playThud();
        gameAudio.stopSpaceDrone();
      }

      if (phase === "stepOut") {
        if (!isRobotic) gameAudio.playAirlock();
      }

      if (SURFACE_PHASES.has(phase) && !SURFACE_PHASES.has(prev)) {
        if (!isRobotic) gameAudio.startBreathing();
        gameAudio.startLunarHum();
      }
      if (!SURFACE_PHASES.has(phase) && SURFACE_PHASES.has(prev)) {
        if (!isRobotic) gameAudio.stopBreathing();
        gameAudio.stopLunarHum();
      }

      if (phase === "explore") {
        gameAudio.playQuindar();
      }

      if (phase === "launch") {
        gameAudio.stopLunarHum();
        gameAudio.stopBreathing();
        gameAudio.playCountdown();
        setTimeout(() => gameAudio.startEngine(), 1600);
      }

      if (phase === "report") {
        gameAudio.stopEngine();
        gameAudio.stopSpaceDrone();
        gameAudio.stopLunarHum();
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
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const phase = useGameStore((s) => s.phase);
  const send = useGameStore((s) => s.send);
  const setMission = useGameStore((s) => s.setMission);
  const gameMission = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);
  const prevPhase = useRef(phase);
  const demoSkipped = useRef(false);

  useEffect(() => {
    if (!playerName && !isDemo) {
      navigate("/");
      return;
    }
    if (isDemo && !playerName) {
      useAppStore.getState().setPlayerName("Commander");
    }
    if (missionId && gameMission !== missionId) {
      setMission(missionId);
      send("LAUNCH_MISSION");
    }
  }, [missionId, gameMission, playerName, navigate, setMission, send, isDemo]);

  useEffect(() => {
    if (isDemo && phase === "flight" && !demoSkipped.current) {
      demoSkipped.current = true;
      const steps: Array<Parameters<typeof send>[0]> = [
        "START_COAST", "REACH_ORBIT", "LOCK_TARGET",
        "BEGIN_DESCENT", "TOUCH_DOWN", "OPEN_HATCH", "STEP_OUT",
      ];
      let delay = 0;
      for (const step of steps) {
        delay += 100;
        setTimeout(() => send(step), delay);
      }
    }
  }, [isDemo, phase, send]);

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
      {isDemo && (
        <div className="pointer-events-none fixed left-4 bottom-4 z-[60] rounded-full bg-warn/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warn backdrop-blur">
          Demo Mode
        </div>
      )}
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
  const missionId = useGameStore((s) => s.missionId);
  const mission = getMission(missionId ?? "apollo-11");
  const sunData = getSunPosition(mission.landing.lat, mission.landing.lon, mission.evaSunTime);
  const isMars = mission.planet === "mars";

  return (
    <>
      {isMars ? (
        <>
          <color attach="background" args={["#2a1a0e"]} />
          <fog attach="fog" args={["#c4956a", 60, 250]} />
          <Stars radius={300} depth={80} count={2000} factor={3} saturation={0.3} fade speed={0.05} />
          <ambientLight intensity={0.12} color="#e8c4a0" />
          <hemisphereLight args={["#c49060", "#3a2010", 0.15]} />
        </>
      ) : (
        <>
          <Stars radius={300} depth={80} count={8000} factor={5} saturation={0.6} fade speed={0.1} />
          <ambientLight intensity={0.04} color="#333344" />
          <hemisphereLight args={["#667788", "#222228", 0.08]} />
        </>
      )}
      <directionalLight
        position={sunData.direction}
        intensity={isMars ? 2.0 : 3.0}
        color={isMars ? "#ffe0b0" : "#fff5e0"}
      />
      {/* Sun Disc */}
      <group position={[sunData.direction[0] * 3, sunData.direction[1] * 3, sunData.direction[2] * 3]}>
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh scale={[2.2, 2.2, 2.2]}>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial color="#fff4d0" transparent opacity={0.35} />
        </mesh>
      </group>
      <Suspense fallback={null}>
        <Terrain stlPath={mission.terrain.model} orthoPath={mission.terrain.ortho} lat={mission.landing.lat} lon={mission.landing.lon} planet={mission.planet} />
      </Suspense>
      <GroundPlane planet={mission.planet} />
      {!isMars && (
        <Suspense fallback={null}>
          <LMDescent position={[0, 0, 0]} scale={1} />
        </Suspense>
      )}
      <AscentAnimator />
    </>
  );
}

function LaunchScene() {
  const { t } = useTranslation();
  const send = useGameStore((s) => s.send);
  const missionId = useGameStore((s) => s.missionId);
  const mission = getMission(missionId ?? "apollo-11");
  const isRobotic = mission.missionType === "robotic";
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), isRobotic ? 2500 : 4000);
    const reportTimer = setTimeout(() => send("SHOW_REPORT"), isRobotic ? 3500 : 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(reportTimer);
    };
  }, [send, isRobotic]);

  return (
    <div className="relative h-screen w-full">
      {!isRobotic && (
        <Canvas
          camera={{ position: [15, 3, 15], fov: 55, near: 0.1, far: 2000 }}
          gl={{ antialias: false, toneMapping: THREE.AgXToneMapping }}
        >
          <color attach="background" args={["#000000"]} />
          <LaunchSceneContent />
          <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} />
        </Canvas>
      )}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-12">
        <div className="rounded-lg bg-space-950/85 px-6 py-3 backdrop-blur">
          <p className="font-display text-lg text-regolith-200">
            {t(isRobotic ? "flight.missionEndNarration" : "flight.ascentNarration")}
          </p>
        </div>
      </div>
      {fade && (
        <div className="absolute inset-0 z-20 bg-space-950 transition-opacity duration-1000" />
      )}
    </div>
  );
}
