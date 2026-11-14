import { useEffect, useRef, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { damp3 } from "maath/easing";
import { useGameStore, type GamePhase } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { DebugPanel } from "@/components/DebugPanel";
import { gameAudio } from "@/lib/gameAudio";
import { preloadNarration, playNarration, stopNarration, unlockAudio, onNarrationComplete } from "@/lib/narration";
import { isTouchDevice, useIsPortrait } from "@/lib/useMobile";
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      missionIdRef.current = s.missionId;
    });
    preloadNarration(missionIdRef.current ?? undefined);
    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      const phase = s.phase;
      const prev = prevPhase.current;
      if (phase === prev) return;
      prevPhase.current = phase;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const mid = s.missionId ?? undefined;
      const missionSpec = mid ? getMissionOrNull(mid) : null;
      const isRobotic = missionSpec?.missionType === "robotic";

      if (phase === "flight" && prev === "select") {
        preloadNarration(mid);
        gameAudio.unlock();
        unlockAudio();
        gameAudio.playCountdown();
        timerRef.current = setTimeout(() => {
          if (useGameStore.getState().phase !== "flight") return;
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
        if (missionSpec?.planet === "mars") {
          gameAudio.startMarsWind();
        } else {
          gameAudio.startLunarHum();
        }
      }
      if (!SURFACE_PHASES.has(phase) && SURFACE_PHASES.has(prev)) {
        if (!isRobotic) gameAudio.stopBreathing();
        gameAudio.stopLunarHum();
        gameAudio.stopMarsWind();
      }

      if (phase === "explore") {
        gameAudio.playQuindar();
      }

      if (phase === "launch") {
        gameAudio.stopLunarHum();
        gameAudio.stopMarsWind();
        gameAudio.stopBreathing();
        gameAudio.playCountdown();
        timerRef.current = setTimeout(() => {
          if (useGameStore.getState().phase === "launch") {
            gameAudio.startEngine();
          }
        }, 1600);
      }

      if (phase === "report") {
        gameAudio.stopEngine();
        gameAudio.stopSpaceDrone();
        gameAudio.stopLunarHum();
        gameAudio.stopMarsWind();
        stopNarration();
        gameAudio.playSuccess();
      }
    });
    return unsub;
  }, []);

  return null;
}

function useOrientationLock() {
  useEffect(() => {
    if (!isTouchDevice()) return;
    const so = screen.orientation as (ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void }) | undefined;
    if (!so?.lock) return;
    so.lock("landscape-primary").catch(() => {});
    return () => {
      so?.unlock?.();
    };
  }, []);
}

function LandscapeNudge() {
  const isPortrait = useIsPortrait();
  const touch = isTouchDevice();
  if (!touch || !isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-space-950/95 backdrop-blur-xl">
      <div className="animate-[spin_2s_ease-in-out_infinite_alternate] text-6xl">📱</div>
      <p className="max-w-xs text-center font-display text-lg font-bold text-regolith-100">
        Please rotate your phone to landscape mode
      </p>
      <p className="text-sm text-regolith-400">
        The mission requires a horizontal view
      </p>
    </div>
  );
}

