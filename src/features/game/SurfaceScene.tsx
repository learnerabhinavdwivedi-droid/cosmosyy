import {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import { useGameStore } from "@/store/useGameStore";
import { useAppStore } from "@/store/useAppStore";
import { gameAudio } from "@/lib/gameAudio";
import { LMDescent } from "./LunarModule";
import { Terrain, GroundPlane } from "./Terrain";
import {
  getApollo11SunPosition,
  getApollo11EarthPosition,
} from "./sunPosition";
import missionData from "../../../content/missions/apollo-11.json";
import * as THREE from "three";

interface HeritageObjectDef {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
  xp: number;
}

const OBJECTS: HeritageObjectDef[] = missionData.objects.map((o) => ({
  id: o.id,
  name: o.name,
  position: o.position as [number, number, number],
  description: o.description,
  xp: o.xp,
}));

const TOTAL_OBJECTS = OBJECTS.length;
const SCAN_RANGE = 5;

function HeritageMarker({
  obj,
  isFound,
  isNear,
}: {
  obj: HeritageObjectDef;
  isFound: boolean;
  isNear: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ringRef.current && !isFound) {
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(Date.now() * 0.004) * 0.3;
    }
    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = isNear
        ? 0.4
        : 0.15;
    }
  });

  if (obj.id === "descent-stage") return null;

  const ringColor = isFound ? "#66ff99" : "#ffd36e";

  return (
    <group position={obj.position}>
      {/* Golden torus ring on the ground */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
      >
        <torusGeometry args={[1.2, 0.05, 8, 48]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Vertical beam */}
      {!isFound && (
        <mesh ref={beamRef} position={[0, 4, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 8, 6]} />
          <meshBasicMaterial
            color="#ffd36e"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Name label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.28}
        color={isFound ? "#66ff99" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {obj.name}
        {isFound ? " ✓" : ""}
      </Text>
    </group>
  );
}

function ProximityDetector({
  setNearObjectId,
}: {
  setNearObjectId: (id: string | null) => void;
}) {
  const { camera } = useThree();
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const prevNearest = useRef<string | null>(null);

  useFrame(() => {
    let nearest: string | null = null;
    let minDist = SCAN_RANGE;

    for (const obj of OBJECTS) {
      if (found.includes(obj.id)) continue;
      const dx = camera.position.x - obj.position[0];
      const dz = camera.position.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = obj.id;
      }
    }

    if (nearest !== prevNearest.current) {
      prevNearest.current = nearest;
      setNearObjectId(nearest);
    }
  });

  return null;
}

const LUNAR_G = 1.62;
const EYE_HEIGHT = 1.7;
const GROUND_Y = 0;
const JUMP_V0 = 1.8;
const _moveDir = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

function PlayerController() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const isPointerLocked = useRef(false);
  const phaseRef = useRef(useGameStore.getState().phase);

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase;
      if (s.phase === "inspect") {
        document.exitPointerLock();
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, euler.current.x),
      );
      camera.quaternion.setFromEuler(euler.current);
    };
    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    camera.position.set(5, EYE_HEIGHT, 10);
    euler.current.y = -0.4;
    camera.quaternion.setFromEuler(euler.current);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [camera]);

  useFrame((_state, delta) => {
    if (phaseRef.current === "inspect") {
      velocity.current.set(0, 0, 0);
      return;
    }

    const k = keys.current;
    const speed = k["ShiftLeft"] || k["ShiftRight"] ? 4 : 2;
    _moveDir.set(0, 0, 0);

    if (k["KeyW"] || k["ArrowUp"]) _moveDir.z -= 1;
    if (k["KeyS"] || k["ArrowDown"]) _moveDir.z += 1;
    if (k["KeyA"] || k["ArrowLeft"]) _moveDir.x -= 1;
    if (k["KeyD"] || k["ArrowRight"]) _moveDir.x += 1;

    if (_moveDir.length() > 0) {
      _moveDir.normalize();
      _moveDir.applyQuaternion(camera.quaternion);
      _moveDir.y = 0;
      _moveDir.normalize();
    }

    velocity.current.lerp(_moveDir.multiplyScalar(speed), delta * 3);
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;

    const onGround = camera.position.y <= GROUND_Y + EYE_HEIGHT + 0.01;

    if (k["Space"] && onGround) {
      verticalVel.current = JUMP_V0;
    }

    verticalVel.current -= LUNAR_G * delta;
    camera.position.y += verticalVel.current * delta;

    if (camera.position.y < GROUND_Y + EYE_HEIGHT) {
      camera.position.y = GROUND_Y + EYE_HEIGHT;
      verticalVel.current = 0;
    }
  });

  return null;
}

function InspectCamera() {
  const { camera } = useThree();
  const inspecting = useGameStore((s) => s.inspecting);
  const phase = useGameStore((s) => s.phase);
  const lerpProgress = useRef(0);

  useFrame((_state, delta) => {
    if (phase !== "inspect" || !inspecting.objectId) return;
    const obj = OBJECTS.find((o) => o.id === inspecting.objectId);
    if (!obj) return;

    lerpProgress.current = Math.min(lerpProgress.current + delta * 2, 1);

    _lookTarget.set(obj.position[0], obj.position[1] + 1, obj.position[2]);
    camera.getWorldDirection(_currentLook);
    _currentLook.add(camera.position);
    _currentLook.lerp(_lookTarget, lerpProgress.current * 0.08);
    camera.lookAt(_currentLook);
  });

  useEffect(() => {
    lerpProgress.current = 0;
  }, [inspecting.objectId]);

  return null;
}

function EarthInSky() {
  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  const earthPos = useMemo(() => getApollo11EarthPosition(), []);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <mesh ref={ref} position={earthPos}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function SunLight() {
  const sunData = useMemo(() => getApollo11SunPosition(), []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[Sun] elevation: ${sunData.elevation.toFixed(1)}°, azimuth: ${sunData.azimuth.toFixed(1)}°`,
      );
    }
  }, [sunData]);

  return (
    <directionalLight
      position={sunData.direction}
      intensity={3.0}
      color="#fff5e0"
      castShadow
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
      shadow-camera-near={1}
      shadow-camera-far={300}
      shadow-camera-left={-60}
      shadow-camera-right={60}
      shadow-camera-top={60}
      shadow-camera-bottom={-60}
      shadow-bias={-0.0002}
    />
  );
}

function SurfaceSceneContent({
  setNearObjectId,
  nearObjectId,
}: {
  setNearObjectId: (id: string | null) => void;
  nearObjectId: string | null;
}) {
  const found = useGameStore((s) => s.objectsFoundThisRun);

  return (
    <>
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={4}
        fade
        speed={0}
      />

      <ambientLight intensity={0.02} color="#333344" />
      <SunLight />

      <Suspense fallback={null}>
        <EarthInSky />
      </Suspense>

      <Suspense fallback={<GroundPlane />}>
        <Terrain />
      </Suspense>
      <GroundPlane />

      <Suspense fallback={null}>
        <LMDescent position={[0, 0, 0]} scale={1} />
      </Suspense>

      {OBJECTS.map((obj) => (
        <HeritageMarker
          key={obj.id}
          obj={obj}
          isFound={found.includes(obj.id)}
          isNear={nearObjectId === obj.id}
        />
      ))}

      <ProximityDetector setNearObjectId={setNearObjectId} />
      <PlayerController />
      <InspectCamera />
    </>
  );
}

function InspectOverlay() {
  const { t } = useTranslation();
  const objectId = useGameStore((s) => s.inspecting.objectId);
  const send = useGameStore((s) => s.send);
  const obj = OBJECTS.find((o) => o.id === objectId);
  const [visible, setVisible] = useState(false);

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

  if (!obj) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-end pointer-events-none">
      <div className="absolute inset-0 bg-space-950/40" />
      <div
        className={`pointer-events-auto relative m-4 w-80 rounded-xl border border-space-700 bg-space-900/95 p-6 backdrop-blur-md transition-all duration-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
      >
        <h2 className="font-display text-xl font-bold text-regolith-200">
          {obj.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-regolith-400">
          {obj.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded bg-signal/20 px-2 py-1 text-xs text-signal">
            +{obj.xp} XP
          </span>
        </div>
        <div className="mt-4 border-t border-space-700 pt-3">
          <p className="text-xs text-regolith-400/60">
            {t("inspect.pressEsc")}
          </p>
        </div>
      </div>
    </div>
  );
}

function SurfaceHUD({ nearObjectId }: { nearObjectId: string | null }) {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const found = useGameStore((s) => s.objectsFoundThisRun);
  const send = useGameStore((s) => s.send);
  const addFoundObject = useGameStore((s) => s.addFoundObject);
  const findObject = useAppStore((s) => s.findObject);
  const missionId = useGameStore((s) => s.missionId);
  const playerName = useAppStore((s) => s.player.name);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const narration = useMemo(() => {
    if (found.length >= TOTAL_OBJECTS) {
      return t("surface.narrationAllFound");
    }
    if (found.length > 0) {
      return t("surface.narrationProgress", { found: found.length, total: TOTAL_OBJECTS });
    }
    return t("surface.narrationStart", { name: playerName || "" });
  }, [found.length, playerName, t]);

  const handleInteract = useCallback(() => {
    if (!nearObjectId || found.includes(nearObjectId) || !missionId) return;
    const obj = OBJECTS.find((o) => o.id === nearObjectId);
    addFoundObject(nearObjectId);
    findObject(missionId, nearObjectId);
    send("START_INSPECT", { objectId: nearObjectId });
    gameAudio.playRadioBeep();

    setToast(t("xp.object", { amount: obj?.xp ?? 50, name: obj?.name ?? nearObjectId }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, [nearObjectId, found, missionId, addFoundObject, findObject, send, t]);

  const handleFlag = useCallback(() => {
    if (!missionId) return;
    useAppStore.getState().plantFlag(missionId);
    send("PLANT_FLAG");
    gameAudio.playSuccess();
    setToast(t("xp.flag", { amount: 100 }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, [missionId, send, t]);

  const handleLaunch = useCallback(() => {
    send("LAUNCH_HOME");
  }, [send]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") handleInteract();
      if ((e.key === "f" || e.key === "F") && phase === "flagReady")
        handleFlag();
      if ((e.key === "l" || e.key === "L") && phase === "flagPlanted")
        handleLaunch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleInteract, handleFlag, handleLaunch]);

  useEffect(() => {
    if (found.length >= TOTAL_OBJECTS && phase === "explore") {
      send("ALL_FOUND");
    }
  }, [found.length, phase, send]);

  const nearObj = OBJECTS.find((o) => o.id === nearObjectId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top: objects found */}
      <div className="mx-auto mt-4 rounded-lg bg-space-950/80 px-4 py-2 text-center backdrop-blur">
        <p className="text-sm text-regolith-400">
          {t("surface.objectCount", { found: found.length, total: TOTAL_OBJECTS })}
        </p>
      </div>

      {/* XP toast */}
      {toast && (
        <div className="mx-auto mt-4 animate-pulse rounded-lg bg-signal/20 px-5 py-2 text-center backdrop-blur">
          <p className="font-display text-lg font-bold text-signal">{toast}</p>
        </div>
      )}

      {/* Interaction prompt */}
      {nearObj && !found.includes(nearObj.id) && phase !== "inspect" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-space-950/90 px-6 py-3 text-center backdrop-blur">
          <p className="font-display text-lg text-signal">
            [E] {t("surface.inspectPrompt")} {nearObj.name}
          </p>
        </div>
      )}

      {phase === "flagReady" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-signal/20 px-6 py-3 text-center backdrop-blur">
          <p className="animate-pulse font-display text-lg text-signal">
            [F] {t("surface.flagPrompt")}
          </p>
        </div>
      )}

      {phase === "flagPlanted" && (
        <div className="mx-auto mt-auto mb-32 rounded-lg bg-signal/20 px-6 py-3 text-center backdrop-blur">
          <p className="animate-pulse font-display text-lg text-signal">
            [L] {t("surface.launchPrompt")}
          </p>
        </div>
      )}

      {/* Bottom narration bar */}
      <div className="mt-auto px-4 pb-4">
        <div className="mx-auto max-w-2xl rounded-lg bg-space-950/85 px-6 py-3 backdrop-blur">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 text-xs font-bold tracking-widest text-signal">
              {t("surface.eva")}
            </span>
            <p className="text-sm leading-relaxed text-regolith-200">
              {narration}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom left: controls hint */}
      <div className="mb-2 ml-4">
        <p className="text-xs text-regolith-400/60">
          {t("surface.controlHints")}
        </p>
      </div>
    </div>
  );
}

export function SurfaceScene() {
  const phase = useGameStore((s) => s.phase);
  const [nearObjectId, setNearObjectId] = useState<string | null>(null);

  const handleCanvasClick = useCallback(() => {
    document.body.requestPointerLock();
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div className="h-full w-full" onClick={handleCanvasClick}>
        <Canvas
          shadows
          camera={{
            position: [5, 1.7, 10],
            fov: 70,
            near: 0.1,
            far: 2000,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.AgXToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <color attach="background" args={["#000000"]} />
          <SurfaceSceneContent
            nearObjectId={nearObjectId}
            setNearObjectId={setNearObjectId}
          />
        </Canvas>
      </div>
      <SurfaceHUD nearObjectId={nearObjectId} />
      {phase === "inspect" && <InspectOverlay />}
    </div>
  );
}