function SceneFade({ phase }: { phase: string }) {
  const prevPhase = useRef(phase);
  const [opaque, setOpaque] = useState(false);

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
      setOpaque(true);
      const timer = setTimeout(() => setOpaque(false), 320);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-700 ease-out ${opaque ? "opacity-100" : "opacity-0"}`}
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

  useOrientationLock();

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
      navigate("/missions");
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
      <LandscapeNudge />
      {isDemo && (
        <div className="pointer-events-none fixed left-4 bottom-40 sm:bottom-4 z-[60] rounded-full bg-warn/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-warn backdrop-blur">
          Demo Mode
        </div>
      )}
      <DebugPanel />
    </div>
  );
}

const _launchCamPos = new THREE.Vector3();
const _launchLook = new THREE.Vector3();

function AscentAnimator() {
  const ref = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));
  const elapsed = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    elapsed.current += dt;
    const t = elapsed.current;
    const ignition = Math.min(t / 1.2, 1);
    const liftT = Math.max(0, t - 1.0);
    const y = 0.85 * Math.pow(liftT, 1.75);
    const shake = ignition > 0.2 ? Math.sin(t * 28) * 0.015 * Math.max(0, 1 - liftT * 0.4) : 0;

    if (ref.current) {
      ref.current.position.set(shake, y, 0);
      ref.current.rotation.z = Math.sin(t * 2.5) * 0.015;
    }
    if (flameRef.current) {
      const fScale = ignition * (0.85 + Math.sin(t * 15) * 0.25);
      flameRef.current.visible = ignition > 0.05;
      flameRef.current.scale.set(ignition, fScale, ignition);
    }
    _launchCamPos.set(15, 2.5 + y * 0.12, 15);
    _launchLook.set(0, y * 0.65, 0);
    damp3(state.camera.position, _launchCamPos, 0.35, dt);
    damp3(lookRef.current, _launchLook, 0.25, dt);
    state.camera.lookAt(lookRef.current);
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

function MarsAscentAnimator() {
  const ref = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));
  const elapsed = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    elapsed.current += dt;
    const t = elapsed.current;
    const ignition = Math.min(t / 1.0, 1);
    const liftT = Math.max(0, t - 0.8);
    const y = 1.15 * Math.pow(liftT, 1.75);
    const shake = ignition > 0.2 ? Math.sin(t * 26) * 0.012 * Math.max(0, 1 - liftT * 0.4) : 0;

    if (ref.current) {
      ref.current.position.set(shake, y, 0);
      ref.current.rotation.z = Math.sin(t * 2) * 0.01;
    }
    if (flameRef.current) {
      const fScale = ignition * (0.7 + Math.sin(t * 14) * 0.2);
      flameRef.current.visible = ignition > 0.05;
      flameRef.current.scale.set(ignition, fScale, ignition);
    }
    _launchCamPos.set(15, 2.5 + y * 0.15, 15);
    _launchLook.set(0, y * 0.65, 0);
    damp3(state.camera.position, _launchCamPos, 0.35, dt);
    damp3(lookRef.current, _launchLook, 0.25, dt);
    state.camera.lookAt(lookRef.current);
  });

  return (
    <group ref={ref}>
      {/* Probe body */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.3, 1.0, 12]} />
        <meshStandardMaterial color="#b8b8b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.2, 0.06, 0.06, 12]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.85, 0, 0]}>
        <boxGeometry args={[0.7, 0.015, 0.3]} />
        <meshStandardMaterial color="#1a3366" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-0.85, 0, 0]}>
        <boxGeometry args={[0.7, 0.015, 0.3]} />
        <meshStandardMaterial color="#1a3366" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, -0.7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 1.5, 8]} />
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
          <color attach="background" args={["#b07850"]} />
          <fog attach="fog" args={["#c4956a", 50, 220]} />
          <ambientLight intensity={0.18} color="#e8c4a0" />
          <hemisphereLight args={["#c49060", "#3a2010", 0.25]} />
        </>
      ) : (
        <>
          <color attach="background" args={["#000000"]} />
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
      {isMars ? <MarsAscentAnimator /> : <AscentAnimator />}
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
    let cancelWait: (() => void) | null = null;
    let reportTimer: ReturnType<typeof setTimeout> | null = null;
    const fadeTimer = setTimeout(() => {
      cancelWait = onNarrationComplete(() => {
        setFade(true);
        reportTimer = setTimeout(() => send("SHOW_REPORT"), 1000);
      }, 10000);
    }, isRobotic ? 3000 : 4000);
    return () => {
      clearTimeout(fadeTimer);
      if (cancelWait) cancelWait();
      if (reportTimer) clearTimeout(reportTimer);
    };
  }, [send, isRobotic]);

  return (
    <div className="relative h-screen w-full">
      <Canvas
        camera={{ position: [15, 2.5, 15], fov: 55, near: 0.1, far: 2000 }}
        gl={{ antialias: false, toneMapping: THREE.AgXToneMapping }}
      >
        <LaunchSceneContent />
        <Effects bloom vignette bloomThreshold={0.55} bloomIntensity={1.0} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-12">
        <div className="rounded-lg bg-space-950/85 px-6 py-3 backdrop-blur">
          <p className="font-display text-lg text-regolith-200">
            {t(isRobotic ? "flight.missionEndNarration" : "flight.ascentNarration")}
          </p>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-space-950 transition-opacity duration-1000 ease-in ${fade ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
